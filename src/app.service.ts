import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerMessage(): string {
    return 'Server is Up!';
  }
}
