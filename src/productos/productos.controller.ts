
import {  Controller,  Get,  Post,  Body,  Patch,  Param,  Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  async create(@Body() createProductoDto: CreateProductoDto) {
    return await this.productosService.create(createProductoDto);
  }

  @Get()
  async findAll() {
    return await this.productosService.findAll();
  }

  @Get(':id')
  // Usa ParseUUIDPipe para validar que el 'id' sea un UUID válido
  async findOne(@Param('id', ParseUUIDPipe) id: string) { 
    return await this.productosService.findOne(id);
  }

  @Patch(':id')
  // Usa ParseUUIDPipe para validar el 'id'
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return await this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productosService.remove(id);
  }
}