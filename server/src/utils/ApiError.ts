class ApiError extends Error {
  // TypeScript class property declaration with type annotations. <Imp. when strict mode is enabled compiler needs to know>. They disappear after compilation
  data: null;
  success: boolean;
  errors: any;

  constructor(
    // inline field declaration and type annotation to help TS < just add "pubic">
    public statusCode: number,
    errors: string | null = null,
    stack: string = "",
    message: string = "SOMETHING WENT WRONG"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
