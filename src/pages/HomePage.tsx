import { getTelegramUser } from "../lib/telegram";
import { showMessage } from "../lib/notify";
import {
  depositFunds,
  formatCurrency,
  formatMoney,
  requestAmount,
  useWalletState,
  withdrawFunds
} from "../lib/wallet";

const tariffs = [
  { name: "Старт", min: 100, daily: 1.2, total: 500 },
  { name: "Стандарт", min: 5000, daily: 1.4, total: 500 },
  { name: "Профи", min: 20000, daily: 1.6, total: 500 },
  { name: "VIP", min: 100000, daily: 2.0, total: 500 }
] as const;

export default function HomePage() {
  const { wallet } = useWalletState();
  const user = getTelegramUser();

  const displayName =
    user?.username ? `@${user.username}` : [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const safeName = displayName || "Пользователь";
  const userId = user?.id ? `ID ${user.id}` : "ID не определен";

  const totalBalance = wallet.balance + wallet.invested;
  const totalProfit = wallet.balance + wallet.earnings + wallet.totalWithdrawn;

  const handleDeposit = async () => {
    const amount = await requestAmount("Пополнение");
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    depositFunds(amount);
    await showMessage("Готово", `Депозит пополнен на ${formatMoney(amount)}.`);
  };

  const handleWithdraw = async () => {
    const amount = await requestAmount("Вывод средств");
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const result = withdrawFunds(amount);
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage("Готово", `Заявка на вывод ${formatMoney(amount)} создана.`);
  };

  const handleActivate = async () => {
    if (wallet.invested <= 0) {
      await showMessage("Требуется депозит", "Для активации тарифа пополните баланс.");
      return;
    }
    await showMessage("Тариф активирован", "Ваш тариф активирован.");
  };

  return (
    <section className="page">
      <div className="card user-card reveal">
        <div className="user-row">
          <div className="user-avatar">
            {user?.photo_url ? (
              <img src={user.photo_url} alt={safeName} />
            ) : (
              <span>{safeName.slice(0, 1)}</span>
            )}
          </div>
          <div className="user-meta">
            <div className="user-name">{safeName}</div>
            <div className="muted">{userId}</div>
          </div>
        </div>
      </div>

      <div className="card balance-card reveal" style={{ animationDelay: "60ms" }}>
        <div className="balance-label">Баланс</div>
        <div className="balance-amount">{formatMoney(totalBalance)}</div>
        <div className="balance-sub">{formatCurrency(totalBalance, "USDT")}</div>
        <div className="balance-actions">
          <button className="btn btn--primary" onClick={handleDeposit}>
            Пополнить
          </button>
          <button className="btn btn--secondary" onClick={handleWithdraw} disabled={wallet.balance <= 0}>
            Вывести
          </button>
          <button className="btn btn--ghost" onClick={handleActivate}>
            Активировать
          </button>
        </div>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "120ms" }}>
        <h2>Тарифы</h2>
        <span className="muted">До 500% общей доходности</span>
      </div>

      <div className="tariff-grid reveal" style={{ animationDelay: "160ms" }}>
        {tariffs.map((tariff) => (
          <div key={tariff.name} className="card tariff-card">
            <div className="tariff-head">
              <div className="tariff-name">{tariff.name}</div>
              <span className="tariff-badge">от {formatMoney(tariff.min)}</span>
            </div>
            <div className="tariff-meta">
              <div className="tariff-row">
                <span className="muted">В день</span>
                <strong>{tariff.daily}%</strong>
              </div>
              <div className="tariff-row">
                <span className="muted">Общая доходность</span>
                <strong>{tariff.total}%</strong>
              </div>
              <div className="tariff-row">
                <span className="muted">Мин. депозит</span>
                <strong>
                  {formatMoney(tariff.min)} / {formatCurrency(tariff.min, "USDT")}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header reveal" style={{ animationDelay: "220ms" }}>
        <h2>Статистика</h2>
        <span className="muted">Ваши показатели</span>
      </div>

      <div className="stats-grid reveal" style={{ animationDelay: "260ms" }}>
        <div className="stat-card">
          <div className="stat-label">Общая сумма инвестиций</div>
          <div className="stat-value">{formatMoney(wallet.invested)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Общая прибыль</div>
          <div className="stat-value">{formatMoney(totalProfit)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Всего выведено</div>
          <div className="stat-value">{formatMoney(wallet.totalWithdrawn)}</div>
        </div>
      </div>
    </section>
  );
}
