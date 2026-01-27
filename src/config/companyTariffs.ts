export type CompanyTariff = {
  id: string;
  name: string;
  note: string;
  rate: number;
  min: number;
  max: number;
  logo: "okx" | "bybit" | "binance";
  tone: "neutral" | "blue" | "gold";
  wide?: boolean;
};

export const companyTariffs: CompanyTariff[] = [
  {
    id: "okx",
    name: "OKX",
    note: "Для новых пользователей",
    rate: 3.2,
    min: 100,
    max: 10_000,
    logo: "okx",
    tone: "neutral"
  },
  {
    id: "bybit",
    name: "Bybit",
    note: "Рекомендован",
    rate: 4.2,
    min: 10_000,
    max: 100_000,
    logo: "bybit",
    tone: "blue"
  },
  {
    id: "binance",
    name: "Binance",
    note: "Приватный",
    rate: 5.2,
    min: 100_000,
    max: 5_000_000,
    logo: "binance",
    tone: "gold",
    wide: true
  }
];
