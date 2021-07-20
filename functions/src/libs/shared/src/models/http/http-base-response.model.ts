import { HttpStatus } from '@nestjs/common';
import { GeneralError } from '../error/general-error.model';

export interface HttpBaseResponse {
  error?: GeneralError;
  data?: any;
  status: HttpStatus;
}
