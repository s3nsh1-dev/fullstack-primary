import { Request, Response, NextFunction, RequestHandler } from "express";
/*
THIS IS A WRAPPER WRAPPING A NORMAL FUNCTION AND GIVING SOME ENHANCEMENT TO PERFORM BETTER DURING DEVELOPMENT
OR
WRAPS A FUNCTION AND RETURNS A MODIFIED VERSION OF THE SAME FUNCTION

const asyncHandler =
(
    func: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res, next);
    } catch (err: any) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message,
        });
    }
};
*/

type IncomingFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler =
  (requestHandlerFunc: IncomingFunctionType): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    // this is advance
    Promise.resolve(requestHandlerFunc(req, res, next)).catch((error) => {
      next(error);
    });
  };

export default asyncHandler;
