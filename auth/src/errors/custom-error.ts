export abstract class CustomError extends Error {
  abstract statusCode: number;

  //can get log with bellow message
  constructor(message: string) {
    super(message);
    console.log(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
