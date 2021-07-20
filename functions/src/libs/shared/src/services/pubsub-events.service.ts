import { Injectable, Logger, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'config/config';
import { EventContext, RuntimeOptions, region } from 'firebase-functions';
import { Message } from 'firebase-functions/lib/providers/pubsub';
import { PubsubScheduleInterface } from '../handlers/pubsub-schedule.interface';
import { PubsubSubscriberInterface } from '../handlers/pubsub-subscriber.interface';
const { PubSub } = require('@google-cloud/pubsub');
import { FirebaseLoggingService } from './firebase-logging.service';
import { FirebaseTestService } from './firebase-test.service';

@Injectable()
/**
 * Encapsulate firebase function invocation and create nest application for it.
 */
export class PubsubEventsService {
  private pubsub: any;

  /**
   * @param  {FirebaseTestService} firebaseTestService
   */
  constructor(
    private readonly firebaseTestService: FirebaseTestService,
    private readonly firebaseLoggingService: FirebaseLoggingService,
  ) {
    if (!this.firebaseTestService.getTestFirebaseTestApp()) {
      const projectId = config.credential.project_id;
      this.pubsub = new PubSub({ projectId });
    }
  }
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
   * @param {string}  topic - Pubsub topic to listen for messages
   * @param {any} module - Nest application module with NestFirebaseModule imported
   * @param  {Type<PubsubSubscriberInterface>} subscriber
   * @param  {string} regionString
   * @param {RuntimeOptions} runtimeOptions
   * @return {any}
   */
  static topic(
    topic: string,
    module: any,
    subscriber: Type<PubsubSubscriberInterface>,
    regionString: 'europe-west1' | 'us-central1',
    runtimeOptions?: RuntimeOptions,
  ) {
    const topicFn = runtimeOptions
      ? region(regionString).runWith(runtimeOptions).pubsub.topic(topic)
      : region(regionString).pubsub.topic(topic);

    return topicFn.onPublish(
      async (message: Message, context: EventContext) => {
        const nest = await NestFactory.createApplicationContext(module);

        try {
          const handler = nest.get(subscriber);

          return handler.onEvent(message, context);
        } catch (error) {
          new Logger(PubsubEventsService.name).error(
            "PubsubSubscriberInterface provider not found, make sure that you imported 'NestFirebaseModule' into your module",
          );
          throw new Error('PubsubSubscriberInterface provider not found');
        }
      },
    );
  }
  /**
   * This is my stuff
   * @param  {string} schedule
   * @param  {any} module
   * @param  {Type<PubsubScheduleInterface>} scheduler
   * @param  {string} regionString
   * @param  {RuntimeOptions} runtimeOptions?
   * @return {any}
   */
  static schedule(
    schedule: string,
    module: any,
    scheduler: Type<PubsubScheduleInterface>,
    regionString: 'europe-west1' | 'us-central1',
    runtimeOptions?: RuntimeOptions,
  ) {
    const scheduleFn = runtimeOptions
      ? region(regionString)
          .runWith(runtimeOptions)
          .pubsub.schedule(schedule)
          .timeZone('Europe/Copenhagen')
      : region(regionString)
          .pubsub.schedule(schedule)
          .timeZone('Europe/Copenhagen');

    return scheduleFn.onRun(async (context: EventContext) => {
      const nest = await NestFactory.createApplicationContext(module);

      try {
        const handler = nest.get(scheduler);

        return handler.schedule(context);
      } catch (error) {
        console.log(error);
        new Logger(PubsubEventsService.name).error(
          "PubsubSchedule provider not found, make sure that you imported 'NestFirebaseModule' into your module",
        );
        throw new Error('PubsubSchedule provider not found');
      }
    });
  }

  /**
   * Publish event
   * @param {string} topicName
   * @param {any} data
   */
  public async publishEvent(topicName: string, data: any): Promise<void> {
    if (!this.firebaseTestService.getTestFirebaseTestApp()) {
      const dataBuffer = Buffer.from(JSON.stringify(data));

      const messageId = await this.pubsub.topic(topicName).publish(dataBuffer);

      this.firebaseLoggingService.log(
        `${PubsubEventsService.name}.${this.publishEvent.name}`,
        { topicName, data, messageId },
      );
    }
  }
}
