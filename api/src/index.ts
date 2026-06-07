import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json([1, 2, 3]);
});

export default app;