import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/use-chat';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';

const MOBILE_BREAKPOINT = 768;

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef(0);
  const rafRef = useRef(0);
  const { messages, loading, sendMessage, clearMessages } = useChat();

  const scrollToLatestMessage = useCallback(
    (behavior: ScrollBehavior) => {
      if (!isOpen) {
        return;
      }

      messagesEndRef.current?.scrollIntoView({ behavior });
    },
    [isOpen],
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    scrollToLatestMessage('smooth');
  }, [messages, scrollToLatestMessage]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      scrollToLatestMessage('auto');
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, scrollToLatestMessage]);

  useEffect(() => {
    if (!isMobile) return;

    const body = document.body;
    const html = document.documentElement;

    if (isOpen) {
      scrollLockRef.current = window.scrollY;
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollLockRef.current}px`;
      body.style.width = '100%';
      html.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      html.style.overflow = '';
      window.scrollTo(0, scrollLockRef.current);
    }

    return () => {
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      html.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const syncViewport = useCallback(() => {
    if (!isMobile || !isOpen) return;
    const element = panelRef.current;
    const viewport = window.visualViewport;
    if (!element || !viewport) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      element.style.height = `${Math.round(viewport.height)}px`;
      element.style.top = `${Math.round(viewport.offsetTop)}px`;
    });
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    syncViewport();
    viewport.addEventListener('resize', syncViewport);
    viewport.addEventListener('scroll', syncViewport);

    return () => {
      viewport.removeEventListener('resize', syncViewport);
      viewport.removeEventListener('scroll', syncViewport);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, isOpen, syncViewport]);

  const toggle = () => setIsOpen((previous) => !previous);

  const isMobileOpen = isOpen && isMobile;
  const isDesktopOpen = isOpen && !isMobile;

  return (
    <>
      {isDesktopOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {isDesktopOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-[10px] border border-[#ece6e1] bg-[#f5f5f5] shadow-[0_20px_36px_-28px_rgb(17_17_17/0.35)]"
          style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
        >
          <ChatPanel
            messages={messages}
            loading={loading}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={toggle}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}

      {isMobileOpen && (
        <div
          ref={panelRef}
          className="fixed inset-x-0 top-0 z-50 flex flex-col bg-[#f5f5f5]"
          style={{ height: '100dvh' }}
        >
          <ChatPanel
            messages={messages}
            loading={loading}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={toggle}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}

      {!isMobileOpen && (
        <button
          type="button"
          onClick={toggle}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ec6724] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#d95d20] hover:shadow-xl"
          aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </button>
      )}
    </>
  );
}

interface ChatPanelProps {
  messages: ReturnType<typeof useChat>['messages'];
  loading: boolean;
  onSend: (message: string) => void;
  onClear: () => void;
  onClose: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function ChatPanel({ messages, loading, onSend, onClear, onClose, messagesEndRef }: ChatPanelProps) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-[#ece6e1] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ec6724] text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-[#111111]">Assistente Teddy</h2>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md p-1.5 text-[#8b8b8b] transition-colors hover:bg-[#f5f5f5] hover:text-[#555555]"
              aria-label="Limpar conversa"
              title="Limpar conversa"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8b8b8b] transition-colors hover:bg-[#f5f5f5] hover:text-[#555555]"
            aria-label="Fechar chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && <EmptyState />}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSend} disabled={loading} />
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4ed]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec6724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-[#111111]">Assistente Teddy</p>
      <p className="max-w-[240px] text-xs text-[#8b8b8b]">
        Pergunte sobre clientes, salários, valores de empresa e histórico financeiro.
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-[10px] rounded-bl-sm border border-[#ece6e1] bg-white px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b8b8b] [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b8b8b] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b8b8b] [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
