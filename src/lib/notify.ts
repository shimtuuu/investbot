import { getWebApp } from "./telegram";
import { closeModal, openModal } from "./modal";

export const showMessage = async (title: string, message: string) => {
  await openModal({
    type: "alert",
    title,
    message,
    confirmText: "Ок"
  });
};

export const showConfirm = async (title: string, message: string, onConfirm: () => void) => {
  const confirmed = await openModal({
    type: "confirm",
    title,
    message,
    confirmText: "Открыть",
    cancelText: "Отмена"
  });
  if (confirmed) {
    onConfirm();
  }
};

export const requestInput = async (title: string, message: string, placeholder = "") => {
  const result = await openModal({
    type: "prompt",
    title,
    message,
    confirmText: "Продолжить",
    cancelText: "Отмена",
    placeholder
  });
  if (typeof result === "string") {
    return result;
  }
  return null;
};

export const openExternal = (url: string) => {
  const webApp = getWebApp();
  if (webApp?.openTelegramLink) {
    webApp.openTelegramLink(url);
    return;
  }
  if (webApp?.openLink) {
    webApp.openLink(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

export { closeModal };
