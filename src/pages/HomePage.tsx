import { useMemo, useRef, useState, type TouchEvent } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "../components/icons";
import { brand } from "../config/brand";
import { companyTariffs } from "../config/companyTariffs";
import { openExternal, showMessage } from "../lib/notify";
import { formatMoney, useWalletState } from "../lib/wallet";
import { cn } from "../lib/cn";
import okxLogo from "../assets/logos/okx.svg";
import bybitLogo from "../assets/logos/bybit.svg";
import binanceLogo from "../assets/logos/binance.svg";
import { links } from "../config/links";

const heroSlides = [
  {
    label: brand.name.toUpperCase(),
    title: brand.tagline,
    subtitle: "Баланс под защитой, доход работает 24/7.",
    primaryLabel: "Открыть тарифы",
    primaryTo: "/cabinet",
    secondaryLabel: "Кошелек",
    secondaryTo: "/wallet"
  },
  {
    label: brand.name.toUpperCase(),
    title: "Пополняйте баланс за минуты",
    subtitle: "Кошелек и калькулятор всегда под рукой.",
    primaryLabel: "Кошелек",
    primaryTo: "/wallet",
    secondaryLabel: "Партнеры",
    secondaryTo: "/partners"
  },
  {
    label: brand.name.toUpperCase(),
    title: "Еженедельные розыгрыши",
    subtitle: "Получайте билеты и награды за активность.",
    primaryLabel: "Розыгрыш",
    primaryTo: "/raffle",
    secondaryLabel: "Кабинет",
    secondaryTo: "/cabinet"
  }
] as const;

const seedTransactions = [
  {
    id: "1315529815",
    title: "Пополнение",
    time: "00:14",
    amount: 764,
    type: "in" as const
  },
  {
    id: "7545835987",
    title: "Вывод средств",
    time: "22:42",
    amount: 1000,
    type: "out" as const
  },
  {
    id: "8104597986",
    title: "Вывод средств",
    time: "22:42",
    amount: 9880,
    type: "out" as const
  },
  {
    id: "7775689341",
    title: "Пополнение",
    time: "22:15",
    amount: 100000,
    type: "in" as const
  }
] as const;

export default function HomePage() {
  const { transactions } = useWalletState();
  const [heroIndex, setHeroIndex] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const activeSlide = heroSlides[heroIndex];

  const liveItems = useMemo(
    () =>
      transactions.length > 0
        ? transactions.map((tx) => ({
            id: tx.id,
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            time: new Date(tx.ts).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit"
            })
          }))
        : seedTransactions,
    [transactions]
  );

  const handleSwipe = (direction: "next" | "prev") => {
    setHeroIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % heroSlides.length;
      }
      return (prev - 1 + heroSlides.length) % heroSlides.length;
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const moveX = event.touches[0]?.clientX ?? touchStartX.current;
    const moveY = event.touches[0]?.clientY ?? touchStartY.current;
    const deltaX = moveX - touchStartX.current;
    const deltaY = moveY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    handleSwipe(deltaX < 0 ? "next" : "prev");
  };

  const handlePromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) {
      await showMessage("Ошибка", "Введите промокод.");
      return;
    }
    await showMessage("Готово", "Промокод принят.");
    setPromoCode("");
  };

  return (
    <section className="page">
      <div
        className="hero card card--hero reveal"
        style={{ animationDelay: "60ms" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
          touchStartY.current = null;
        }}
      >
        <div className="hero-content">
          <p className="hero-label">{activeSlide.label}</p>
          <h1 className="hero-title">{activeSlide.title}</h1>
          <p className="hero-sub">{activeSlide.subtitle}</p>
        </div>
        <div className="hero-glow" aria-hidden="true" />
      </div>

      <div className="section-header reveal" style={{ animationDelay: "100ms" }}>
        <h2>Live транзакции</h2>
      </div>

      <div className="list">
        {liveItems.length === 0 ? (
          <div className="muted">Операций пока нет.</div>
        ) : (
          liveItems.map((item, index) => {
          const sign = item.type === "in" ? "+" : "-";
          const amount = `${sign}${formatMoney(item.amount)}`;
          return (
            <div
              key={item.id}
              className={cn(
                "list-item",
                item.type === "in" ? "list-item--credit" : "list-item--debit",
                "reveal"
              )}
              style={{ animationDelay: `${180 + index * 60}ms` }}
            >
              <div className="list-icon">
                {item.type === "in" ? <ArrowUpIcon size={18} /> : <ArrowDownIcon size={18} />}
              </div>
              <div className="list-body">
                <div className="list-title">{item.title}</div>
                <div className="list-sub">ID: {item.id}</div>
              </div>
              <div className="list-meta">
                <div className="list-time">{item.time}</div>
                <div className="list-amount">{amount}</div>
              </div>
            </div>
          );
        })
        )}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "220ms" }}>
        <h2 className="section-title">Тарифы компании</h2>
      </div>

      <div className="company-tariffs reveal" style={{ animationDelay: "260ms" }}>
        {companyTariffs.map((tariff) => {
          const toneClass = tariff.tone === "neutral" ? "" : `company-card--${tariff.tone}`;
          const logoSrc =
            tariff.logo === "okx" ? okxLogo : tariff.logo === "bybit" ? bybitLogo : binanceLogo;
          return (
          <div
            key={tariff.id}
            className={`company-card ${toneClass} ${tariff.wide ? "company-card--wide" : ""}`}
          >
            <div className="company-card-head">
              <div className="company-logo">
                <img src={logoSrc} alt={`${tariff.name} logo`} loading="lazy" />
              </div>
              <div>
                <div className="company-name">{tariff.name}</div>
                <div className="muted">{tariff.note}</div>
              </div>
            </div>
            <div className="company-meta">
              <div className="company-rate">+{tariff.rate.toFixed(1)}%</div>
              <div className="company-range muted">
                от {formatMoney(tariff.min)} до {formatMoney(tariff.max)}
              </div>
            </div>
          </div>
        )})}
      </div>

      <div className="card promo-card reveal" style={{ animationDelay: "300ms" }}>
        <div className="promo-body">
          <div className="promo-title">Активируй промокод</div>
          <div className="muted">
            Получай промокоды в нашем телеграм-канале и обменивай их на валюту
          </div>
          <div className="promo-form">
            <input
              className="promo-input"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="Введите промокод"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button className="promo-submit" onClick={handlePromo} type="button">
              Принять
            </button>
          </div>
        </div>
      </div>

      <div className="card support-card reveal" style={{ animationDelay: "340ms" }}>
        <div className="support-head">
          <div className="support-title">Поддержка</div>
          <span className="support-pill">24/7</span>
        </div>
        <div className="muted">Свяжитесь с нами, если у вас остались вопросы</div>
        <button className="btn btn--primary support-btn" onClick={() => openExternal(links.support)}>
          Обратиться в поддержку
        </button>
      </div>

    </section>
  );
}
