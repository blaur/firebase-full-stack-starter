import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from '@firebase/testing';
import { Injectable } from '@nestjs/common';
import * as sinon from 'sinon';
import * as admin from 'firebase-admin';

@Injectable()
/**
 * Test app
 */
export class FirebaseTestService {
  public static myTestApp: any;

  /**
   * @param {boolean} loggerOff
   */
  async initializeTestFirebase() {
    if (FirebaseTestService.myTestApp) {
      return FirebaseTestService.myTestApp;
    } else {
      FirebaseTestService.myTestApp = initializeAdminApp({
        databaseName: 'dev',
        projectId: 'dev',
      });

      return FirebaseTestService.myTestApp;
    }
  }

  /**
   * Get test app
   * @return {any}
   */
  getTestFirebaseTestApp() {
    return FirebaseTestService.myTestApp;
  }

  /**
   * Get firestore
   * @return {ant}
   */
  getFirestore() {
    const myFirestore = FirebaseTestService.myTestApp.firestore();
    myFirestore.settings({
      host: 'localhost',
      ssl: false,
    });
    return myFirestore;
  }

  /**
   * Tear it all down
   * @return {any}
   */
  tearDown() {
    return Promise.all(apps().map((app) => app.delete()));
  }

  /**
   * Clear firestore
   * @return {any}
   */
  async clearFirestore() {
    // mymoniiLoggingService.log('Clearing Firestore');
    return clearFirestoreData({
      projectId: 'dev',
    });
  }

  /**
   * Mocking all da services
   */
  public mockAllServices() {
    sinon.stub(admin, 'initializeApp');
    sinon.stub(admin, 'app').callsFake(this.getTestFirebaseTestApp);
    sinon.stub(admin, 'messaging').get(() => {
      return () => {
        const messaging = {
          send: (data) => {
            console.log('MESSAGING DATA', data);
          },
        };

        return messaging;
      };
    });

    sinon.stub(admin, 'auth').get(() => () => ({
      verifyIdToken: (uid: string) => {
        console.log('Successfully fucking authed');
        return new Promise(async (resolve, reject) => {
          resolve({ uid });
        });
      },
    }));
  }
}
