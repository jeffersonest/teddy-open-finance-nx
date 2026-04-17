import { Counter, Histogram, collectDefaultMetrics, register } from 'prom-client';

let initialized = false;

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests processed by the backend',
  labelNames: ['method', 'route', 'status_code'] as const,
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export const agentChatTotal = new Counter({
  name: 'agent_chat_total',
  help: 'Total chat invocations to the LangChain agent',
  labelNames: ['outcome'] as const,
});

export const agentChatDurationSeconds = new Histogram({
  name: 'agent_chat_duration_seconds',
  help: 'Latency of LangChain agent chat invocations in seconds',
  labelNames: ['outcome'] as const,
  buckets: [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 30, 60],
});

export function ensureDefaultMetricsCollected(): void {
  if (initialized) return;
  collectDefaultMetrics();
  initialized = true;
}

export const metricsRegister = register;
