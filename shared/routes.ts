import { z } from 'zod';
import { insertDoctorSchema, doctors, userSettings, updateUserLocationSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors',
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/doctors/:id',
      responses: {
        200: z.custom<typeof doctors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: {
        200: z.custom<typeof userSettings.$inferSelect>(),
      },
    },
    updateLocation: {
      method: 'PATCH' as const,
      path: '/api/settings/location',
      input: updateUserLocationSchema,
      responses: {
        200: z.custom<typeof userSettings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    toggleTheme: {
      method: 'PATCH' as const,
      path: '/api/settings/theme',
      input: z.object({ theme: z.enum(['light', 'dark']) }),
      responses: {
        200: z.custom<typeof userSettings.$inferSelect>(),
      },
    }
  },
  drugs: {
    search: {
      method: 'GET' as const,
      path: '/api/drugs/search',
      input: z.object({ q: z.string() }),
      responses: {
        200: z.array(z.custom<typeof drugPrices.$inferSelect>()),
      },
    }
  },
  profile: {
    updateAvatar: {
      method: 'PATCH' as const,
      path: '/api/profile/avatar',
      input: z.object({ avatarUrl: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
