import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) { }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      //Crea una nueva instancia de la entidad Producto
      const producto = this.productoRepository.create(createProductoDto);

      // Guarda la instancia del producto en la base de datos
      const savedProducto = await this.productoRepository.save(producto);

      // Retorna el producto guardado (que ahora incluirá el ID generado por la BD)
      return savedProducto;

    } catch (error) {
      // Manejo de errores específicos de la base de datos
      if (error.code === '23505') {
        throw new BadRequestException(`Ya existe un producto con el nombre "${createProductoDto.nombre}".`);
      }
      // lanza un error genérico del servidor
      throw new InternalServerErrorException('Error inesperado al crear el producto.');
    }
  }

  async findAll(): Promise<Producto[]> {
    // Retorna todos los productos encontrados
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<Producto> {
    // Busca un producto por su ID
    const producto = await this.productoRepository.findOneBy({ id });

    // Si no se encuentra el producto, lanza una excepción 404
    if (!producto) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado.`);
    }

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    // Si no encuentra la entidad, retorna 'undefined'.
    const producto = await this.productoRepository.preload({ id, ...updateProductoDto });

    // Si no encontró el producto, lanza una excepción 404
    if (!producto) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para actualizar.`);
    }

    try {
      // Guarda la entidad actualizada en la base de datos
      const updatedProducto = await this.productoRepository.save(producto);
      return updatedProducto;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(`Ya existe otro producto con el nombre "${updateProductoDto.nombre}".`);
      }
      throw new InternalServerErrorException('Error inesperado al actualizar el producto.');
    }
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    const result = await this.productoRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para eliminar.`);
    }

    return { message: `Producto con ID "${id}" eliminado exitosamente.`, id: id };
  }

  async restore(id: string): Promise<Producto> {
    await this.productoRepository.restore(id);
    return this.findOne(id);
  }


}