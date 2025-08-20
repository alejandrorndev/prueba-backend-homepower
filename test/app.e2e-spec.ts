import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Productos E2E', () => {
  let app: INestApplication;
  let productoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Debe crear un producto', async () => {
    const response = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Mouse logictech g502 de jest mijo pruebs super tests e2e',
        precio: 333.0,
        stock: 2,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(
      'Mouse logictech g502 de jest mijo pruebs super tests e2e',
    );

    productoId = response.body.id;
    console.log('🆔 Producto creado con ID:', productoId);
  });

  it('Debe obtener todos los productos', async () => {
    const res = await request(app.getHttpServer())
      .get('/productos')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener el producto creado por su ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/productos/porid/${productoId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', productoId);
    expect(res.body.nombre).toBe(
      'Mouse logictech g502 de jest mijo pruebs super tests e2e',
    );
  });

  it('Debe actualizar el producto', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/productos/${productoId}`)
      .send({
        nombre: 'Mouse Logitech G502 HERO actualizado',
        precio: 350.0,
      })
      .expect(200);

    expect(res.body).toHaveProperty('id', productoId);
    expect(res.body.nombre).toBe('Mouse Logitech G502 HERO actualizado');
    expect(res.body.precio).toBe(350.0);
  });

  it('Debe eliminar el producto', async () => {
    await request(app.getHttpServer())
      .delete(`/productos/${productoId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/productos/${productoId}`)
      .expect(404);
  });
});
