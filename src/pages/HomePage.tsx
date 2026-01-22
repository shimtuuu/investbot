import { ArrowDownIcon, ArrowUpIcon } from "../components/icons";
import { brand } from "../config/brand";
import { cn } from "../lib/cn";

const transactions = [
  {
    id: "1315529815",
    title: "Пополнение",
    time: "00:14",
    amount: "+764 ₽",
    type: "in"
  },
  {
    id: "7545835987",
    title: "Вывод средств",
    time: "22:42",
    amount: "-1 000 ₽",
    type: "out"
  },
  {
    id: "8104597986",
    title: "Вывод средств",
    time: "22:42",
    amount: "-9 880 ₽",
    type: "out"
  },
  {
    id: "7775689341",
    title: "Пополнение",
    time: "22:15",
    amount: "+100 000 ₽",
    type: "in"
  }
] as const;

export default function HomePage() {
  return (
    <section className="page">
      <div className="hero card card--hero reveal">
        <div className="hero-content">
          <p className="hero-label">{brand.name}</p>
          <h1 className="hero-title">{brand.tagline}</h1>
          <p className="hero-sub">Баланс под защитой, доход работает 24/7.</p>
          <div className="hero-cta">
            <button className="btn btn--primary">Открыть тарифы</button>
            <button className="btn btn--ghost">Как это работает</button>
          </div>
        </div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="dots" aria-hidden="true">
          <span className="dot dot--active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>

      <div className="tabs reveal" style={{ animationDelay: "80ms" }}>
        <button className="tab tab--active" aria-selected="true">
          Розыгрыш
        </button>
        <button className="tab">Тарифы</button>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "140ms" }}>
        <h2>Live транзакции</h2>
        <span className="muted">Обновляются онлайн</span>
      </div>

      <div className="list">
        {transactions.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "list-item",
              item.type === "in" ? "list-item--credit" : "list-item--debit",
              "reveal"
            )}
            style={{ animationDelay: `${200 + index * 70}ms` }}
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
              <div className="list-amount">{item.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
