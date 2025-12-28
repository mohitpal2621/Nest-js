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
});
