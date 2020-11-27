import { IsString, MaxLength, MinLength } from 'class-validator';

export class SearchAddressDTO {
  @MinLength(4, {
    message: 'Address should have at least 4 characters!',
  })
  @MaxLength(50, {
    message: 'Address maximal length is 50 characters!',
  })
  @IsString()
  searchAddress: string;
}
