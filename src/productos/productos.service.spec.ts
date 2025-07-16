import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';


const mockProductoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
};

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductoRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const createDto: CreateProductoDto = {
        nombre: 'Pantalla ROG',
        precio: 1000,
        stock: 5,
      };
      const expectedProduct = { ...createDto, id: 'some-uuid', createdAt: new Date(), updatedAt: new Date() }; // Add dates for consistency

      mockProductoRepository.create.mockReturnValue(createDto); 
      mockProductoRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedProduct);
    });

    it('Debe lanzar una excepción BadRequestException si el nombre del producto ya existe.', async () => {
      const createDto: CreateProductoDto = {
        nombre: 'Laptop Existente',
        precio: 1000,
        stock: 5,
      };

      const mockError = { code: '23505' }; 

      mockProductoRepository.create.mockReturnValue(createDto);
      mockProductoRepository.save.mockRejectedValue(mockError);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow(`Ya existe un producto con el nombre "${createDto.nombre}".`);
    });

    it('debería lanzar InternalServerErrorException para otros errores de la base de datos', async () => {
      const createDto: CreateProductoDto = {
        nombre: 'Laptop Error DB',
        precio: 1000,
        stock: 5,
      };

      const mockError = new Error('Error en la base de datos'); 
      
      mockProductoRepository.create.mockReturnValue(createDto);
      mockProductoRepository.save.mockRejectedValue(mockError);

      await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
      await expect(service.create(createDto)).rejects.toThrow('Error inesperado al crear el producto.');
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Producto[] = [{
        id: 'uuid1', nombre: 'P1', precio: 10, stock: 1, 
        createdAt: new Date(), updatedAt: new Date()
      }];
      mockProductoRepository.find.mockResolvedValue(products);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('debe devolver una matriz vacía si no se encuentran productos', async () => {
      mockProductoRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe devolver un producto si lo encuentra', async () => {
      const productId = 'uuid-existing';
      const foundProduct: Producto = { 
        id: productId, nombre: 'Found Product', precio: 50, stock: 5,
        createdAt: new Date(), updatedAt: new Date()
      };
      mockProductoRepository.findOneBy.mockResolvedValue(foundProduct);

      const result = await service.findOne(productId);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(result).toEqual(foundProduct);
    });

    it('Debe lanzar una excepción NotFoundException si no se encuentra el producto.', async () => {
      const productId = 'uuid-not-found';
      mockProductoRepository.findOneBy.mockResolvedValue(null); 

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(productId)).rejects.toThrow(`Producto con ID "${productId}" no encontrado.`);
    });
  });

  describe('update', () => {
    it('Debe actualizar y devolver el producto.', async () => {
      const productId = 'uuid-to-update';
      const updateDto = { nombre: 'Panralla Cambio de nombre', precio: 150 };
      const existingProduct: Producto = { 
        id: productId, nombre: 'Pantalla ROG', precio: 100, stock: 10,
        createdAt: new Date(), updatedAt: new Date()
      };
      const updatedProduct: Producto = { ...existingProduct, ...updateDto };

      mockProductoRepository.preload.mockResolvedValue(updatedProduct);
      mockProductoRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateDto);
      expect(repository.preload).toHaveBeenCalledWith({ id: productId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });

    it('Debe lanzar una excepción NotFoundException si no se encuentra el producto que se va a actualizar.', async () => {
      const productId = 'uuid-not-found';
      const updateDto = { nombre: 'Non Existent' };
      mockProductoRepository.preload.mockResolvedValue(null); 

      await expect(service.update(productId, updateDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(productId, updateDto)).rejects.toThrow(`Producto con ID "${productId}" no encontrado para actualizar.`);
    });

    it('Debe lanzar una excepción BadRequestException si la actualización provoca un conflicto único.', async () => {
      const productId = 'uuid-to-update';
      const updateDto = { nombre: 'Pantalla ROG' };
      const productToPreload: Producto = { 
        id: productId, nombre: 'Pantalla ROG', precio: 100, stock: 10,
        createdAt: new Date(), updatedAt: new Date()
      };
      const conflictError = { code: '23505' };

      mockProductoRepository.preload.mockResolvedValue(productToPreload);
      mockProductoRepository.save.mockRejectedValue(conflictError);

      await expect(service.update(productId, updateDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(productId, updateDto)).rejects.toThrow(`Ya existe otro producto con el nombre "${updateDto.nombre}".`);
    });

    it('debería lanzar InternalServerErrorException para otros errores de la base de datos', async () => {
      const productId = 'uuid-to-update';
      const updateDto = { nombre: 'Name' };
      const productToPreload: Producto = { 
        id: productId, nombre: 'Current Name', precio: 100, stock: 10,
        createdAt: new Date(), updatedAt: new Date()
      };
      const genericError = new Error('Error genérico de la base de datos durante la actualización');

      mockProductoRepository.preload.mockResolvedValue(productToPreload);
      mockProductoRepository.save.mockRejectedValue(genericError);

      await expect(service.update(productId, updateDto)).rejects.toThrow(InternalServerErrorException);
      await expect(service.update(productId, updateDto)).rejects.toThrow('Error inesperado al actualizar el producto.');
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto correctamente', async () => {
      const productId = 'test-uuid-remove';
      mockProductoRepository.delete.mockResolvedValue({ affected: 1 }); 

      const result = await service.remove(productId);
      expect(repository.delete).toHaveBeenCalledWith(productId);
      // This expect matches what your ACTUAL service.remove method should return
      expect(result).toEqual({ message: `Producto con ID "${productId}" eliminado exitosamente.`, id: productId });
    });

    it('Debe lanzar una excepción NotFoundException si no se encuentra el producto que se va a eliminar.', async () => {
      const productId = 'uuid-not-found';
      mockProductoRepository.delete.mockResolvedValue({ affected: 0 }); 

      await expect(service.remove(productId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(productId)).rejects.toThrow(`Producto con ID "${productId}" no encontrado para eliminar.`);
    });
  });
});