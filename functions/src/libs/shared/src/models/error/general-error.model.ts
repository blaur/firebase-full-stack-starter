import { HttpStatus } from '@nestjs/common';
import { GeneralErrorCode } from '../enum/general-error-codes.enum';

/**
 * General Error
 */
export class GeneralError implements Error {
  private errorCode: GeneralErrorCode;
  public name: string;
  public httpStatus: HttpStatus;
  public message: string;
  public stack?: string;

  /**
   * @param  {string} message
   * @param  {ErrorCode} errorCode
   * @param  {number} httpStatus
   */
  constructor(
    message: string,
    errorCode: GeneralErrorCode,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    this.message = message;
    this.name = 'GeneralError';
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
  }

  /**
   * @return {number}
   */
  public getCode(): number {
    return this.errorCode;
  }
}
