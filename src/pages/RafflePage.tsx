import { GiftIcon, SparkleIcon, UsersIcon, WalletIcon } from "../components/icons";
import { showMessage } from "../lib/notify";
import { depositFunds, requestAmount } from "../lib/wallet";

const stats = [
  { label: "Призовой фонд", value: "250 000 ₽", hint: "растет каждый день" },
  { label: "Билетов сегодня", value: "1 248", hint: "доступно к розыгрышу" },
  { label: "Победителей", value: "12", hint: "в каждом этапе" }
] as const;

const steps = [
  {
    title: "Пополните баланс",
    desc: "от 1 000 ₽ получите билет и место в таблице",
    icon: WalletIcon
  },
  {
    title: "Пригласите друга",
    desc: "+2 билета за каждого активного партнера",
    icon: UsersIcon
  },
  {
    title: "Держите депозит",
    desc: "чем дольше активен, тем выше множитель",
    icon: SparkleIcon
  }
] as const;

const prizes = [
  { title: "Главный приз", value: "150 000 ₽", note: "1 победитель" },
  { title: "Второй приз", value: "50 000 ₽", note: "2 победителя" },
  { title: "Третий приз", value: "25 000 ₽", note: "3 победителя" },
  { title: "Бонусные", value: "5 000 ₽", note: "6 победителей" }
] as const;

const upcoming = [
  { title: "Weekend Sprint", date: "Сб, 27 янв · 19:00", status: "Регистрация открыта", tone: "open" },
  { title: "Midweek Boost", date: "Ср, 31 янв · 20:00", status: "Скоро", tone: "soon" },
  { title: "Monthly Mega", date: "Вс, 04 фев · 18:00", status: "Анонс", tone: "soon" }
] as const;

export default function RafflePage() {
  const handleTicket = async () => {
    const { value: amount, cancelled } = await requestAmount("Пополнение для билета");
    if (cancelled) {
      return;
    }
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    if (amount < 1000) {
      await showMessage("Минимум 1 000 ₽", "Пополнение меньше 1 000 ₽ не дает билет.");
      return;
    }
    depositFunds(amount);
    await showMessage(
      "Билет получен",
      "Билет начислен, обновления появятся в вашем профиле."
    );
  };

  const handleRules = async () => {
    await showMessage(
      "Условия участия",
      "1) Пополните баланс от 1 000 ₽.\n2) Пригласите друга и получите +2 билета.\n3) Держите депозит активным для увеличения множителя."
    );
  };

  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Розыгрыш</h1>
        <p className="muted">Праздничный ивент · розыгрыши каждую неделю</p>
      </div>

      <div className="card raffle-hero reveal" style={{ animationDelay: "80ms" }}>
        <div className="raffle-badge">
          <GiftIcon size={16} />
          Большой розыгрыш
        </div>
        <h2 className="raffle-title">Finora Winter Cup</h2>
        <p className="raffle-sub">
          Участвуйте в еженедельных розыгрышах и получайте билеты за активность.
        </p>
        <div className="raffle-cta">
          <button className="btn btn--primary" onClick={handleTicket}>
            Получить билет
          </button>
          <button className="btn btn--ghost" onClick={handleRules}>
            Условия участия
          </button>
        </div>
        <div className="raffle-countdown">
          <div className="countdown-item">
            <span className="countdown-value">02</span>
            <span className="countdown-label">дня</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">14</span>
            <span className="countdown-label">часов</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">33</span>
            <span className="countdown-label">мин</span>
          </div>
        </div>
      </div>

      <div className="stats-grid reveal" style={{ animationDelay: "140ms" }}>
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
            <div className="muted">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "200ms" }}>
        <h2>Как участвовать</h2>
        <span className="muted">3 простых шага</span>
      </div>

      <div className="raffle-grid reveal" style={{ animationDelay: "240ms" }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="raffle-card">
              <span className="raffle-card-icon">
                <Icon size={18} />
              </span>
              <div className="raffle-card-title">{step.title}</div>
              <div className="muted">{step.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "300ms" }}>
        <h2>Призы</h2>
        <span className="muted">каждую неделю</span>
      </div>

      <div className="raffle-grid reveal" style={{ animationDelay: "340ms" }}>
        {prizes.map((prize) => (
          <div key={prize.title} className="raffle-card raffle-card--prize">
            <div className="raffle-card-title">{prize.title}</div>
            <div className="raffle-card-value">{prize.value}</div>
            <div className="muted">{prize.note}</div>
          </div>
        ))}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "380ms" }}>
        <h2>Ближайшие розыгрыши</h2>
        <span className="muted">расписание на неделю</span>
      </div>

      <div className="raffle-list">
        {upcoming.map((item, index) => (
          <div
            key={item.title}
            className="raffle-list-item reveal"
            style={{ animationDelay: `${420 + index * 60}ms` }}
          >
            <div>
              <div className="raffle-list-title">{item.title}</div>
              <div className="muted">{item.date}</div>
            </div>
            <span className={`status-pill status-pill--${item.tone}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
