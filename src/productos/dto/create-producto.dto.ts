import { IsString, IsNumber, IsNotEmpty, IsPositive, Min, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres.' })
  nombre: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsPositive({ message: 'El precio debe ser un valor positivo.' })
  @Min(0.01, { message: 'El precio mínimo es 0.01.' })
  precio: number;

  @IsNumber({}, { message: 'El stock debe ser un número.' })
  @IsPositive({ message: 'El stock debe ser un valor positivo.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock: number;
}