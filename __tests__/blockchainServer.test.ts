import request from "supertest";
import {app} from '../src/server/blockchainServer'
import Block from "../src/lib/block";

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

describe('Blockchain server tests', () => {
    test('GET / status', async () => {
        const response = await request(app)
        .get('/status/');

        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })

    test('GET / blocks/next - Should get next block info', async () => {
        const response = await request(app)
        .get('/blocks/next');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    })

    test('GET / blocks/:indexOrHash - Should get Genesis from index', async () => {
        const response = await request(app)
        .get('/blocks/0');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    })

    test('GET / blocks/:indexOrHash - Should get Genesis from hash', async () => {
        const response = await request(app)
        .get('/blocks/abc');

        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual("abc");
    })

    test('GET / blocks/:indexOrHash - Should get ERROR from hash', async () => {
        const response = await request(app)
        .get('/blocks/abcd');

        expect(response.status).toEqual(404);
    })

    test('GET / blocks/:indexOrHash - Should get ERROR from index', async () => {
        const response = await request(app)
        .get('/blocks/-1');

        expect(response.status).toEqual(404);
    })

    test('Post / blocks - Should add blocks', async () => {
        const block = new Block({
            index: 1
        } as Block);
        const response = await request(app)
        .post('/blocks/')
        .send(block);

        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    })

    test('Post / blocks - Should NOT add blocks (empty)', async () => {
        const response = await request(app)
        .post('/blocks/')
        .send({});

        expect(response.status).toEqual(422);
    })

    test('Post / blocks - Should NOT add blocks (invalid)', async () => {
        const block = new Block({
            index: -1
        } as Block);
        const response = await request(app)
        .post('/blocks/')
        .send(block);

        expect(response.status).toEqual(400);
    })
})