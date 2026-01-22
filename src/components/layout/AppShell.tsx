import { type ReactNode, useEffect } from "react";
import { brand } from "../../config/brand";
import { getTelegramUser, prepareWebApp } from "../../lib/telegram";
import { InfoIcon, PlusIcon } from "../icons";
import BottomNav from "../navigation/BottomNav";

const currency = "RUB";

export default function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    prepareWebApp();
  }, []);

  const user = getTelegramUser();
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Гость";

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-button ghost" aria-label="Закрыть">
          X
        </button>
        <div className="brand-chip">
          <div className="brand-avatar" aria-hidden="true" />
          <div>
            <div className="brand-name">{brand.name}</div>
            <div className="brand-sub">{displayName}</div>
          </div>
        </div>
        <button className="icon-button ghost" aria-label="Меню">
          ...
        </button>
      </header>

      <div className="toolbar">
        <button className="icon-button square" aria-label="Справка">
          <InfoIcon size={18} />
        </button>
        <div className="chip">
          <span className="chip-icon">₽</span>
          <span>{currency}</span>
        </div>
        <div className="chip chip--action">
          <span className="chip-icon">₽</span>
          <span>0</span>
          <span className="chip-divider" />
          <button className="icon-button small" aria-label="Пополнить">
            <PlusIcon size={14} />
          </button>
        </div>
        <div className="avatar" aria-label={displayName}>
          {user?.photo_url ? (
            <img src={user.photo_url} alt={displayName} />
          ) : (
            <span>{displayName.slice(0, 1)}</span>
          )}
        </div>
      </div>

      <main className="app-content">{children}</main>

      <BottomNav />
    </div>
  );
}
