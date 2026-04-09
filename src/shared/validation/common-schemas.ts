import { z } from 'zod';

export const idSchema = z.string().trim().min(1);

export const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());

export const isoDateStringSchema = z.string().datetime({ offset: true });
