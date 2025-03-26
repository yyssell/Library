const request = require('supertest');
const app = require('../../server');
const server = require('../../server').server;

describe('API Endpoints', () => {
  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET /categories', () => {
    it('should return all product categories', async () => {
      const res = await request(app).get('/categories/');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        { category_id: 1, category_name: 'Хлеб' },
        { category_id: 2, category_name: 'Торты' },
        { category_id: 3, category_name: 'Пирожные' },
        { category_id: 4, category_name: 'Выпечка' },
        { category_id: 5, category_name: 'Пироги' }
      ]);
    });
  });

  describe('GET /products/:id', () => {
    it('should return product details for valid ID', async () => {
      const res = await request(app).get('/products/1/');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        product_id: 1,
        name: 'Золотой Батон',
        category_name: 'Хлеб',
        image_url: expect.stringContaining('/images/Хлеб/golden_bread.jpg')
      });
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/products/777');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Продукт не найден' });
    });

    it('should have correct image URL structure', async () => {
      const res = await request(app).get('/products/1');

      const expectedUrl = `${process.env.SERVER_IP || 'http://localhost'}:${
        process.env.SERVER_PORT || 5000
      }/images/Хлеб/golden_bread.jpg`;

      expect(res.body.image_url).toBe(expectedUrl);
    });
  });

});