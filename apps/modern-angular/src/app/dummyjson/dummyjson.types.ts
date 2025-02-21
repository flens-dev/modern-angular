import * as v from 'valibot';

export const DummyjsonUserSchema = v.object({
  id: v.number(),
  username: v.string(),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  gender: v.string(),
  image: v.pipe(v.string(), v.url()),
});

export type DummyjsonUser = v.InferOutput<typeof DummyjsonUserSchema>;

export const DummyjsonQuoteSchema = v.object({
  id: v.number(),
  quote: v.string(),
  author: v.string(),
});

export type DummyjsonQuote = v.InferOutput<typeof DummyjsonQuoteSchema>;

export type DummyjsonRequestLogin = {
  readonly username: string;
  readonly password: string;
  readonly expiresInMins?: number;
};

export const DummyjsonLoginResponseSchema = v.object({
  ...DummyjsonUserSchema.entries,
  accessToken: v.string(),
  refreshToken: v.string(),
});

export type DummyjsonLoginResponse = v.InferOutput<
  typeof DummyjsonLoginResponseSchema
>;
