import { useMemo, useState } from "react";
import { getTelegramUser } from "../lib/telegram";
import { showMessage } from "../lib/notify";
import {
  convertToRub,
  formatNumber,
  formatPercent,
  investFunds,
  parseAmount,
  useWalletState
} from "../lib/wallet";

type Currency = "RUB" | "USDT";

const formatAmount = (value: number, currency: Currency) =>
  `${formatNumber(value)} ${currency === "RUB" ? "₽" : "USDT"}`;

export default function CalculatorPage() {
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [amountRaw, setAmountRaw] = useState("1000");
  const { metrics } = useWalletState();

  const amount = parseAmount(amountRaw) ?? 0;
  const rate = metrics.levelInfo.current.rate;

  const paybackDays = rate > 0 ? Math.ceil(100 / rate) : 0;

  const payouts = useMemo(() => {
    const daily = (amount * rate) / 100;
    return {
      daily,
      weekly: daily * 7,
      monthly: daily * 30,
      yearly: daily * 365
    };
  }, [amount, rate]);

  const handleInvest = async () => {
    if (!amount || amount <= 0) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const user = getTelegramUser();
    if (!user) {
      await showMessage("Нужна авторизация", "Откройте Mini App через Telegram.");
      return;
    }
    const amountRub = convertToRub(amount, currency);
    investFunds(amountRub);
    await showMessage(
      "Заявка создана",
      `Инвестиция на сумму ${formatAmount(amount, currency)} отправлена.`
    );
  };

  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Калькулятор</h1>
        <p className="muted">Рассчитайте прогноз доходности</p>
      </div>

      <div className="card calculator-panel reveal" style={{ animationDelay: "80ms" }}>
        <div className="card-title">Параметры</div>
        <div className="calculator-row">
          <div>
            <div className="card-title">Сумма инвестиций</div>
            <div className="muted">Введите сумму для расчета</div>
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
        <input
          className="input-field"
          value={amountRaw}
          onChange={(event) => setAmountRaw(event.target.value)}
          placeholder={currency === "RUB" ? "1000" : "100"}
          inputMode="decimal"
        />

        <div className="calculator-grid">
          <div>
            <div className="muted">Доходность</div>
            <div className="calc-value">{formatPercent(rate)} в день</div>
          </div>
          <div>
            <div className="muted">Окупаемость</div>
            <div className="calc-value">{paybackDays} дней</div>
          </div>
        </div>
      </div>

      <div className="card calculator-panel reveal" style={{ animationDelay: "140ms" }}>
        <div className="card-title">Прогноз дохода</div>
        <div className="calc-list">
          <div className="calc-row">
            <span className="muted">В день</span>
            <strong>{formatAmount(payouts.daily, currency)}</strong>
          </div>
          <div className="calc-row">
            <span className="muted">В неделю</span>
            <strong>{formatAmount(payouts.weekly, currency)}</strong>
          </div>
          <div className="calc-row">
            <span className="muted">В месяц</span>
            <strong>{formatAmount(payouts.monthly, currency)}</strong>
          </div>
          <div className="calc-row">
            <span className="muted">В год</span>
            <strong>{formatAmount(payouts.yearly, currency)}</strong>
          </div>
        </div>
        <button className="btn btn--primary calc-action" onClick={handleInvest}>
          Инвестировать
        </button>
      </div>
    </section>
  );
}
