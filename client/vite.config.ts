import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { config } from 'dotenv';
import path from 'path';

config();

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src'),
            },
            {
                find: '@pages',
                replacement: path.resolve(__dirname, 'src/pages'),
            },
            {
                find: '@components',
                replacement: path.resolve(__dirname, 'src/components'),
            },
            {
                find: '@utils',
                replacement: path.resolve(__dirname, 'src/utils'),
            },
        ],
    },
    server: {
        proxy: {
            '/hasura': {
                target: process.env.GRAPHQL_URI,
                changeOrigin: true,
                secure: true,
                rewrite: (p) => p.replace(/^\/hasura/, ''),
                headers: {
                    'x-hasura-admin-secret': process.env.GRAPHQL_KEY,
                    'Content-Type': 'application/json',
                },
            },

            '/server': {
                target: 'http://localhost:3333/',
                changeOrigin: true,
                secure: true,
                rewrite: (p) => p.replace(/^\/server/, ''),
            },
        },
    },
});
