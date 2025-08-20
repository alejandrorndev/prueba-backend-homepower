import { IsString, IsNumber, IsNotEmpty, IsPositive, Min, MaxLength } from 'class-validator';

/**
 * DTO para la creación de un producto.
 *
 * - Define la forma esperada del payload para POST /productos.
 * - Contiene validaciones y mensajes claros para devolver errores legibles al cliente.
 */
export class CreateProductoDto {
  /**
   * Nombre del producto.
   * - Obligatorio.
   * - Debe ser una cadena no vacía.
   * - Longitud máxima: 100 caracteres.
   *
   * Ejemplo: "Mouse gamer"
   */
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres.' })
  nombre: string;

  /**
   * Precio del producto.
   * - Obligatorio.
   * - Debe ser un número positivo.
   * - Se establece un mínimo práctico de 0.01 para evitar precios nulos o cero.
   */
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsPositive({ message: 'El precio debe ser un valor positivo.' })
  @Min(0.01, { message: 'El precio mínimo es 0.01.' })
  precio: number;

  /**
   * Stock disponible del producto.
   * - Obligatorio.
   * - Debe ser un número entero.
   * - No puede ser negativo (permitimos 0 como stock válido).
   */
  @IsNumber({}, { message: 'El stock debe ser un número.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock: number;
}
