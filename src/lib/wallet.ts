import { useEffect, useMemo, useState } from "react";
import { requestInput } from "./notify";

export type WalletState = {
  balance: number;
  invested: number;
  earnings: number;
  totalWithdrawn: number;
  autoReinvest: boolean;
  lastAccrual: number;
};

export type TransactionItem = {
  id: string;
  title: string;
  amount: number;
  type: "in" | "out";
  ts: number;
};

const WALLET_KEY = "investbot.wallet.v1";
const TX_KEY = "investbot.txs.v1";
const WALLET_EVENT = "investbot.wallet:update";
const RATE_KEY = "investbot.usdtRate.v1";
const RATE_EVENT = "investbot.rate:update";

const defaultWallet: WalletState = {
  balance: 0,
  invested: 0,
  earnings: 0,
  totalWithdrawn: 0,
  autoReinvest: false,
  lastAccrual: Date.now()
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_USDT_RATE = 95;
const RATE_TTL_MS = 5 * 60 * 1000;

const levels = [
  { id: 1, name: "Уровень 1", min: 0, rate: 1.2 },
  { id: 2, name: "Уровень 2", min: 5_000, rate: 1.4 },
  { id: 3, name: "Уровень 3", min: 20_000, rate: 1.6 },
  { id: 4, name: "Уровень 4", min: 50_000, rate: 1.8 },
  { id: 5, name: "Уровень 5", min: 100_000, rate: 2.0 }
] as const;

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJSON = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const emitUpdate = () => {
  window.dispatchEvent(new Event(WALLET_EVENT));
};

type RateSnapshot = {
  rate: number;
  ts: number;
};

const readRate = () =>
  readJSON<RateSnapshot>(RATE_KEY, { rate: DEFAULT_USDT_RATE, ts: 0 });

let cachedRate = readRate().rate || DEFAULT_USDT_RATE;
let cachedRateTs = readRate().ts || 0;
let ratePromise: Promise<number> | null = null;

const setRate = (rate: number) => {
  if (!Number.isFinite(rate) || rate <= 0) return;
  cachedRate = rate;
  cachedRateTs = Date.now();
  writeJSON(RATE_KEY, { rate: cachedRate, ts: cachedRateTs });
  window.dispatchEvent(new Event(RATE_EVENT));
};

export const getUsdtRate = () =>
  Number.isFinite(cachedRate) && cachedRate > 0 ? cachedRate : DEFAULT_USDT_RATE;

export const refreshUsdtRate = async (force = false) => {
  if (typeof window === "undefined") return getUsdtRate();
  const now = Date.now();
  if (!force && cachedRateTs && now - cachedRateTs < RATE_TTL_MS) {
    return getUsdtRate();
  }
  if (ratePromise) return ratePromise;

  ratePromise = fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub"
  )
    .then(async (res) => {
      if (!res.ok) throw new Error("Rate request failed");
      const data = (await res.json()) as { tether?: { rub?: number } };
      const rate = data?.tether?.rub;
      if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
        setRate(rate);
        return rate;
      }
      throw new Error("Invalid rate");
    })
    .catch(() => getUsdtRate())
    .finally(() => {
      ratePromise = null;
    });

  return ratePromise;
};

const normalizeWallet = (wallet: WalletState) => ({
  ...defaultWallet,
  ...wallet
});

export const getLevelInfo = (invested: number) => {
  const current = levels.reduce((acc, level) => (invested >= level.min ? level : acc), levels[0]);
  const next = levels.find((level) => level.min > invested) ?? null;
  const span = next ? next.min - current.min : 0;
  const progress = next && span > 0 ? ((invested - current.min) / span) * 100 : 100;
  return {
    current,
    next,
    progress,
    remaining: next ? Math.max(0, next.min - invested) : 0
  };
};

const applyAccrual = (wallet: WalletState) => {
  const now = Date.now();
  const last = wallet.lastAccrual ?? now;
  const days = Math.floor((now - last) / DAY_MS);
  if (days <= 0 || wallet.invested <= 0) {
    return wallet;
  }
  const { current } = getLevelInfo(wallet.invested);
  const dailyIncome = (wallet.invested * current.rate) / 100;
  const accrued = roundAmount(dailyIncome * days);
  if (accrued <= 0) {
    return { ...wallet, lastAccrual: now };
  }
  const base = {
    ...wallet,
    earnings: roundAmount(wallet.earnings + accrued),
    lastAccrual: last + days * DAY_MS
  };
  if (wallet.autoReinvest) {
    return {
      ...base,
      invested: roundAmount(wallet.invested + accrued)
    };
  }
  return {
    ...base,
    balance: roundAmount(wallet.balance + accrued)
  };
};

export const getWallet = () => {
  const stored = readJSON(WALLET_KEY, defaultWallet);
  const normalized = normalizeWallet(stored);
  const updated = applyAccrual(normalized);
  if (updated !== normalized) {
    writeJSON(WALLET_KEY, updated);
  }
  return updated;
};

export const getTransactions = () => readJSON<TransactionItem[]>(TX_KEY, []);

const saveWallet = (wallet: WalletState) => {
  writeJSON(WALLET_KEY, wallet);
  emitUpdate();
  return wallet;
};

