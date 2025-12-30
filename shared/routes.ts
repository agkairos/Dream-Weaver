import { z } from 'zod';
import { insertCalculationSchema, calculations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  calculations: {
    list: {
      method: 'GET' as const,
      path: '/api/calculations',
      responses: {
        200: z.array(z.custom<typeof calculations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/calculations',
      input: insertCalculationSchema,
      responses: {
        201: z.custom<typeof calculations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/calculations/latest',
      responses: {
        200: z.custom<typeof calculations.$inferSelect>().nullable(),
      },
    }
  },
};
