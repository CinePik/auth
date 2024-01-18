import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Unprotected } from 'nest-keycloak-connect';
import { ManualHealthIndicator } from './manual.health';

@Controller('health')
@ApiTags('health')
@Unprotected()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private manualHealthIndicator: ManualHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      () => this.manualHealthIndicator.isHealthyCheck('manual'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () =>
        this.http.pingCheck('keycloak', 'http://cinepik-keycloak:8080/health'),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }), // if more than 90% of disk space is used
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024), // if more than 256MiB
      () => this.manualHealthIndicator.isHealthyCheck('manual'),
    ]);
  }

  @Post('toggle')
  @HttpCode(HttpStatus.NO_CONTENT)
  toggleHealth() {
    this.manualHealthIndicator.toggleHealth();
  }
}
