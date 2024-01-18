import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

@Injectable()
export class ManualHealthIndicator extends HealthIndicator {
  private isHealthy = true;

  toggleHealth() {
    this.isHealthy = !this.isHealthy;
  }

  async isHealthyCheck(key: string): Promise<HealthIndicatorResult> {
    const result = this.getStatus(key, this.isHealthy);

    if (this.isHealthy) {
      return result;
    }
    throw new HealthCheckError('ManualHealthCheck failed', result);
  }
}
