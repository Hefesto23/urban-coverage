import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // Just return message that states server is up.
  @Get()
  getServerMessage(): string {
    return this.appService.getServerMessage();
  }
}
