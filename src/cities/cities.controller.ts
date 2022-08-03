import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/auth/http-exception.filter';
import { CitiesService } from './cities.service';
import { CitiesResponse } from '../swagger.response';
import { SearchCityDto } from './dto/searchCity.dto';

@Controller('cities')
@ApiTags('Cities')
@ApiBearerAuth()
@UseFilters(new HttpExceptionFilter())
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  // @Post()
  // async addCities() {
  //   return this.citiesService.addCities();
  // }

  @Post('search')
  @ApiCreatedResponse({ type: [CitiesResponse] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async searchCities(@Body() body: SearchCityDto): Promise<CitiesResponse[]> {
    return this.citiesService.searchCities(body);
  }
}
