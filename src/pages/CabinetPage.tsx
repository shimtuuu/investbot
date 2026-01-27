import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfoIcon } from "../components/icons";
import { companyTariffs } from "../config/companyTariffs";
import { getTelegramUser } from "../lib/telegram";
import { showMessage } from "../lib/notify";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  reinvestEarnings,
  requestAmount,
  toggleAutoReinvest,
  transferToBalance,
  transferToDeposit,
  useWalletState
} from "../lib/wallet";

type Currency = "RUB" | "USDT";

type TrendCoin = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  series: number[];
  image: string | undefined;
};

const MARKET_CACHE_KEY = "investbot.markets.v1";
const MARKET_TTL_MS = 5 * 60 * 1000;

const marketIds = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "tron",
  "solana",
  "the-open-network",
  "litecoin"
] as const;

const fallbackTrends: TrendCoin[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 87926,
    change: -1.3,
    series: [62, 60, 58, 55, 57, 54, 52, 50, 49, 51, 50, 48],
    image: undefined
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 2380,
    change: -0.9,
    series: [42, 44, 41, 39, 40, 38, 37, 36, 35, 36, 35, 34],
    image: undefined
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 328,
    change: 0.7,
    series: [48, 49, 48, 47, 49, 50, 49, 50, 51, 52, 51, 53],
    image: undefined
  },
  {
    id: "tron",
    symbol: "TRX",
    name: "TRON",
    price: 0.12,
    change: 1.6,
    series: [18, 19, 20, 19, 21, 22, 23, 22, 24, 23, 25, 26],
    image: undefined
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 152,
    change: 4.8,
    series: [28, 30, 32, 31, 35, 38, 41, 45, 44, 47, 50, 53],
    image: undefined
  },
  {
    id: "the-open-network",
    symbol: "TON",
    name: "Toncoin",
    price: 2.9,
    change: 2.1,
    series: [22, 23, 24, 23, 25, 26, 27, 28, 27, 28, 29, 30],
    image: undefined
  },
  {
    id: "litecoin",
    symbol: "LTC",
    name: "Litecoin",
    price: 86,
    change: -0.4,
    series: [36, 35, 34, 33, 34, 33, 32, 31, 30, 31, 30, 29],
    image: undefined
  }
];

const compactSeries = (values: number[], points = 12) => {
  if (!values.length) return values;
  if (values.length <= points) return values;
  const step = values.length / points;
  const next: number[] = [];
  for (let i = 0; i < points; i += 1) {
    const idx = Math.floor(i * step);
    next.push(values[idx]);
  }
  return next;
};

