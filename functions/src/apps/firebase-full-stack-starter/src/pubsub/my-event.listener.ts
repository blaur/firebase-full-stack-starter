import { OnMessage } from '@app/shared/decorator/on-message.decorator';
import { FirebaseLoggingService } from '@app/shared/services/firebase-logging.service';
import { Injectable } from '@nestjs/common';
import { Message } from 'firebase-functions/lib/providers/pubsub';

@Injectable()
export class MyEventListener {
  constructor(private readonly logging: FirebaseLoggingService) {}

  @OnMessage({
    topic: 'my-event',
  })
  async onMyEventMessage(message: Message): Promise<void> {
    this.logging.log(
      `Handling my event and received message ${JSON.stringify(message)}`,
    );
  }
}
