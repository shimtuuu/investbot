import { InfoIcon } from "../components/icons";
import { links } from "../config/links";
import { openExternal, showConfirm } from "../lib/notify";

const infoLinks = [
  { label: "Новости / Канал", desc: "Обновления и анонсы", url: links.channel },
  { label: "Чат сообщества", desc: "Поддержка и общение", url: links.chat },
  { label: "Менеджер", desc: "Личный менеджер и вопросы", url: links.support },
  { label: "FAQ и правила", desc: "Ответы на частые вопросы", url: links.faq }
];

export default function InfoPage() {
  const handleOpen = async (url: string, label: string) => {
    await showConfirm(label, "Открыть ссылку в Telegram?", () => openExternal(url));
  };

  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Инфо</h1>
        <p className="muted">Документы и поддержка</p>
      </div>

      <div className="list">
        {infoLinks.map((item, index) => (
          <button
            key={item.label}
            className="info-card reveal"
            style={{ animationDelay: `${80 + index * 60}ms` }}
            onClick={() => handleOpen(item.url, item.label)}
          >
            <span className="info-icon">
              <InfoIcon size={18} />
            </span>
            <span className="info-body">
              <span className="info-title">{item.label}</span>
              <span className="muted">{item.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
