import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  info(): string {
    return 'CinePik auth v' + process.env.npm_package_version;
  }
}
