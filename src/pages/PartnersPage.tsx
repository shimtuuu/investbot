import { CopyIcon, ShareIcon, UsersIcon } from "../components/icons";
import { brand } from "../config/brand";
import { links } from "../config/links";
import { openExternal, showMessage } from "../lib/notify";
import { getTelegramUser } from "../lib/telegram";

const levels = [
  { level: 1, percent: "7%", desc: "Партнеры 1 уровня" },
  { level: 2, percent: "4%", desc: "Партнеры 2 уровня" },
  { level: 3, percent: "2%", desc: "Партнеры 3 уровня" }
];

export default function PartnersPage() {
  const user = getTelegramUser();
  const referral = user?.id ? `${links.bot}?startapp=ref_${user.id}` : links.referral;

  const getInviter = () => {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#\/?/, ""));
    return search.get("startapp") ?? search.get("start") ?? hash.get("startapp") ?? hash.get("start");
  };

  const inviter = getInviter();
  const inviterClean = inviter?.replace(/^ref_/, "") ?? "";
  const inviterLabel = inviterClean
    ? `ID ${inviterClean.replace(/^@/, "")}`
    : "Вы зарегистрировались без пригласителя";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      await showMessage("Ссылка скопирована", "Отправьте ее друзьям, чтобы получать бонусы.");
    } catch {
      await showMessage("Скопируйте ссылку", referral);
    }
  };

  const handleShare = async () => {
    const text = "Присоединяйся и получай бонусы вместе со мной!";
    if (navigator.share) {
      try {
        await navigator.share({
          title: brand.name,
          text,
          url: links.referral
        });
        return;
      } catch {
        // User canceled share.
      }
    }
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referral
    )}&text=${encodeURIComponent(text)}`;
    openExternal(shareUrl);
  };

  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Партнеры</h1>
        <p className="muted">Приглашайте друзей и зарабатывайте</p>
      </div>

      <div className="card referral-card reveal" style={{ animationDelay: "80ms" }}>
        <div className="referral-title">Партнерская программа</div>
        <div className="referral-rate">до 7%</div>
        <p className="muted">Приглашайте пользователей и получайте вознаграждение за их активность.</p>
        <p className="muted">
          Получайте процент с каждого депозита ваших рефералов мгновенно на баланс.
        </p>
        <div className="referral-inviter">
          <span className="muted">Вас пригласил</span>
          <strong>{inviterLabel}</strong>
        </div>
        <div className="referral-link">
          <input
            className="referral-input"
            value={referral.replace("https://", "")}
            readOnly
          />
          <button className="icon-button" aria-label="Скопировать" onClick={handleCopy}>
            <CopyIcon size={16} />
          </button>
        </div>
        <button className="btn btn--primary" onClick={handleShare}>
          <ShareIcon size={18} />
          Пригласить друзей
        </button>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "140ms" }}>
        <h2>Уровни</h2>
        <span className="muted">Ставки по линиям</span>
      </div>

      <div className="levels-grid reveal" style={{ animationDelay: "180ms" }}>
        {levels.map((item) => (
          <div key={item.level} className="level-card">
            <div className="level-head">
              <UsersIcon size={18} />
              <span>Уровень {item.level}</span>
            </div>
            <div className="level-rate">{item.percent}</div>
            <div className="muted">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="stats-grid reveal" style={{ animationDelay: "240ms" }}>
        <div className="stat-card">
          <div className="stat-label">Приглашено пользователей</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Активных партнеров</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ваш заработок</div>
          <div className="stat-value">0 ₽</div>
        </div>
      </div>

      <div className="card earnings-card reveal" style={{ animationDelay: "300ms" }}>
        <div className="card-title-row">
          <ShareIcon size={18} />
          <span className="card-title">Заработок по линиям</span>
        </div>
        <div className="earnings-lines">
          <div className="earnings-line">
            <span className="muted">1 уровень</span>
            <strong>0 ₽ / 0 USDT</strong>
          </div>
          <div className="earnings-line">
            <span className="muted">2 уровень</span>
            <strong>0 ₽ / 0 USDT</strong>
          </div>
          <div className="earnings-line">
            <span className="muted">3 уровень</span>
            <strong>0 ₽ / 0 USDT</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
