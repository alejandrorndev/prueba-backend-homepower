import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

/**
 * DTO para la actualización parcial de un producto.
 *
 * Extiende CreateProductoDto usando PartialType, lo que genera una nueva
 * clase con las mismas propiedades que CreateProductoDto **pero en tipo**
 * marcadas como opcionales.
 */
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
