import { useEffect, useState } from "react";
import { closeModal, type ModalState, subscribeModal } from "../../lib/modal";

export default function ModalHost() {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => subscribeModal(setModal), []);

  useEffect(() => {
    if (!modal) {
      setInputValue("");
      return;
    }
    setInputValue(modal.defaultValue ?? "");
  }, [modal?.id]);

  useEffect(() => {
    const className = "modal-open";
    if (modal) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
    return () => document.body.classList.remove(className);
  }, [modal]);

  if (!modal) return null;

  const confirmText = modal.confirmText ?? "Ок";
  const cancelText = modal.cancelText ?? "Отмена";
  const isPrompt = modal.type === "prompt";

  const handleConfirm = () => {
    if (modal.type === "confirm") {
      closeModal(true);
      return;
    }
    if (modal.type === "prompt") {
      closeModal(inputValue);
      return;
    }
    closeModal(true);
  };

  const handleCancel = () => {
    if (modal.type === "confirm" || modal.type === "prompt") {
      closeModal(false);
      return;
    }
    closeModal(null);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="card modal-card">
        <div className="modal-title">{modal.title}</div>
        <p className="modal-message">{modal.message}</p>
        {isPrompt ? (
          <input
            className="modal-input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={modal.placeholder}
            autoFocus
          />
        ) : null}
        <div className="modal-actions">
          {modal.type !== "alert" ? (
            <button className="btn btn--ghost" onClick={handleCancel} type="button">
              {cancelText}
            </button>
          ) : null}
          <button className="btn btn--primary" onClick={handleConfirm} type="button">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
