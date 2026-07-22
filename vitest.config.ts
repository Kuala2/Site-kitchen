import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({ test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] }, resolve: { alias: { '@': resolve(process.cwd()) } } });
