import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { HttpBaseResponse } from '../models/http/http-base-response.model';
import { FirebaseLoggingService } from './firebase-logging.service';

@Injectable()
/**
 * Wrapping FirestoreDAO implementation for now
 */
export class GeneralHelperService {
  /**
   * @param  {FirebaseLoggingService} privatereadonlyfirebaseLoggingService
   */
  constructor(
    private readonly firebaseLoggingService: FirebaseLoggingService,
  ) {}

  /**
   * Docs to objects
   * @param {any} docs
   * @param {any} key_name
   * @return {any}
   */
  docsToObjects(docs: any, key_name: string = 'id'): any {
    return docs.map((e) => {
      const docData = e.data();
      docData[key_name] = e.id;
      return docData;
    });
  }

  /**
   * @param {any} object
   * @return {any}
   */
  keysToArray(object) {
    if (!object || typeof object !== 'object') {
      return [];
    }
    if (Array.isArray(object)) {
      return object;
    }
    return Object.keys(object);
  }

  /**
   * @param  {number} amount
   * @return {number}
   */
  formatNumberToOneDigit(amount: number): number {
    return Number(amount.toFixed(0));
  }

  /**
   * @param  {any} array
   * @param  {any} value
   * @return {any}
   */
  arrayToObject(array: any, value: any = true): any {
    if (Array.isArray(array)) {
      const result = {};
      array.forEach((el) => (result[el] = value));
      return result;
    }
    return array;
  }

  /**
   * Segments to path
   * @param  {string[]} segments
   * @return {any}
   */
  segmentsToPath(segments: string[]) {
    if (!segments || !segments.reduce) {
      return '';
    }
    return segments.reduce((pr, e, index, arr) => {
      pr += e;
      if (index + 1 !== arr.length) {
        pr += '/';
      }
      return pr;
    }, '');
  }

  /**
   * @param  {Response} res
   * @param  {BaseResponse} responseData
   */
  sendBaseResponse(res: Response, responseData: HttpBaseResponse) {
    this.firebaseLoggingService.info('sendBaseResponse', responseData);
    res.status(responseData.status).json(responseData);
  }
}
