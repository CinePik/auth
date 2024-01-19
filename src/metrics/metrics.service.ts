import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
  register,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly totalRequestCounter: Counter;
  private readonly totalFailedRequestCounter: Counter;
  public readonly apiResponseTimeHistogram: Histogram<string>;

  public get metrics(): Promise<string> {
    return this.registry.metrics();
  }

  constructor() {
    // Clear to avoid "Cannot register the same metric twice" errors
    register.clear();
    this.registry = new Registry();

    // Leave metric names generic so they can be easily collected across services and then filtered by app name
    this.registry.setDefaultLabels({
      app: 'cinepik_auth',
    });

    collectDefaultMetrics({
      register: this.registry,
    });

    this.totalRequestCounter = new Counter({
      name: 'requests_total',
      help: 'Total number of requests to the NestJS auth microservice',
    });

    this.totalFailedRequestCounter = new Counter({
      name: 'failed_requests_total',
      help: 'Total number of failed requests to the NestJS auth microservice',
    });

    this.apiResponseTimeHistogram = new Histogram({
      name: 'api_response_time_seconds',
      help: 'Histogram for tracking the response times of API calls',
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });

    this.registry.registerMetric(this.totalRequestCounter);
    this.registry.registerMetric(this.totalFailedRequestCounter);
    this.registry.registerMetric(this.apiResponseTimeHistogram);
  }

  incrementRequestCounter() {
    this.totalRequestCounter.inc();
  }

  incrementFailedRequestCounter() {
    this.totalFailedRequestCounter.inc();
  }

  /**
   * Handle the request by performing the main action and gathering metrics.
   * Increment appropriate counters and record the response time to the histogram.
   * @param action - The action to be performed
   * @returns
   */
  async handleRequest<T>(action: () => Promise<T>): Promise<T> {
    const end = this.apiResponseTimeHistogram.startTimer();
    try {
      this.incrementRequestCounter();
      return await action();
    } catch (error) {
      this.incrementFailedRequestCounter();
      throw error;
    } finally {
      end();
    }
  }
}
