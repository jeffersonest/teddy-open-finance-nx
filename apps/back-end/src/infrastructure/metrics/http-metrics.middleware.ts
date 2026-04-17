import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from './metrics.registry.js';

const IGNORED_ROUTES = new Set(['/metrics', '/healthz']);

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    if (IGNORED_ROUTES.has(request.path)) {
      next();
      return;
    }

    const start = process.hrtime.bigint();
    response.on('finish', () => {
      const durationSeconds =
        Number(process.hrtime.bigint() - start) / 1_000_000_000;
      const route = resolveRoute(request);
      const labels = {
        method: request.method,
        route,
        status_code: String(response.statusCode),
      };
      httpRequestsTotal.inc(labels);
      httpRequestDurationSeconds.observe(labels, durationSeconds);
    });
    next();
  }
}

function resolveRoute(request: Request): string {
  const route = request.route?.path as string | undefined;
  if (route) return route;
  const baseUrl = request.baseUrl ?? '';
  return `${baseUrl}${request.path}` || 'unknown';
}
