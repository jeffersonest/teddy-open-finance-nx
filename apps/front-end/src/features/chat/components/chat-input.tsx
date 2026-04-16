import { type FormEvent, useRef, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#ece6e1] bg-white p-3">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Digite sua pergunta..."
        disabled={disabled}
        className="flex-1 rounded-lg border border-[#d9d9d9] bg-[#f5f5f5] px-3 py-2 text-sm text-[#111111] placeholder-[#8b8b8b] outline-none transition-colors focus:border-[#ec6724] focus:ring-2 focus:ring-orange-400/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ec6724] text-white transition-colors hover:bg-[#d95d20] disabled:cursor-not-allowed disabled:bg-[#f3b291]"
        aria-label="Enviar mensagem"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
