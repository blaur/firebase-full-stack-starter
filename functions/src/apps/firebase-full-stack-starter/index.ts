import { PubsubService } from '@app/shared/services/pubsub.service';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppDomainModule } from './src/app-domain.module';
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
export const onMyEvent = PubsubService.topic('my-event', AppDomainModule);

// Pubsub scheduler
export const onMySchedule = PubsubService.schedule(
  '0 3 * * *',
  AppDomainModule,
  MyScheduleScheduler,
  { timeoutSeconds: 540 },
);
