import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/jwt/jwt-auth.guard.js';
import { CreateClientUseCase } from '../../application/use_cases/create-client.use-case.js';
import { DeleteClientUseCase } from '../../application/use_cases/delete-client.use-case.js';
import { GetClientUseCase } from '../../application/use_cases/get-client.use-case.js';
import { ListClientsUseCase } from '../../application/use_cases/list-clients.use-case.js';
import { UpdateClientUseCase } from '../../application/use_cases/update-client.use-case.js';
import { ClientResponseDto, PaginatedClientsResponseDto } from '../dto/client-response.dto.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { ListClientsQueryDto } from '../dto/list-clients-query.dto.js';
import { UpdateClientDto } from '../dto/update-client.dto.js';
import { ClientExceptionFilter } from '../filters/client-exception.filter.js';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard)
@UseFilters(ClientExceptionFilter)
export class ClientsController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly listClients: ListClientsUseCase,
    private readonly getClient: GetClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ClientResponseDto })
  async create(@Body() dto: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.createClient.execute(dto);
    return ClientResponseDto.fromDomain(client);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedClientsResponseDto })
  async list(@Query() query: ListClientsQueryDto): Promise<PaginatedClientsResponseDto> {
    const result = await this.listClients.execute(query);
    return {
      data: result.data.map((client) => ClientResponseDto.fromDomain(client)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: ClientResponseDto })
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ClientResponseDto> {
    const client = await this.getClient.execute(id);
    return ClientResponseDto.fromDomain(client);
  }

  @Put(':id')
  @ApiOkResponse({ type: ClientResponseDto })
  async replace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClient.execute({ id, ...dto });
    return ClientResponseDto.fromDomain(client);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ClientResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClient.execute({ id, ...dto });
    return ClientResponseDto.fromDomain(client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteClient.execute(id);
  }
}
