import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CitiesRepository } from './repository/cities.repository';
import { CitiesResponse } from 'src/swagger.response';
import { SearchCityDto } from './dto/searchCity.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CitiesRepository)
    private citiesRepository: CitiesRepository,
  ) {}

  // async addCities() {
  //   await async.map(cities, (c) => {
  //     this.citiesRepository
  //       .createQueryBuilder('a_cities')
  //       .insert()
  //       .into(Cities)
  //       .values([
  //         {
  //           country: c.country,
  //           name: c.name,
  //           lat: c.lat,
  //           lng: c.lng,
  //         },
  //       ])
  //       .execute();
  //   });
  //   return 'success';
  // }

  async searchCities(body: SearchCityDto): Promise<CitiesResponse[]> {
    const cities = await this.citiesRepository
      .createQueryBuilder('a_cities')
      .where('LOWER(a_cities.name) LIKE LOWER(:input)', {
        input: `${body.input}%`,
      })
      .take(30)
      .getMany();

    return cities;
  }
}
