import { PubsubSubscriberInterface } from '@app/shared/handlers/pubsub-subscriber.interface';
import { FirebaseLoggingService } from '@app/shared/services/firebase-logging.service';
import { Injectable } from '@nestjs/common';
import { EventContext } from 'firebase-functions';
import { Message } from 'firebase-functions/lib/providers/pubsub';

@Injectable()
export class MyEventListener implements PubsubSubscriberInterface {
  constructor(private readonly logging: FirebaseLoggingService) {}

  /**
   * On my event message
   * @param {Message} message
   * @param {EventContext} context
   * @return {Promise<void>}
   */
  async onEvent(message: Message, context: EventContext): Promise<void> {
    const messageBody: string = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;
    const myEventObject: any = messageBody ? JSON.parse(messageBody) : null;
    this.logging.log(`${MyEventListener.name}.${this.onEvent.name}`, {
      messageBody,
      myEventObject,
    });
  }
}
