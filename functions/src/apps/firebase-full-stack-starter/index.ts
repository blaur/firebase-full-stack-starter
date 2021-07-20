import { PubSubTopics } from '@app/shared/models/enum/pubsub-topics.enum';
import { PubsubEventsService } from '@app/shared/services/pubsub-events.service';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppDomainModule } from './src/app-domain.module';
import { MyEventListener } from './src/pubsub/my-event.listener';
import { MyScheduleScheduler } from './src/pubsub/my-schedule.scheduler';

const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppDomainModule,
    new ExpressAdapter(expressInstance),
  );

  await app.init();
};

// Firebase function that exposes the api to /appDomainApi
export const appDomainApi = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  });

// Pubsub listening on 'my-event'
export const onMyEvent = PubsubEventsService.topic(
  PubSubTopics.MyEvent,
  AppDomainModule,
  MyEventListener,
  'europe-west1',
  { timeoutSeconds: 540 },
);

// Pubsub scheduler
export const onMySchedule = PubsubEventsService.schedule(
  `every monday 06:00`,
  AppDomainModule,
  MyScheduleScheduler,
  'europe-west1',
  { timeoutSeconds: 540 },
);
