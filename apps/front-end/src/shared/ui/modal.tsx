import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="app-modal-backdrop" onClick={onClose} />
      <section className="app-modal" role="dialog" aria-modal="true">
        <div className="app-modal__header">
          <h2 className="app-modal__title">{title}</h2>
          <button type="button" className="app-modal__close" onClick={onClose} aria-label="Fechar modal">
            <img src="/reference-assets/x-icon.svg" alt="" width={12} height={12} />
          </button>
        </div>
        {children}
      </section>
    </>
  );
}
