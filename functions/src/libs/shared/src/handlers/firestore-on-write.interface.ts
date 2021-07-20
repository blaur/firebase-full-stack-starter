import { DocumentSnapshot } from '@google-cloud/firestore';
import { Change, EventContext } from 'firebase-functions';

export interface FirestoreOnWriteInterface {
  /**
   * Handle on write object created
   *
   * @param change - Change<DocumentSnapshot>
   * @param context - EventContext from pubsub
   */
  objectCreated(
    change: Change<DocumentSnapshot>,
    context: EventContext,
  ): Promise<void>;

  /**
   * Handle on write object changed
   *
   * @param change - Change<DocumentSnapshot>
   * @param context - EventContext from pubsub
   */
  objectChanged(
    change: Change<DocumentSnapshot>,
    context: EventContext,
  ): Promise<void>;

  /**
   * Handle on write object deleted
   *
   * @param change - Change<DocumentSnapshot>
   * @param context - EventContext from pubsub
   */
  objectDeleted(
    change: Change<DocumentSnapshot>,
    context: EventContext,
  ): Promise<void>;
}
