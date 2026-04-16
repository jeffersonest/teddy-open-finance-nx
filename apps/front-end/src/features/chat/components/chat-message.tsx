import type { ChatMessage as ChatMessageType } from '../hooks/use-chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-[10px] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-[#ec6724] text-white'
            : 'rounded-bl-sm border border-[#ece6e1] bg-white text-[#111111]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <time
          className={`mt-1 block text-right text-[11px] ${
            isUser ? 'text-white/70' : 'text-[#8b8b8b]'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </div>
  );
}
