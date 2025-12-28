import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication Systemx', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const email = "test321@test.com";
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: "1234" })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toEqual(email);
      })
  });
  it('signup as a new user, then get currently logged in user', async () => {
    const email = "abcd@test.com";
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: "1234" })
      .expect(201);
    const cookie = res.get("Set-Cookie");
    const { body } = await request(app.getHttpServer())
      .get("/auth/whoami")
      .set("Cookie", cookie!)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
