import { webcrypto } from 'crypto';
import { rm } from 'fs/promises';
import { join } from 'path';

(global as any).crypto = webcrypto;

globalThis.beforeEach(async () => {
    try {
        await rm(join(__dirname, "..", "test.sqlite"));
    } catch (error) { }
});