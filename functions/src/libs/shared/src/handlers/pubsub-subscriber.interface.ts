import { EventContext } from 'firebase-functions';
import { Message } from 'firebase-functions/lib/providers/pubsub';

export interface PubsubSubscriberInterface {
  /**
   * Handle messages from firebase lib.
   *
   * @param context - EventContext from pubsub
   */
  onEvent(message: Message, context: EventContext): Promise<any>;
}