const saveTransactions = (items: TransactionItem[]) => {
  writeJSON(TX_KEY, items);
  emitUpdate();
};

const addTransaction = (title: string, amount: number, type: "in" | "out") => {
  const items = getTransactions();
  const tx: TransactionItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    amount,
    type,
    ts: Date.now()
  };
  const next = [tx, ...items].slice(0, 25);
  saveTransactions(next);
  return tx;
};

const roundAmount = (value: number) => Math.round(value * 100) / 100;

export const parseAmount = (raw: string) => {
  const normalized = raw.replace(/[^\d,.\-]/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return roundAmount(value);
};

export const requestAmount = async (title: string, currency: "RUB" | "USDT" = "RUB") => {
  const placeholder = currency === "USDT" ? "100" : "1000";
  const raw = await requestInput(title, "Введите сумму", placeholder);
  if (!raw) return null;
  const parsed = parseAmount(raw);
  if (!parsed) return null;
  if (currency === "USDT") {
    const rate = await refreshUsdtRate();
    return roundAmount(parsed * rate);
  }
  return parsed;
};

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

export const formatCurrency = (value: number, currency: "RUB" | "USDT") => {
  if (currency === "USDT") {
    const rate = getUsdtRate();
    return `${new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / rate)} USDT`;
  }
  return formatMoney(value);
};

export const convertToRub = (value: number, currency: "RUB" | "USDT") =>
  currency === "USDT" ? roundAmount(value * getUsdtRate()) : roundAmount(value);

export const convertFromRub = (value: number, currency: "RUB" | "USDT") =>
  currency === "USDT" ? roundAmount(value / getUsdtRate()) : roundAmount(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);

export const formatPercent = (value: number) =>
  `${new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)}%`;

export const depositFunds = (amount: number) => {
  const wallet = getWallet();
  const next = saveWallet({
    ...wallet,
    invested: roundAmount(wallet.invested + amount)
  });
  addTransaction("Пополнение", amount, "in");
  return next;
};

export const withdrawFunds = (amount: number) => {
  const wallet = getWallet();
  if (amount > wallet.balance) {
    return { ok: false, message: "Недостаточно средств для вывода." } as const;
  }
  const next = saveWallet({
    ...wallet,
    balance: roundAmount(wallet.balance - amount),
    totalWithdrawn: roundAmount(wallet.totalWithdrawn + amount)
  });
  addTransaction("Вывод средств", amount, "out");
  return { ok: true, wallet: next } as const;
};

export const investFunds = (amount: number) => {
  const wallet = getWallet();
  const next = saveWallet({
    ...wallet,
    invested: roundAmount(wallet.invested + amount)
  });
  addTransaction("Инвестиция", amount, "in");
  return { ok: true, wallet: next } as const;
};

export const reinvestEarnings = () => {
  const wallet = getWallet();
  if (wallet.balance <= 0) {
    return { ok: false, message: "Нет средств для реинвеста." } as const;
  }
  const next = saveWallet({
    ...wallet,
    invested: roundAmount(wallet.invested + wallet.balance),
    balance: 0
  });
  addTransaction("Реинвест", wallet.balance, "out");
  return { ok: true, wallet: next } as const;
};

export const toggleAutoReinvest = () => {
  const wallet = getWallet();
  const next = saveWallet({
    ...wallet,
    autoReinvest: !wallet.autoReinvest
  });
  return next;
};

export const collectEarnings = () => {
  const wallet = getWallet();
  if (wallet.earnings <= 0) {
    return { ok: false, message: "Пока нет прибыли для сбора." } as const;
  }
  const next = saveWallet({
    ...wallet,
    balance: roundAmount(wallet.balance + wallet.earnings),
    earnings: 0
  });
  addTransaction("Сбор прибыли", wallet.earnings, "in");
  return { ok: true, wallet: next } as const;
};

export const useWalletState = () => {
  const [wallet, setWallet] = useState<WalletState>(getWallet());
  const [transactions, setTransactions] = useState<TransactionItem[]>(getTransactions());
  const [usdtRate, setUsdtRate] = useState<number>(getUsdtRate());

  useEffect(() => {
    const handle = () => {
      setWallet(getWallet());
      setTransactions(getTransactions());
    };
    window.addEventListener(WALLET_EVENT, handle);
    return () => window.removeEventListener(WALLET_EVENT, handle);
  }, []);

  useEffect(() => {
    const handleRate = () => setUsdtRate(getUsdtRate());
    window.addEventListener(RATE_EVENT, handleRate);
    refreshUsdtRate().then(setUsdtRate);
    return () => window.removeEventListener(RATE_EVENT, handleRate);
  }, []);

  const metrics = useMemo(() => {
    const total = wallet.invested + wallet.balance;
    const growth = wallet.invested > 0 ? (wallet.balance / wallet.invested) * 100 : 0;
    const levelInfo = getLevelInfo(wallet.invested);
    const dailyIncome = wallet.invested > 0 ? (wallet.invested * levelInfo.current.rate) / 100 : 0;
    return { total, growth, dailyIncome, levelInfo };
  }, [wallet]);

  return { wallet, transactions, metrics, usdtRate };
};
