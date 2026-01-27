import { useMemo, useState } from "react";
import { showMessage } from "../lib/notify";
import {
  convertToRub,
  formatCurrency,
  formatMoney,
  formatNumber,
  formatPercent,
  parseAmount,
  requestAmount,
  topUpBalance,
  useWalletState,
  withdrawFunds
} from "../lib/wallet";

const paymentMethods = [
  { label: "Pay", bg: "rgba(60, 211, 107, 0.18)", border: "rgba(60, 211, 107, 0.5)" },
  { label: "T-Bank", bg: "rgba(255, 213, 79, 0.2)", border: "rgba(255, 213, 79, 0.5)" },
  { label: "Alfa", bg: "rgba(255, 92, 92, 0.18)", border: "rgba(255, 92, 92, 0.5)" },
  { label: "Telegram", bg: "rgba(42, 167, 240, 0.2)", border: "rgba(42, 167, 240, 0.5)" },
  { label: "USDT", bg: "rgba(47, 176, 143, 0.2)", border: "rgba(47, 176, 143, 0.5)" },
  { label: "BTC", bg: "rgba(247, 147, 26, 0.18)", border: "rgba(247, 147, 26, 0.5)" }
] as const;

export default function WalletPage() {
  const { wallet, metrics, usdtRate } = useWalletState();
  const [calcCurrency, setCalcCurrency] = useState<"RUB" | "USDT">("RUB");
  const [calcAmountRaw, setCalcAmountRaw] = useState("1000");
  const [calcDaysRaw, setCalcDaysRaw] = useState("30");
  const [calcCompound, setCalcCompound] = useState(false);

  const calcAmount = parseAmount(calcAmountRaw) ?? 0;
  const calcDays = Number(calcDaysRaw.replace(/[^\d]/g, "")) || 0;
  const dailyRate = metrics.levelInfo.current.rate;

  const calcResult = useMemo(() => {
    const principalRub = convertToRub(calcAmount, calcCurrency);
    if (!principalRub || calcDays <= 0 || dailyRate <= 0) {
      return {
        dailyRub: 0,
        profitRub: 0,
        finalRub: 0
      };
    }
    const dailyRub = (principalRub * dailyRate) / 100;
    if (calcCompound) {
      const finalRub = principalRub * Math.pow(1 + dailyRate / 100, calcDays);
      return {
        dailyRub,
        profitRub: finalRub - principalRub,
        finalRub
      };
    }
    const profitRub = dailyRub * calcDays;
    return {
      dailyRub,
      profitRub,
      finalRub: principalRub + profitRub
    };
  }, [calcAmount, calcCurrency, calcDays, calcCompound, dailyRate]);

  const handleDeposit = async () => {
    const { value: amount, cancelled } = await requestAmount("Сумма пополнения");
    if (cancelled) {
      return;
    }
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const next = topUpBalance(amount);
    await showMessage("Готово", `Депозит пополнен. Баланс: ${formatMoney(next.balance)}.`);
  };

  const handleWithdraw = async () => {
    if (wallet.balance <= 0) {
      await showMessage("Ошибка", "Недостаточно средств для вывода.");
      return;
    }
    const { value: amount, cancelled } = await requestAmount("Сумма вывода");
    if (cancelled) {
      return;
    }
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const result = withdrawFunds(amount);
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage("Готово", `Заявка на вывод создана. Баланс: ${formatMoney(result.wallet.balance)}.`);
  };

  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Кошелек</h1>
        <p className="muted">Управление средствами</p>
      </div>

      <div className="card wallet-card reveal" style={{ animationDelay: "80ms" }}>
        <div className="wallet-chip">Основной счет</div>
        <div className="wallet-balance">
          <span className="wallet-label">Доступно к выводу</span>
          <div className="wallet-amount">{formatMoney(wallet.balance)}</div>
        </div>
        <div className="wallet-actions">
          <button className="btn btn--primary" onClick={handleDeposit}>
            Пополнить
          </button>
          <button className="btn btn--secondary" onClick={handleWithdraw}>
            Вывести
          </button>
        </div>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "120ms" }}>
        <h2>Платежные решения</h2>
      </div>

      <div className="payments reveal" style={{ animationDelay: "180ms" }}>
        {paymentMethods.map((item) => (
          <div key={item.label} className="payment-pill" style={{ background: item.bg, borderColor: item.border }}>
            {item.label}
          </div>
        ))}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "220ms" }}>
        <h2>Калькулятор</h2>
        <span className="muted">Расширенный расчет</span>
      </div>

      <div className="card calculator-panel reveal" style={{ animationDelay: "260ms" }}>
        <div className="calculator-row">
          <div>
            <div className="card-title">Параметры</div>
            <div className="muted">Выберите сумму и срок</div>
          </div>
          <div className="currency-toggle">
            <button
              className={`currency-chip ${calcCurrency === "RUB" ? "is-active" : ""}`}
              onClick={() => setCalcCurrency("RUB")}
            >
              ₽
            </button>
            <button
              className={`currency-chip ${calcCurrency === "USDT" ? "is-active" : ""}`}
              onClick={() => setCalcCurrency("USDT")}
            >
              USDT
            </button>
          </div>
        </div>

        <div className="calculator-inputs">
          <label>
            <div className="muted">Сумма</div>
            <input
              className="input-field"
              value={calcAmountRaw}
              onChange={(event) => setCalcAmountRaw(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label>
            <div className="muted">Срок (дней)</div>
            <input
              className="input-field"
              value={calcDaysRaw}
              onChange={(event) => setCalcDaysRaw(event.target.value)}
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="calculator-grid">
          <div>
            <div className="muted">Доходность</div>
            <div className="calc-value">{formatPercent(dailyRate)} в день</div>
          </div>
          <div>
            <div className="muted">Курс USDT</div>
            <div className="calc-value">{formatNumber(usdtRate)} ₽</div>
          </div>
        </div>

        <div className="action-toggle">
          <span className="muted">Реинвестировать ежедневно</span>
          <button
            className={`toggle ${calcCompound ? "toggle--on" : ""}`}
            onClick={() => setCalcCompound((prev) => !prev)}
            type="button"
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="calc-list">
          <div className="calc-row">
            <span className="muted">Доход в день</span>
            <strong>{formatCurrency(calcResult.dailyRub, calcCurrency)}</strong>
          </div>
          <div className="calc-row">
            <span className="muted">Доход за период</span>
            <strong>{formatCurrency(calcResult.profitRub, calcCurrency)}</strong>
          </div>
          <div className="calc-row">
            <span className="muted">Итоговая сумма</span>
            <strong>{formatCurrency(calcResult.finalRub, calcCurrency)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
