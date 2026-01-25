export type ModalType = "alert" | "confirm" | "prompt";

export type ModalPayload = {
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  defaultValue?: string;
};

export type ModalState = ModalPayload & {
  id: number;
  resolve: (value: string | boolean | null) => void;
};

let current: ModalState | null = null;
const listeners = new Set<(state: ModalState | null) => void>();

const emit = () => {
  listeners.forEach((listener) => listener(current));
};

export const openModal = (payload: ModalPayload) =>
  new Promise<string | boolean | null>((resolve) => {
    current = {
      ...payload,
      id: Date.now(),
      resolve
    };
    emit();
  });

export const closeModal = (value: string | boolean | null) => {
  const prev = current;
  current = null;
  emit();
  if (prev) {
    prev.resolve(value);
  }
};

export const subscribeModal = (listener: (state: ModalState | null) => void) => {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
};
