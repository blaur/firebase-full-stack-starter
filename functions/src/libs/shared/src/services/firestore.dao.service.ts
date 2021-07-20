import * as admin from 'firebase-admin';
import {
  CollectionReference,
  DocumentReference,
} from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';
import { FirebaseLoggingService } from './firebase-logging.service';
import { GeneralHelperService } from '../general-helpers.service';
import { FirebaseTestService } from './firebase-test.service';

@Injectable()
/**
 * Wrapping FirestoreDAO implementation for now
 */
export class FirestoreDaoService {
  private static database: admin.firestore.Firestore;

  /**
   * @param  {FirebaseLoggingService} firebaseLoggingService
   * @param  {GeneralHelperService} generalHelperService
   * @param  {FirebaseTestService} firebaseTestService
   */
  constructor(
    private readonly firebaseLoggingService: FirebaseLoggingService,
    private readonly generalHelperService: GeneralHelperService,
    private readonly firebaseTestService: FirebaseTestService,
  ) {
    const initedTestApp = firebaseTestService.getTestFirebaseTestApp();
    if (initedTestApp) {
      FirestoreDaoService.database = initedTestApp.firestore();
    } else {
      FirestoreDaoService.database = admin.firestore();
      FirestoreDaoService.database.settings({
        timestampsInSnapshots: true,
      });
    }
  }

  /**
   * @param  {string|CollectionReference} path
   * @param  {any} object
   * @param  {boolean} log?
   * @return {Promise<string>}
   */
  public async create(
    path: string | CollectionReference,
    object: any,
    log?: boolean,
  ): Promise<string> {
    if (!log) {
      this.firebaseLoggingService.info('.create: ', {
        path:
          typeof path === 'string'
            ? path
            : `${this.generalHelperService.segmentsToPath(
                path['_queryOptions'] && path['_queryOptions'].parentPath
                  ? path['_queryOptions'].parentPath.segments
                  : [],
              )}`,
        object,
      });
    }

    const collectionRef: CollectionReference =
      typeof path === 'string'
        ? FirestoreDaoService.database.collection(path)
        : path;
    const ref = await collectionRef.add(
      this.clearUndefinedFields(this.childToObject(object)),
    );

    return ref.id;
  }

  /**
   * @param  {string} collectionName
   * @param  {string} docId
   * @return {Promise<any>}
   */
  public async read(collectionName: string, docId: string): Promise<any> {
    return await FirestoreDaoService.database
      .collection(collectionName)
      .doc(docId)
      .get()
      .then((snapshot) => (snapshot.exists ? snapshot.data() : null));
  }

  /**
   * @param  {string} collectionName
   * @param  {string} docId
   * @param  {any} object
   * @return {Promise<any>}
   */
  public async update(
    collectionName: string,
    docId: string,
    object: any,
  ): Promise<any> {
    this.firebaseLoggingService.info('this.updateDocument: ', {
      path: `${collectionName}/${docId}`,
      object,
    });
    return await FirestoreDaoService.database
      .collection(collectionName)
      .doc(docId)
      .set(this.clearUndefinedFields(this.childToObject(object)))
      .then((writeResult) => writeResult);
  }
  /**
   * @param  {string} collectionName
   * @param  {string} docId
   * @param  {any} object
   * @return {Promise<any>}
   */
  public async updateFields(
    collectionName: string,
    docId: string,
    object: any,
  ): Promise<any> {
    this.firebaseLoggingService.info('this.updateFields: ', {
      path: `${collectionName}/${docId}`,
      object,
    });
    const self = this;
    return await FirestoreDaoService.database
      .collection(collectionName)
      .doc(docId)
      .update(this.clearUndefinedFields(this.childToObject(object)))
      .then((writeResult) => writeResult)
      .catch((error) => {
        if (error.code === 5) {
          // update doesn't allow write on null document
          return self.update(collectionName, docId, object);
        }
        throw error;
      });
  }

  /**
   * @param  {DocumentReference} ref
   * @param  {any} object
   * @return {Promise<any>}
   */
  public async updateRefFields(
    ref: DocumentReference,
    object: any,
  ): Promise<any> {
    this.firebaseLoggingService.info('this.updateRefFields: ', {
      path: `${this.generalHelperService.segmentsToPath(
        ref['_path'] ? ref['_path'].segments : [],
      )}`,
      object,
    });
    const clearedObject = this.clearUndefinedFields(this.childToObject(object));
    return await ref
      .update(clearedObject)
      .then((writeResult) => writeResult)
      .catch((error) => {
        if (error.code === 5) {
          // update doesn't allow write on null document
          return ref.set(clearedObject);
        }
        throw error;
      });
  }

  /**
   * @param  {DocumentReference} ref
   * @param  {any} object
   * @return {Promise<any>}
   */
  public async updateRef(ref: DocumentReference, object: any): Promise<any> {
    this.firebaseLoggingService.info('this.updateRef: ', {
      path: `${this.generalHelperService.segmentsToPath(
        ref['_path'] ? ref['_path'].segments : [],
      )}`,
      object,
    });
    const clearedObject = this.clearUndefinedFields(this.childToObject(object));
    return await ref.set(clearedObject).then((writeResult) => writeResult);
  }
  /**
   * @param  {string} collectionName
   * @return {Promise<any>}
   */
  public async readCollection(collectionName: string): Promise<any> {
    return await FirestoreDaoService.database
      .collection(collectionName)
      .get()
      .then((snapshot) =>
        !snapshot.empty
          ? this.generalHelperService.docsToObjects(snapshot.docs)
          : null,
      );
  }

  /**
   * @param  {string} collectionName
   * @return {any}
   */
  public getRef(collectionName: string) {
    return FirestoreDaoService.database.collection(collectionName);
  }

  /**
   * @param  {any} object
   * @return {Promise<any>}
   */
  private childToObject(object: any) {
    if (!object.children) {
      return object;
    }
    return Object.assign(object, {
      children: this.generalHelperService.arrayToObject(object.children),
    });
  }

  /**
   * @param  {string} collectionName
   * @param  {string} docId
   * @return {Promise<any>}
   */
  public remove(collectionName: string, docId: string): Promise<any> {
    this.firebaseLoggingService.info('this.remove: ', {
      path: `${collectionName}/${docId}`,
    });
    return FirestoreDaoService.database
      .collection(collectionName)
      .doc(docId)
      .delete();
  }

  /**
   * @return {admin.firestore.Firestore}
   */
  public getDatabase(): admin.firestore.Firestore {
    return FirestoreDaoService.database;
  }

  /**
   * @return {admin.firestore.Firestore} firestore
   */
  public getDatabase(): admin.firestore.Firestore {
    if (!FirestoreInitializer.dbInstance) {
      const initedTestApp = testApp.getTestFirebaseTestApp();
      if (initedTestApp) {
        FirestoreInitializer.dbInstance = initedTestApp.firestore();
      } else {
        FirestoreInitializer.dbInstance = admin.firestore();
        FirestoreInitializer.dbInstance.settings({
          timestampsInSnapshots: true,
        });
      }
    }

    return FirestoreInitializer.dbInstance;
  }

  /**
   * @param  {any} object
   * @return {any}
   */
  private clearUndefinedFields(object: any) {
    return JSON.parse(JSON.stringify(object));
  }
}
