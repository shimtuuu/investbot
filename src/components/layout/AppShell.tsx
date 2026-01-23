import { type ReactNode, useEffect, useState } from "react";
import { brand } from "../../config/brand";
import { getTelegramUser, isTelegramWebApp, prepareWebApp } from "../../lib/telegram";
import { InfoIcon, PlusIcon } from "../icons";
import BottomNav from "../navigation/BottomNav";

const currency = "RUB";

export default function AppShell({ children }: { children: ReactNode }) {
  const getAllowWebFromEnv = () => {
    if (import.meta.env.VITE_ALLOW_WEB === "true") return true;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("allowWeb") === "1") {
        localStorage.setItem("allowWeb", "true");
        return true;
      }
      return localStorage.getItem("allowWeb") === "true";
    } catch {
      return false;
    }
  };

  const detectTelegramEnv = () => {
    if (typeof window === "undefined") return false;
    if (isTelegramWebApp()) return true;
    if (window.Telegram) return true;
    const anyWindow = window as Window & {
      TelegramWebviewProxy?: unknown;
      TelegramGameProxy?: unknown;
    };
    if (anyWindow.TelegramWebviewProxy || anyWindow.TelegramGameProxy) return true;
    const ua = navigator.userAgent ?? "";
    if (/telegram/i.test(ua)) return true;
    return /tgWebApp/i.test(window.location.href);
  };

  const initialAllowWeb = getAllowWebFromEnv();
  const [allowWeb, setAllowWeb] = useState(initialAllowWeb);
  const [webAppStatus, setWebAppStatus] = useState<"pending" | "webapp" | "web">(
    initialAllowWeb || detectTelegramEnv() ? "webapp" : "pending"
  );

  const enableWebBypass = () => {
    try {
      localStorage.setItem("allowWeb", "true");
    } catch {
      // Ignore storage failures in private mode.
    }
    setAllowWeb(true);
    setWebAppStatus("webapp");
  };

  useEffect(() => {
    if (allowWeb) {
      if (isTelegramWebApp()) {
        prepareWebApp();
      }
      return;
    }

    const check = () => {
      if (detectTelegramEnv()) {
        if (isTelegramWebApp()) {
          prepareWebApp();
        }
        setWebAppStatus("webapp");
        return true;
      }
      return false;
    };

    if (check()) return;

    let timeoutId: number | undefined;
    const interval = window.setInterval(() => {
      if (check()) {
        window.clearInterval(interval);
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      }
    }, 250);

    timeoutId = window.setTimeout(() => {
      setWebAppStatus("web");
    }, 1200);

    return () => {
      window.clearInterval(interval);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [allowWeb]);

  if (!allowWeb && webAppStatus === "pending") {
    return null;
  }

  if (!allowWeb && webAppStatus === "web") {
    return (
      <div className="app app--locked">
        <div className="card lock-card">
          <div className="lock-badge" aria-hidden="true">
            TG
          </div>
          <h1 className="lock-title">Откройте в Telegram</h1>
          <p className="lock-sub">
            {brand.name} работает только внутри Telegram Mini App.
          </p>
          <div className="lock-actions">
            <button className="btn btn--secondary" onClick={enableWebBypass} type="button">
              Продолжить в браузере
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = getTelegramUser();
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Гость";

  return (
    <div className="app">
      <header className="topbar topbar--center">
        <div className="brand-chip">
          <div className="brand-avatar" aria-hidden="true" />
          <div>
            <div className="brand-name">{brand.name}</div>
            <div className="brand-sub">{displayName}</div>
          </div>
        </div>
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
