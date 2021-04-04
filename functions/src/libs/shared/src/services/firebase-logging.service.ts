import { Injectable } from '@nestjs/common';
import { logger } from 'firebase-functions';

/**
 * FirebaseLoggingService - Centralized logging for Firebase Functions
 */
@Injectable()
export class FirebaseLoggingService {
  /**
   * Writes INFO severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public log(message: string, metadata?: { [key: string]: any }) {
    logger.log(message, metadata ? metadata : {});
  }

  /**
   * Writes DEBUG severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public debug(message: string, metadata?: { [key: string]: any }) {
    logger.debug(message, metadata);
  }

  /**
   * Writes INFO severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public info(message: string, metadata?: { [key: string]: any }) {
    logger.info(message, metadata);
  }

  /**
   * Writes WARNING severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public warn(message: string, metadata?: { [key: string]: any }) {
    logger.warn(message, metadata);
  }

  /**
   * Writes ERROR severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public error(message: string, metadata?: { [key: string]: any }) {
    logger.error(message, metadata);
  }
}
