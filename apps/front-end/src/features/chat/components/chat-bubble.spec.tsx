// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatBubble } from './chat-bubble';

const useChatMock = vi.fn();

vi.mock('../hooks/use-chat', () => ({
  useChat: () => useChatMock(),
}));

describe('ChatBubble', () => {
  beforeEach(() => {
    useChatMock.mockReturnValue({
      messages: [
        {
          id: 'message-1',
          role: 'user',
          content: 'Mensagem inicial',
          timestamp: Date.now(),
        },
        {
          id: 'message-2',
          role: 'assistant',
          content: 'Resposta inicial',
          timestamp: Date.now(),
        },
      ],
      loading: false,
      sendMessage: vi.fn(),
      clearMessages: vi.fn(),
    });
  });

  it('scrolls to the latest message when reopening the chat', () => {
    const browserWindow = globalThis as typeof globalThis & {
      HTMLElement: {
        prototype: {
          scrollIntoView: (options?: { behavior?: 'auto' | 'smooth' }) => void;
        };
      };
      requestAnimationFrame: (callback: (time: number) => void) => number;
      cancelAnimationFrame: (handle: number) => void;
    };
    const scrollIntoViewMock = vi.fn();
    const originalScrollIntoView = browserWindow.HTMLElement.prototype.scrollIntoView;
    const originalRequestAnimationFrame = browserWindow.requestAnimationFrame;
    const originalCancelAnimationFrame = browserWindow.cancelAnimationFrame;
    browserWindow.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    browserWindow.requestAnimationFrame = ((callback: (time: number) => void) => {
      callback(0);
      return 1;
    }) as typeof browserWindow.requestAnimationFrame;
    browserWindow.cancelAnimationFrame = vi.fn();

    render(<ChatBubble />);

    const toggleButton = screen.getByRole('button', { name: 'Abrir chat' });
    fireEvent.click(toggleButton);
    const [headerCloseButton] = screen.getAllByRole('button', { name: 'Fechar chat' });
    fireEvent.click(headerCloseButton);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir chat' }));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'auto' });

    browserWindow.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    browserWindow.requestAnimationFrame = originalRequestAnimationFrame;
    browserWindow.cancelAnimationFrame = originalCancelAnimationFrame;
  });
});
