import { EventContext } from 'firebase-functions';

export interface PubsubScheduleInterface {
  /**
   * Handle messages from firebase lib.
   *
   * Fetch all providers with decorator: `@OnMessage()` and filter messages
   * according decorator specification
   *
   * Invokes all providers at same time promisifying all of them
   *
   * @param context - EventContext from pubsub
   */
  schedule(context: EventContext): Promise<any>;
}
