import { Injectable, Logger, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  EventContext,
  RuntimeOptions,
  region,
  Change,
} from 'firebase-functions';
import { FirebaseLoggingService } from './firebase-logging.service';
import { DocumentSnapshot } from '@google-cloud/firestore';
import { FirestoreOnWriteInterface } from '../handlers/firestore-on-write.interface';

@Injectable()
/**
 * Encapsulate firebase function invocation and create nest application for it.
 */
export class FirestoreEventsService {
  private pubsub: any;

  /**
   * @param  {FirebaseTestService} firebaseTestService
   */
  constructor(
    private readonly firebaseLoggingService: FirebaseLoggingService,
  ) {}
  /**
   * Returns a `CloudFunction` which should be exported in `index.ts` file
   *
   * Every time a function is invoked it creates a nest application with:
   *
   * ```ts
   * NestFactory.createApplicationContext(module)
   * ```
   *
   * Where module is you nest module **with `NestFirebaseModule` imported**
   *
   * How to use:
   *
   * In your `index.ts` at root folder:
   *
   * ```ts
   * export const onMessage = Pubsub.onWrite('path/{id}', AppModule)
   * ```
   *
   * @param {string}  path - Path for where we should listen for onWrite
   * @param {any} module - Nest application module with NestFirebaseModule imported
   * @param {Type<FirestoreOnWriteInterface>} onWriteHandler
   * @param  {string} regionString
   * @param {RuntimeOptions} runtimeOptions
   * @return {any}
   */
  static onWrite(
    path: string,
    module: any,
    onWriteHandler: Type<FirestoreOnWriteInterface>,
    regionString: 'europe-west1' | 'us-central1',
    runtimeOptions?: RuntimeOptions,
  ) {
    const topicFn = runtimeOptions
      ? region(regionString).runWith(runtimeOptions).firestore.document(path)
      : region(regionString).firestore.document(path);

    return topicFn.onWrite(
      async (change: Change<DocumentSnapshot>, context: EventContext) => {
        const nest = await NestFactory.createApplicationContext(module);

        try {
          const handler = nest.get(onWriteHandler);

          // Making sure to look at event type and distirbute to right method
          if (context.eventType === 'google.firestore.document.create') {
            return handler.objectCreated(change, context);
          }
          if (context.eventType === 'google.firestore.document.update') {
            return handler.objectChanged(change, context);
          }
          if (context.eventType === 'google.firestore.document.delete') {
            return handler.objectDeleted(change, context);
          }
          if (context.eventType === 'google.firestore.document.write') {
            const beforeData = change.before.exists; // data before the write
            const afterData = change.after.exists; // data after the write
            if (!beforeData && afterData) {
              return handler.objectCreated(change, context);
            }
            if (beforeData && afterData) {
              return handler.objectChanged(change, context);
            }
            if (beforeData && !afterData) {
              return handler.objectDeleted(change, context);
            }
          }
        } catch (error) {
          new Logger(FirestoreEventsService.name).error({ error });
          throw new Error('FirestoreEventsService provider not found');
        }
      },
    );
  }
}
