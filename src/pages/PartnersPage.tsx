import { CopyIcon, ShareIcon } from "../components/icons";

export default function PartnersPage() {
  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Партнеры</h1>
        <p className="muted">Приглашайте друзей и зарабатывайте</p>
      </div>

      <div className="card referral-card reveal" style={{ animationDelay: "80ms" }}>
        <div className="referral-title">Ваш доход от партнеров</div>
        <div className="referral-rate">25%</div>
        <p className="muted">
          Получайте процент с каждого депозита ваших рефералов мгновенно на баланс.
        </p>
        <div className="referral-link">
          <span>t.me/OrbitCapitalBot/play?start=ref_8412</span>
          <button className="icon-button" aria-label="Скопировать">
            <CopyIcon size={16} />
          </button>
        </div>
        <button className="btn btn--primary">
          <ShareIcon size={18} />
          Пригласить друзей
        </button>
      </div>

      <div className="stats-grid reveal" style={{ animationDelay: "150ms" }}>
        <div className="stat-card">
          <div className="stat-label">Всего партнеров</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Активных</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Доход</div>
          <div className="stat-value">0 ₽</div>
        </div>
      </div>
    </section>
  );
}
