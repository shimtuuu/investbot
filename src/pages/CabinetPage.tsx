import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfoIcon } from "../components/icons";
import { getTelegramUser } from "../lib/telegram";
import { showMessage } from "../lib/notify";
import {
  depositFunds,
  formatCurrency,
  formatPercent,
  reinvestEarnings,
  requestAmount,
  toggleAutoReinvest,
  useWalletState,
  withdrawFunds
} from "../lib/wallet";

type Currency = "RUB" | "USDT";

export default function CabinetPage() {
  const navigate = useNavigate();
  const { wallet, metrics, transactions } = useWalletState();
  const [currency, setCurrency] = useState<Currency>("RUB");

  const user = getTelegramUser();
  const userId = user?.id ? `ID ${user.id}` : "ID не определен";
  const userName = user?.username ? `@${user.username}` : user?.first_name ?? "Пользователь";
  const levelInfo = metrics.levelInfo;

  const handleDeposit = async () => {
    const amount = await requestAmount("Пополнение", currency);
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    depositFunds(amount);
    await showMessage("Готово", `Депозит пополнен на ${formatCurrency(amount, currency)}.`);
  };

  const handleWithdraw = async () => {
    const amount = await requestAmount("Вывод средств", currency);
    if (!amount) {
      await showMessage("Ошибка", "Введите корректную сумму.");
      return;
    }
    const result = withdrawFunds(amount);
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage("Готово", `Заявка на вывод ${formatCurrency(amount, currency)} создана.`);
  };

  const handleReinvest = async () => {
    const result = reinvestEarnings();
    if (!result.ok) {
      await showMessage("Ошибка", result.message);
      return;
    }
    await showMessage("Реинвест", "Прибыль переведена в депозит.");
  };

  const handleAutoReinvest = async () => {
    const next = toggleAutoReinvest();
    await showMessage(
      "Авто-реинвест",
      next.autoReinvest ? "Авто-реинвест включен." : "Авто-реинвест выключен."
    );
  };

  return (
    <section className="page page--cabinet">
      <div className="section-header reveal">
        <h1>Кабинет</h1>
        <p className="muted">Ваш профиль и активы</p>
      </div>

      <div className="card profile-card reveal" style={{ animationDelay: "60ms" }}>
        <div className="profile-row">
          <div>
            <div className="profile-title">Профиль</div>
            <div className="muted">{userName}</div>
            <div className="muted">{userId}</div>
          </div>
          <div className="profile-level">{levelInfo.current.name}</div>
        </div>
        <div className="profile-rate">
          Доходность {formatPercent(levelInfo.current.rate)} в день
        </div>
      </div>

      <div className="card summary-card reveal" style={{ animationDelay: "120ms" }}>
        <div className="summary-head">
          <div>
            <div className="card-title">Сводка</div>
            <div className="muted">Баланс и доход</div>
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
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Депозит</span>
            <strong>{formatCurrency(wallet.invested, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Доход в день</span>
            <strong>{formatCurrency(metrics.dailyIncome, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Доступно к выводу</span>
            <strong>{formatCurrency(wallet.balance, currency)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Выведено всего</span>
            <strong>{formatCurrency(wallet.totalWithdrawn, currency)}</strong>
          </div>
        </div>
      </div>

      <div className="card progress-card reveal" style={{ animationDelay: "180ms" }}>
        <div className="progress-head">
          <div>
            <div className="card-title">Прогресс уровня</div>
            <div className="muted">
              До следующего: {formatCurrency(levelInfo.remaining, currency)}
            </div>
          </div>
          <div className="level-badge">{levelInfo.current.name}</div>
        </div>
        <div className="progress-meta">
          <span className="muted">Следующий</span>
          <strong>{levelInfo.next ? levelInfo.next.name : "Максимум"}</strong>
        </div>
        <div className="progress" title="Чем выше уровень — тем выше доходность">
          <span style={{ width: `${levelInfo.progress}%` }} />
        </div>
        <div className="progress-foot">
          <span className="muted">
            Осталось: {formatCurrency(levelInfo.remaining, currency)}
          </span>
          <button className="info-link" type="button" onClick={() => navigate("/info")}>
            <InfoIcon size={14} />
            Правила уровней
          </button>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn btn--primary" onClick={handleDeposit}>
          Пополнить
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleWithdraw}
          disabled={wallet.balance <= 0}
        >
          Вывести
        </button>
        <div className="action-toggle">
          <span className="muted">Авто-реинвест</span>
          <button
            className={`toggle ${wallet.autoReinvest ? "toggle--on" : ""}`}
            onClick={handleAutoReinvest}
            type="button"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        <button
          className="btn btn--ghost"
          onClick={handleReinvest}
          disabled={wallet.balance <= 0}
        >
          Реинвест
        </button>
      </div>

      <div className="section-header reveal" style={{ animationDelay: "240ms" }}>
        <h2>История операций</h2>
        <span className="muted">Последние транзакции</span>
      </div>

      <div className="card history-card reveal" style={{ animationDelay: "280ms" }}>
        <div className="history-head">
          <span>Дата</span>
          <span>Тип</span>
          <span>Сумма</span>
        </div>
        {transactions.length === 0 ? (
          <div className="history-empty muted">Операций пока нет.</div>
        ) : (
          transactions.map((tx) => {
            const date = new Date(tx.ts);
            const label = tx.type === "in" ? "Пополнение" : "Вывод";
            const amount = formatCurrency(tx.amount, currency);
            return (
              <div key={tx.id} className="history-row">
                <span className="history-cell">
                  {date.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit"
                  })}{" "}
                  {date.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
                <span className="history-cell">{label}</span>
                <span
                  className={`history-cell history-amount history-amount--${
                    tx.type === "in" ? "in" : "out"
                  }`}
                >
                  {tx.type === "in" ? "+" : "-"}
                  {amount}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
