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
    it('Должен вернуть все жанры книг', async () => {
      const res = await request(app).get('/categories/');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
  {
    "category_id": 1,
    "category_name": "Роман"
  },
  {
    "category_id": 2,
    "category_name": "Фэнтези"
  },
  {
    "category_id": 3,
    "category_name": "Антиутопия"
  },
  {
    "category_id": 4,
    "category_name": "Приключения"
  },
  {
    "category_id": 5,
    "category_name": "Сказка"
  },
  {
    "category_id": 6,
    "category_name": "Магический реализм"
  },
  {
    "category_id": 7,
    "category_name": "Научная литература"
  },
  {
    "category_id": 8,
    "category_name": "История"
  },
  {
    "category_id": 9,
    "category_name": "Детектив"
  },
  {
    "category_id": 10,
    "category_name": "Поэзия"
  }
]);
    });
  });

  describe('GET /books/:id', () => {
    it('Должен вернуть книгу по ее id', async () => {
      const res = await request(app).get('/books/1/');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        product_id: 1,
        name: 'Война и мир',
        category_name: 'Роман',
        image_url: expect.stringContaining('/images/Роман/voina_i_mir.jpg')
      });
    });

    it('При указании id с несуществующей книгой должен вернуть ошибку', async () => {
      const res = await request(app).get('/books/1000');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Книга не найдена' });
    });
  });

});
