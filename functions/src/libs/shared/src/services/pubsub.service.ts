import { Injectable, Logger, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  EventContext,
  pubsub,
  RuntimeOptions,
  runWith,
  region,
} from 'firebase-functions';
import { Message } from 'firebase-functions/lib/providers/pubsub';
import { PubsubScheduleInterface } from '../handlers/pubsub-schedule.interface';
import { PubsubHandler } from '../handlers/pubsub.handler';

/**
 * Encapsulate firebase function invocation and create nest application for it.
 * Then it is delegated to a PubsubHandler which delegates to the correct custom handler.
 */
@Injectable()
export class PubsubService {
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
   * export const onMessage = Pubsub.topic('events', AppModule)
   * ```
   *
   * @param topic - Pubsub topic to listen for messages
   * @param module - Nest application module with NestFirebaseModule imported
   */
  static topic(topic: string, module: any, runtimeOptions?: RuntimeOptions) {
    const topicFn = runtimeOptions
      ? runWith(runtimeOptions).pubsub.topic(topic)
      : pubsub.topic(topic);

    return topicFn.onPublish(
      async (message: Message, context: EventContext) => {
        const nest = await NestFactory.createApplicationContext(module);

        try {
          const handler = nest.get(PubsubHandler);

          return handler.handle(message, context);
        } catch (error) {
          new Logger(PubsubService.name).error(
            "PubsubHadler provider not found, make sure that you imported 'NestFirebaseModule' into your module",
          );
          throw new Error('PubsubHadler provider not found');
        }
      },
    );
  }

  static schedule(
    schedule: string,
    module: any,
    scheduler: Type<PubsubScheduleInterface>,
    runtimeOptions?: RuntimeOptions,
  ) {
    const scheduleFn = runtimeOptions
      ? region('europe-west1')
          .runWith(runtimeOptions)
          .pubsub.schedule(schedule)
          .timeZone('Europe/London')
      : region('europe-west1')
          .pubsub.schedule(schedule)
          .timeZone('Europe/London');

    return scheduleFn.onRun(async (context: EventContext) => {
      const nest = await NestFactory.createApplicationContext(module);

      try {
        const handler = nest.get(scheduler);

        return handler.schedule(context);
      } catch (error) {
        new Logger(PubsubService.name).error(
          "PubsubSchedule provider not found, make sure that you imported 'NestFirebaseModule' into your module",
        );
        throw new Error('PubsubSchedule provider not found');
      }
    });
  }
}
