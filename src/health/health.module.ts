import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ManualHealthIndicator } from './manual.health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [ManualHealthIndicator],
})
export class HealthModule {}
