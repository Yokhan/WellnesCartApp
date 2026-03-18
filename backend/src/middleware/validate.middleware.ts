import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidateTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[target];
    const result = schema.safeParse(data);

    if (result.success) {
      (req as unknown as Record<string, unknown>)[`_validated_${target}`] = result.data;
      next();
      return;
    }

    const zodError = result.error as ZodError;
    const errors = zodError.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors,
      },
    });
  };
}

export function validateComposite(schema: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allErrors: { path: string; message: string }[] = [];

    for (const target of ['body', 'params', 'query'] as const) {
      const s = schema[target];
      if (!s) continue;
      const result = s.safeParse(req[target]);
      if (!result.success) {
        allErrors.push(
          ...result.error.errors.map((e) => ({
            path: `${target}.${e.path.join('.')}`,
            message: e.message,
          }))
        );
      } else {
        (req as unknown as Record<string, unknown>)[target] = result.data;
      }
    }

    if (allErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: allErrors },
      });
      return;
    }
    next();
  };
}
