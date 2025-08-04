import { Request, Response, NextFunction, RequestHandler } from "express";

// Custom type alias
type IncomingFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<any>;

const asyncHandler =
  (requestHandlerFunc: IncomingFunctionType): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    /**
     *  Converts the async handler to a promise and catches errors
     *  Promise.resolve() converts it into a guaranteed Promise.
     */
    Promise.resolve(requestHandlerFunc(req, res, next)).catch((error) => {
      next(error); // Passes the error to Express's error middleware using next(error).
    });
  };

export { asyncHandler };

/*
THIS IS A WRAPPER WRAPPING A NORMAL FUNCTION AND GIVING SOME ENHANCEMENT TO PERFORM BETTER DURING DEVELOPMENT
OR
WRAPS A FUNCTION AND RETURNS A MODIFIED VERSION OF THE SAME FUNCTION

Use a wrapper function like asyncHandler to catch these errors and pass them to next(error), so Express’s error middleware can handle them.

This asyncHandler:
1. Takes an async function (Express handler) as input.
2. Returns a new function that automatically wraps it in a try/catch.
3. If any error occurs inside the async function, it sends a JSON error response
   with status code (error.code if available, else 500).


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