const sparklinePath = (values: number[], width: number, height: number) => {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

export default function CabinetPage() {
  const navigate = useNavigate();
  const { wallet, metrics } = useWalletState();
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [trendCoins, setTrendCoins] = useState<TrendCoin[]>(fallbackTrends);

  const user = getTelegramUser();
  const userId = user?.id ? `ID ${user.id}` : "ID не определен";
  const userName = user?.username ? `@${user.username}` : user?.first_name ?? "Пользователь";
  const levelInfo = metrics.levelInfo;

  const trendCards = useMemo(
    () =>
      trendCoins.map((coin) => ({
        ...coin,
        path: sparklinePath(coin.series, 120, 40),
        isUp: coin.change >= 0
      })),
    [trendCoins]
  );

  const tariffProgress = useMemo(() => {
    const sorted = [...companyTariffs].sort((a, b) => a.min - b.min);
    const invested = wallet.invested;
    const current = sorted.reduce((acc, item) => (invested >= item.min ? item : acc), sorted[0]);
    const next = sorted.find((item) => item.min > invested) ?? null;
    const span = next ? next.min - current.min : current.max - current.min;
    const rawProgress =
      span > 0 ? ((invested - current.min) / span) * 100 : next ? 0 : 100;
    const progress = Math.min(100, Math.max(0, rawProgress));
    const remaining = next ? Math.max(0, next.min - invested) : 0;
    return { current, next, progress, remaining };
  }, [wallet.invested]);

  useEffect(() => {
    let active = true;
    const readCache = () => {
      try {
        const raw = localStorage.getItem(MARKET_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ts: number; items: TrendCoin[] };
        if (!parsed?.ts || !Array.isArray(parsed.items)) return null;
        if (Date.now() - parsed.ts > MARKET_TTL_MS) return null;
        return parsed.items;
      } catch {
        return null;
      }
    };

    const saveCache = (items: TrendCoin[]) => {
      try {
        localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
      } catch {
        // ignore
      }
    };

    const fetchTrends = async () => {
      const cached = readCache();
      if (cached && active) {
        setTrendCoins(cached);
        return;
      }
      try {
        const marketsRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${marketIds.join(
            ","
          )}&sparkline=true&price_change_percentage=24h`
        );
        if (!marketsRes.ok) throw new Error("markets failed");
        const markets = (await marketsRes.json()) as Array<{
          id: string;
          symbol: string;
          name: string;
          image?: string;
          current_price?: number;
          price_change_percentage_24h?: number;
          sparkline_in_7d?: { price?: number[] };
        }>;

        const mapped: TrendCoin[] = markets.map((coin) => ({
          id: coin.id,
          symbol: coin.symbol?.toUpperCase() ?? "",
          name: coin.name ?? "",
          image: coin.image ?? undefined,
          price: Number(coin.current_price ?? 0),
          change: Number(coin.price_change_percentage_24h ?? 0),
          series: compactSeries(coin.sparkline_in_7d?.price ?? [])
        }));
        const byId = new Map(mapped.map((item) => [item.id, item]));
        const items: TrendCoin[] = marketIds
          .map((id) => byId.get(id))
          .filter((item): item is TrendCoin => Boolean(item));

        if (active && items.length) {
          setTrendCoins(items);
          saveCache(items);
        }
      } catch {
        // keep fallback
      }
    };

    fetchTrends();
    return () => {
      active = false;
    };
  }, []);

  const handleDeposit = async () => {
    const { value: amount, cancelled } = await requestAmount("Пополнение", currency);
    if (cancelled) {
      return;
    }
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const result = transferToDeposit(amount);
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage(
      "Готово",
      `Средства переведены в депозит на ${formatCurrency(amount, currency)}.`
    );
  };

  const handleWithdraw = async () => {
    if (wallet.invested <= 0) {
      await showMessage("Ошибка", "Недостаточно средств в депозите.");
      return;
    }
    const { value: amount, cancelled } = await requestAmount("Вывод средств", currency);
    if (cancelled) {
      return;
    }
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const result = transferToBalance(amount);
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage(
      "Готово",
      `Средства выведены из депозита на ${formatCurrency(amount, currency)}.`
    );
  };

  const handleReinvest = async () => {
    if (wallet.balance <= 0) {
      return;
    }
    const result = reinvestEarnings();
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage("Реинвест", "Прибыль переведена в депозит.");
  };

  const handleAutoReinvest = async () => {
    const next = toggleAutoReinvest();
    await showMessage(
      "Авто-реинвест",
      next.autoReinvest ? "Авто-реинвест включен." : "Авто-реинвест выключен."
    );
  };

  return (
    <section className="page page--cabinet">
      <div className="section-header reveal">
        <h1>Кабинет</h1>
        <p className="muted">Ваш профиль и активы</p>
      </div>

      <div className="card profile-card reveal" style={{ animationDelay: "60ms" }}>
        <div className="profile-row">
          <div>
            <div className="profile-title">Профиль</div>
            <div className="muted">{userName}</div>
            <div className="muted">{userId}</div>
          </div>
          <div className="profile-level">{levelInfo.current.name}</div>
        </div>
        <div className="profile-rate">
          Доходность {formatPercent(levelInfo.current.rate)} в день
        </div>
      </div>

      <div className="card summary-card reveal" style={{ animationDelay: "120ms" }}>
        <div className="summary-head">
          <div>
            <div className="card-title">Сводка</div>
            <div className="muted">Баланс и доход</div>
          </div>
          <div className="currency-toggle">
            <button
              className={`currency-chip ${currency === "RUB" ? "is-active" : ""}`}
              onClick={() => setCurrency("RUB")}
            >
              ₽
            </button>
            <button
              className={`currency-chip ${currency === "USDT" ? "is-active" : ""}`}
              onClick={() => setCurrency("USDT")}
            >
              USDT
            </button>
          </div>
        </div>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Депозит</span>
            <strong>{formatCurrency(wallet.invested, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Доход в день</span>
            <strong>{formatCurrency(metrics.dailyIncome, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Доступно к выводу</span>
            <strong>{formatCurrency(wallet.balance, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Выведено всего</span>
            <strong>{formatCurrency(wallet.totalWithdrawn, currency)}</strong>
          </div>
        </div>
      </div>

      <div className="card progress-card reveal" style={{ animationDelay: "180ms" }}>
        <div className="progress-head">
          <div>
            <div className="card-title">Прогресс тарифа</div>
            <div className="muted">
              {tariffProgress.next
                ? `До следующего: ${formatCurrency(tariffProgress.remaining, currency)}`
                : "Максимальный тариф"}
            </div>
          </div>
          <div className="level-badge">{tariffProgress.current.name}</div>
        </div>
        <div className="progress-meta">
          <span className="muted">Следующий тариф</span>
          <strong>{tariffProgress.next ? tariffProgress.next.name : "Максимум"}</strong>
        </div>
        <div className="progress" title="Чем выше уровень — тем выше доходность">
          <span style={{ width: `${tariffProgress.progress}%` }} />
        </div>
        <div className="progress-foot">
          <span className="muted">
            {tariffProgress.next
              ? `Осталось: ${formatCurrency(tariffProgress.remaining, currency)}`
              : "Тариф максимальный"}
          </span>
          <button className="info-link" type="button" onClick={() => navigate("/info")}>
            <InfoIcon size={14} />
            Правила тарифов
          </button>
        </div>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "200ms" }}>
        <h2>В тренде</h2>
        <span className="muted">Курс популярных монет</span>
      </div>

      <div className="trend-grid" aria-label="Курс криптовалют">
        {trendCards.map((coin) => {
          return (
            <div key={coin.symbol} className="trend-card">
              <div className="trend-header">
                <span className="trend-logo">
                  {coin.image ? (
                    <img src={coin.image} alt={coin.name} loading="lazy" />
                  ) : (
                    <span>{coin.symbol.slice(0, 1)}</span>
                  )}
                </span>
                <svg className="trend-sparkline" viewBox="0 0 120 40" aria-hidden="true">
                  <path
                    d={coin.path}
                    className={
                      coin.isUp
                        ? "sparkline-stroke sparkline-stroke--up"
                        : "sparkline-stroke sparkline-stroke--down"
                    }
                  />
                </svg>
              </div>
              <div className="trend-name">{coin.name}</div>
              <div className="trend-meta">
                <span className="trend-price">{formatNumber(coin.price)} ₽</span>
                <span className={`trend-pill ${coin.isUp ? "trend-pill--up" : "trend-pill--down"}`}>
                  {coin.isUp ? "↑" : "↓"} {coin.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-bar">
        <button className="btn btn--primary" onClick={handleDeposit}>
          Пополнить
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleWithdraw}
        >
          Вывести
        </button>
        <div className="action-toggle">
          <span className="muted">Авто-реинвест</span>
          <button
            className={`toggle ${wallet.autoReinvest ? "toggle--on" : ""}`}
            onClick={handleAutoReinvest}
            type="button"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        <button
          className="btn btn--ghost"
          onClick={handleReinvest}
          disabled={wallet.balance <= 0}
        >
          Реинвест
        </button>
      </div>

    </section>
  );
}
