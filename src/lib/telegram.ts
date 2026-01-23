export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export type TelegramWebApp = {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
  };
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const getWebApp = () => window.Telegram?.WebApp;

export const getTelegramUser = () => getWebApp()?.initDataUnsafe?.user;

export const getInitData = () => getWebApp()?.initData ?? "";

export const isTelegramWebApp = () => Boolean(getWebApp());

export const prepareWebApp = () => {
  const webApp = getWebApp();
  if (!webApp) return;
  document.documentElement.classList.add("tg-webapp");
  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor?.("#0a101a");
  webApp.setBackgroundColor?.("#090c12");
};
