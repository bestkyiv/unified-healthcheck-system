import type { HonoRequest } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { ZodType } from 'zod';

type RequestSource = 'body' | 'params' | 'query';

const getObjectToValidate = async (
  request: HonoRequest,
  source: RequestSource,
) => {
  switch (source) {
    case 'body':
      return await request.json();
    case 'params':
      return request.param();
    case 'query':
      return request.query();
  }
};

const validateRequest = async <T extends Record<string, unknown>>(
  request: HonoRequest,
  schema: ZodType<T>,
  errorMessage: string = 'Invalid request body',
  source: RequestSource = 'body',
): Promise<T> => {
  const data = await getObjectToValidate(request, source);
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    throw new HTTPException(400, {
      message: errorMessage,
      cause: parseResult.error,
    });
  }

  return parseResult.data;
};

export default validateRequest;
