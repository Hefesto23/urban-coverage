import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async done => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    done();
  });

  // supertest provide a high-level abstraction for testing HTTP
  // check their doc
  it('200 / (GET)', async done => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Server is Up!');
    done();
  });

  it('400 /urban-coverage/search-address (POST) - input is not string', async done => {
    const response = await request(app.getHttpServer())
      .post('/urban-coverage/search-address')
      .send({ searchAddress: 54564498484 })
      .expect(400);
    expect(response.body.message[0]).toEqual('searchAddress must be a string');
    done();
  });

  it('400 /urban-coverage/search-address (POST) - input with less than minimum length', async done => {
    const response = await request(app.getHttpServer())
      .post('/urban-coverage/search-address')
      .send({ searchAddress: 'not' })
      .expect(400);
    expect(response.body.message[0]).toEqual(
      'Address should have at least 4 characters!',
    );
    done();
  });

  it('400 /urban-coverage/search-address (POST) - with giant input', async done => {
    const giantAddress = {
      searchAddress:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium' +
        'doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et' +
        'quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas' +
        'sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione' +
        'voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,' +
        'consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et ' +
        'dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum...',
    };
    const response = await request(app.getHttpServer())
      .post('/urban-coverage/search-address')
      .send(giantAddress)
      .expect(400);
    expect(response.body.message[0]).toEqual(
      'Address maximal length is 50 characters!',
    );
    done();
  });

  it('201 /urban-coverage/search-address (POST) - not found address', async done => {
    const giantAddress = {
      searchAddress: '#NONEXISTING41728',
    };
    const response = await request(app.getHttpServer())
      .post('/urban-coverage/search-address')
      .send(giantAddress)
      .expect(201);
    expect(response.body).toEqual({
      search: 'Non-existing address',
      status: 'NOT_FOUND',
    });
    done();
  });

  it('201 /urban-coverage/search-address (POST) - Found Address', async done => {
    const giantAddress = {
      searchAddress: 'Regent Street',
    };
    const response = await request(app.getHttpServer())
      .post('/urban-coverage/search-address')
      .send(giantAddress)
      .expect(201);
    expect(response.body).toEqual({
      location: expect.any(Object),
      search: 'regent street',
      status: 'OK',
    });
    done();
  });
});
