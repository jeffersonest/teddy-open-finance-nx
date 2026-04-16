import type { ChatRequest, ChatResponse } from '@teddy-open-finance/contracts';
import { apiClient } from '../../../shared/api/api-client';

export const chatApi = {
  sendMessage: (payload: ChatRequest): Promise<ChatResponse> =>
    apiClient.post<ChatResponse>('/agent/chat', payload).then((response) => response.data),
};
