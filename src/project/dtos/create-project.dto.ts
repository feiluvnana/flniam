import { createZodDto } from "nestjs-zod";
import z from "zod";

export const createOneProjectInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export class CreateOneProjectInputDto extends createZodDto(createOneProjectInputSchema) {}

export const createOneProjectOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class CreateOneProjectOutputDto extends createZodDto(createOneProjectOutputSchema) {}
