import { ChartIcon, SparkleIcon } from "../components/icons";

export default function CabinetPage() {
  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Кабинет</h1>
        <p className="muted">Баланс, уровень, доход</p>
      </div>

      <div className="card deposit-card reveal" style={{ animationDelay: "80ms" }}>
        <div className="deposit-head">
          <div>
            <div className="muted">Ваш депозит</div>
            <div className="deposit-title">Тариф: Нет</div>
          </div>
          <div className="deposit-icon">
            <SparkleIcon size={22} />
          </div>
        </div>
        <div className="deposit-amount">0,00 ₽</div>
        <div className="deposit-meta">
          <span className="chip chip--soft">0%</span>
          <span className="chip chip--soft">Рост</span>
        </div>
        <div className="deposit-line">
          <span>Накоплено: 0,00 ₽</span>
          <span>Прибыль: +0%</span>
        </div>
        <div className="deposit-actions">
          <button className="btn btn--secondary">Инвестировать</button>
          <button className="btn btn--primary">Собрать</button>
        </div>
      </div>

      <div className="card tariff-card reveal" style={{ animationDelay: "150ms" }}>
        <div className="card-title-row">
          <ChartIcon size={18} />
          <span className="card-title">Тарифные планы</span>
        </div>
        <div className="tariff-row">
          <div>
            <div className="tariff-name">Нет тарифа</div>
            <div className="muted">Текущий тариф</div>
          </div>
          <div className="tariff-next">
            <span>Следующий</span>
            <strong>PEPE COIN</strong>
          </div>
        </div>
        <div className="tariff-stats">
          <div>
            <span className="muted">Личный депозит</span>
            <div>0,00 ₽</div>
          </div>
          <div>
            <span className="muted">До следующего</span>
            <div>250 ₽</div>
          </div>
        </div>
        <div className="progress">
          <span style={{ width: "20%" }} />
        </div>
      </div>

      <div className="card earnings-card reveal" style={{ animationDelay: "210ms" }}>
        <div className="card-title">Всего заработано</div>
        <div className="muted">Депозит · Прибыль</div>
        <div className="earnings-total">0,00 ₽ → 0,00 ₽</div>
      </div>
    </section>
  );
}
