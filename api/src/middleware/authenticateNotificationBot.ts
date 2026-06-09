import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const API_KEY_HEADER = 'x-api-key';

export const authenticateNotificationBot = createMiddleware(async (c, next) => {
  const expectedApiKey = process.env.BOT_TO_API_KEY;

  if (!expectedApiKey) {
    throw new HTTPException(500, {
      cause: 'Missing BOT_TO_API_KEY in environment variables',
    });
  }

  const providedApiKey = c.req.header(API_KEY_HEADER);

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    throw new HTTPException(401, {
      message: 'Missing or invalid API key',
    });
  }

  await next();
});
