import { CalculatorIcon } from "../components/icons";

const paymentMethods = [
  { label: "Pay", bg: "rgba(60, 211, 107, 0.18)", border: "rgba(60, 211, 107, 0.5)" },
  { label: "T-Bank", bg: "rgba(255, 213, 79, 0.2)", border: "rgba(255, 213, 79, 0.5)" },
  { label: "Alfa", bg: "rgba(255, 92, 92, 0.18)", border: "rgba(255, 92, 92, 0.5)" },
  { label: "Telegram", bg: "rgba(42, 167, 240, 0.2)", border: "rgba(42, 167, 240, 0.5)" },
  { label: "USDT", bg: "rgba(47, 176, 143, 0.2)", border: "rgba(47, 176, 143, 0.5)" },
  { label: "BTC", bg: "rgba(247, 147, 26, 0.18)", border: "rgba(247, 147, 26, 0.5)" }
] as const;

export default function WalletPage() {
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
          <div className="wallet-amount">0,00 ₽</div>
        </div>
        <div className="wallet-actions">
          <button className="btn btn--primary">Пополнить</button>
          <button className="btn btn--secondary">Вывести</button>
        </div>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "140ms" }}>
        <h2>Платежные решения</h2>
        <span className="muted">Подключим за 10 минут</span>
      </div>

      <div className="payments reveal" style={{ animationDelay: "180ms" }}>
        {paymentMethods.map((item) => (
          <div key={item.label} className="payment-pill" style={{ background: item.bg, borderColor: item.border }}>
            {item.label}
          </div>
        ))}
      </div>

      <div className="card calculator-card reveal" style={{ animationDelay: "220ms" }}>
        <div className="calculator-icon">
          <CalculatorIcon size={20} />
        </div>
        <div>
          <div className="card-title">Калькулятор</div>
          <div className="muted">Рассчитайте доход по тарифам</div>
        </div>
        <button className="btn btn--ghost">Открыть</button>
      </div>
    </section>
  );
}
