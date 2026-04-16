import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/jwt/jwt-auth.guard.js';
import type { JwtPayload } from '../../../auth/infrastructure/jwt/jwt.strategy.js';
import { AgentRunner } from '../../domain/interfaces/agent-runner.js';
import { ChatRequestDto } from '../dto/chat-request.dto.js';
import { ChatResponseDto } from '../dto/chat-response.dto.js';

@ApiTags('agent')
@ApiBearerAuth()
@Controller('agent')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentRunner: AgentRunner) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChatResponseDto })
  async chat(
    @Body() dto: ChatRequestDto,
    @Req() req: Request,
  ): Promise<ChatResponseDto> {
    const user = req.user as JwtPayload;
    const reply = await this.agentRunner.chat(dto.message, user.sub);
    return new ChatResponseDto(reply);
  }
}
