import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PubsubHandler } from './handlers/pubsub.handler';
import { FirebaseLoggingService } from './services/firebase-logging.service';
import { PubsubEventsService } from './services/pubsub-events.service';
import { SharedService } from './services/shared.service';

@Module({
  providers: [
    SharedService,
    PubsubEventsService,
    PubsubHandler,
    FirebaseLoggingService,
  ],
  imports: [DiscoveryModule],
  exports: [
    SharedService,
    PubsubEventsService,
    PubsubHandler,
    FirebaseLoggingService,
  ],
})
export class SharedModule {}
