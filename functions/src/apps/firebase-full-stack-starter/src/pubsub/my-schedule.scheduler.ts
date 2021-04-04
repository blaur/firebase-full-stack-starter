import { PubsubScheduleInterface } from '@app/shared/handlers/pubsub-schedule.interface';
import { FirebaseLoggingService } from '@app/shared/services/firebase-logging.service';
import { Injectable } from '@nestjs/common';
import { EventContext } from 'firebase-functions';

@Injectable()
export class MyScheduleScheduler implements PubsubScheduleInterface {
  constructor(private readonly logging: FirebaseLoggingService) {}

  schedule(context: EventContext): Promise<any> {
    this.logging.log(
      `We are now handling stuff in ${MyScheduleScheduler.name}`,
    );

    return null;
  }
}
