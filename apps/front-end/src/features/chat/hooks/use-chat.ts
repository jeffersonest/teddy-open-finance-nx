import axios from 'axios';
import { useCallback, useState } from 'react';
import { chatApi } from '../api/chat-api';
import { useChatStore, type ChatMessage } from '../store/chat-store';

export type { ChatMessage } from '../store/chat-store';

const FRIENDLY_ERROR_FALLBACK =
  'Não consegui responder agora. Tente novamente em instantes.';
const FRIENDLY_RATE_LIMIT_ERROR =
  'Você fez muitas perguntas em pouco tempo. Aguarde um instante antes de tentar novamente.';
const FRIENDLY_AUTH_ERROR =
  'Sua sessão expirou. Faça login novamente para continuar usando o chat.';
const FRIENDLY_NETWORK_ERROR =
  'Não foi possível alcançar o servidor. Verifique sua conexão e tente novamente.';

function resolveFriendlyError(error: unknown): string {
  if (!axios.isAxiosError(error)) return FRIENDLY_ERROR_FALLBACK;

  const status = error.response?.status;
  if (status === 401 || status === 403) return FRIENDLY_AUTH_ERROR;
  if (status === 429) return FRIENDLY_RATE_LIMIT_ERROR;
  if (!error.response) return FRIENDLY_NETWORK_ERROR;

  const data = error.response.data as { message?: string | string[] } | undefined;
  const rawMessage = Array.isArray(data?.message)
    ? data?.message[0]
    : data?.message;

  if (status && status >= 400 && status < 500 && rawMessage) {
    return rawMessage;
  }

  return FRIENDLY_ERROR_FALLBACK;
}

export function useChat() {
  const messages = useChatStore((state) => state.messages);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      appendMessage(userMessage);
      setLoading(true);

      try {
        const response = await chatApi.sendMessage({ message: trimmed });
        appendMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.reply,
          timestamp: Date.now(),
        });
      } catch (error) {
        appendMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: resolveFriendlyError(error),
          timestamp: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    },
    [appendMessage, loading],
  );

  return { messages, loading, sendMessage, clearMessages };
}
