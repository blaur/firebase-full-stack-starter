import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PubsubHandler } from './handlers/pubsub.handler';
import { FirebaseLoggingService } from './services/firebase-logging.service';
import { PubsubService } from './services/pubsub.service';
import { SharedService } from './services/shared.service';

@Module({
  providers: [
    SharedService,
    PubsubService,
    PubsubHandler,
    FirebaseLoggingService,
  ],
  imports: [DiscoveryModule],
  exports: [
    SharedService,
    PubsubService,
    PubsubHandler,
    FirebaseLoggingService,
  ],
})
export class SharedModule {}
