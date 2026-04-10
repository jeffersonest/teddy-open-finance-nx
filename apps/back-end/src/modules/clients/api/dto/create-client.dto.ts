import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, MinLength, Min } from 'class-validator';
import type { CreateClientRequest } from '@teddy-open-finance/contracts';

export class CreateClientDto implements CreateClientRequest {
  @ApiProperty({ example: 'Eduardo' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 3500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salary!: number;

  @ApiProperty({ example: 120000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  companyValuation!: number;
}
