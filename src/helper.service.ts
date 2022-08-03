import { Injectable } from '@nestjs/common';
import { User } from './auth/entity/user.entity';
import * as moment from 'moment';
import * as NodeGeocoder from 'node-geocoder';
import * as geolib from 'geolib';

@Injectable()
export class HelperService {
  public clearText(text: string) {
    return (text = text.replace(/\\r/g, '\r').replace(/\\n/g, '\n'));
  }

  public async getCity(lon: number, lat: number) {
    const options = {
      provider: 'google',
      apiKey: process.env.GOOGLE_API_KEY,
    };

    const geocoder = NodeGeocoder(options);

    const res = await geocoder.reverse({ lat: lat, lon: lon });

    return res;
  }

  public getDistance(user: User, u: any) {
    const location: any = u && typeof u.location === 'object' ? u.location : [];
    const userLocation: any =
      user && typeof user.location === 'object' ? user.location : [];

    const { getDistance } = geolib;
    let r = getDistance(
      {
        latitude: location.coordinates[0],
        longitude: location.coordinates[1],
      },
      {
        latitude: userLocation.coordinates[0],
        longitude: userLocation.coordinates[1],
      },
    );

    r = Number((r / 1000).toFixed(0));

    return Math.round(r) <= 1
      ? `less than a mile away`
      : `${u.city ? u.city : u.country_name}, ${(r * 0.621371192).toFixed(
          0,
        )}.0 miles away`;
  }

  public changeTimeFormat(time: string): string {
    time = moment(time).fromNow();

    if (time === 'a few seconds ago') {
      return 'just now';
    } else if (time.endsWith(' seconds ago')) {
      return time.replace(' seconds ago', 's');
    } else if (time === 'a minute ago') {
      return '1 min';
    } else if (time.endsWith(' minutes ago')) {
      return time.replace(' minutes ago', ' min');
    } else if (time === 'an hour ago') {
      return '1h';
    } else if (time.endsWith(' hours ago')) {
      return time.replace(' hours ago', 'h');
    } else if (time === 'a day ago') {
      return '1d';
    } else if (time.endsWith(' days ago')) {
      return time.replace(' days ago', 'd');
    } else if (time === 'a month ago') {
      return '1m';
    } else if (time.endsWith(' months ago')) {
      return time.replace(' months ago', '');
    } else if (time === 'a year ago') {
      return '1y';
    } else if (time.endsWith(' years ago')) {
      return time.replace(' years ago', 'y');
    } else {
      return moment(time).fromNow();
    }
  }

  public paginate(arr, page: number, limit: number) {
    page = Number(page);
    limit = Number(limit);

    return arr.slice((page - 1) * limit, page * limit);
  }
}
