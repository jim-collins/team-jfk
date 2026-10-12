import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Test settings live here so vite.config.js (and its lab server section) stays untouched.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.test.{js,jsx}', 'tests/**/*.test.{js,jsx}'],
  },
});
