import { SearchAddressDTO } from '@dto/search-address-input.dto';
import { UrbanCoverageService } from './urban-coverage.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('urban-coverage')
export class UrbanCoverageController {
  constructor(private readonly urbanCoverageService: UrbanCoverageService) {}

  @Post('/search-address')
  async searchAddress(
    @Body(ValidationPipe) userInput: SearchAddressDTO,
  ): Promise<any> {
    return await this.urbanCoverageService.searchAddress(userInput);
  }
}
