import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export class AddUserLocationDto {
  @ApiProperty({
    type: String,
    description: 'Latitude',
    default: 44.152264,
  })
  @IsLatitude({ message: 'lat must be a latitude string or number' })
  lat: string;

  @ApiProperty({
    type: String,
    description: 'Longitude',
    default: 40.152346,
  })
  @IsLongitude({ message: 'lng must be a longitude string or number' })
  lng: string;
}
