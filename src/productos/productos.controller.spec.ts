import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'; 

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService; 

  const mockProductosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(), // Make sure this is a jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService, 
          useValue: mockProductosService, 
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService); 

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created product', async () => {
      const createDto = { nombre: 'Test Producto', precio: 100, stock: 10 };
      const expectedResult = { id: 'some-uuid', ...createDto, createdAt: new Date(), updatedAt: new Date() };

      mockProductosService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of products', async () => {
      const expectedProducts = [
        { id: 'uuid1', nombre: 'P1', precio: 10, stock: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 'uuid2', nombre: 'P2', precio: 20, stock: 2, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockProductosService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedProducts);
    });

    it('should return an empty array if no products are found', async () => {
      mockProductosService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct ID and return the product', async () => {
      const productId = 'test-uuid-123';
      const expectedProduct = { id: productId, nombre: 'Test Product', precio: 50, stock: 5, createdAt: new Date(), updatedAt: new Date() };
      mockProductosService.findOne.mockResolvedValue(expectedProduct);

      const result = await controller.findOne(productId);

      expect(service.findOne).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedProduct);
    });

    it('should re-throw NotFoundException if service.findOne throws it', async () => {
      const productId = 'non-existent-uuid';
      mockProductosService.findOne.mockRejectedValue(new NotFoundException(`Producto con ID "${productId}" no encontrado.`));

      await expect(controller.findOne(productId)).rejects.toThrow(NotFoundException);
      await expect(controller.findOne(productId)).rejects.toThrow(`Producto con ID "${productId}" no encontrado.`);
    });
  });

  describe('update', () => {
    it('should call service.update with the correct ID and DTO and return the updated product', async () => {
      const productId = 'test-uuid-update';
      const updateDto = { nombre: 'Updated Name', precio: 120 };
      const expectedUpdatedProduct = { id: productId, nombre: 'Updated Name', precio: 120, stock: 10, createdAt: new Date(), updatedAt: new Date() };
      mockProductosService.update.mockResolvedValue(expectedUpdatedProduct);

      const result = await controller.update(productId, updateDto);

      expect(service.update).toHaveBeenCalledWith(productId, updateDto);
      expect(result).toEqual(expectedUpdatedProduct);
    });

    it('should re-throw NotFoundException if service.update throws it', async () => {
      const productId = 'non-existent-uuid-for-update';
      const updateDto = { nombre: 'Non Existent' };
      mockProductosService.update.mockRejectedValue(new NotFoundException(`Producto con ID "${productId}" no encontrado para actualizar.`));

      await expect(controller.update(productId, updateDto)).rejects.toThrow(NotFoundException);
      await expect(controller.update(productId, updateDto)).rejects.toThrow(`Producto con ID "${productId}" no encontrado para actualizar.`);
    });

    it('should re-throw BadRequestException if service.update throws it (e.g., unique conflict)', async () => {
      const productId = 'uuid-for-conflict';
      const updateDto = { nombre: 'Nombre Existente' };
      mockProductosService.update.mockRejectedValue(new BadRequestException(`Ya existe otro producto con el nombre "${updateDto.nombre}".`));

      await expect(controller.update(productId, updateDto)).rejects.toThrow(BadRequestException);
      await expect(controller.update(productId, updateDto)).rejects.toThrow(`Ya existe otro producto con el nombre "${updateDto.nombre}".`);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct ID and return success message', async () => {
      const productId = 'test-uuid-remove';
      const expectedMessage = { message: `Producto con ID "${productId}" eliminado exitosamente.`, id: productId };

      // This is the critical line: Ensure it's correctly telling the mock to resolve with expectedMessage
      mockProductosService.remove.mockResolvedValue(expectedMessage); 

      const result = await controller.remove(productId);

      expect(service.remove).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedMessage);
    });

    it('should re-throw NotFoundException if service.remove throws it', async () => {
      const productId = 'non-existent-uuid-for-removal';
      mockProductosService.remove.mockRejectedValue(new NotFoundException(`Producto con ID "${productId}" no encontrado para eliminar.`));

      await expect(controller.remove(productId)).rejects.toThrow(NotFoundException);
      await expect(controller.remove(productId)).rejects.toThrow(`Producto con ID "${productId}" no encontrado para eliminar.`);
    });
  });
});