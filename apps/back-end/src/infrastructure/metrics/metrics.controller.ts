import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  ensureDefaultMetricsCollected,
  metricsRegister,
} from './metrics.registry.js';

ensureDefaultMetricsCollected();

@ApiExcludeController()
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', metricsRegister.contentType)
  async getMetrics(): Promise<string> {
    return metricsRegister.metrics();
  }
}
