import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Render,
  UseFilters,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from './auth/http-exception.filter';
import axios from 'axios';
import * as config from 'config';
import { ShareService } from './share.service';

@ApiTags('Share')
@Controller()
@UseFilters(new HttpExceptionFilter())
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get('profile/share')
  @Render('profile')
  async shareUserProfile(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/sharedUser/${id}`,
      );

      return {
        user: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/profile/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('relationship/share')
  @Render('relationship')
  async shareRelationshipReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getRelationshipReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/relationship/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('birthday/share')
  @Render('birthday')
  async shareBirthdayReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getBirthdayReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/birthday/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.day_report.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('day/share')
  @Render('day')
  async shareDayReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getDayReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/day/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('month/share')
  @Render('month')
  async shareMonthReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getMonthReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/month/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('path/share')
  @Render('path')
  async sharePathReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getPathReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/path/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('season/share')
  @Render('season')
  async shareSeasonReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getSeasonReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/season/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('way/share')
  @Render('way')
  async shareWayReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getWayReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/way/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('week/share')
  @Render('week')
  async shareWeekReport(@Query('id') id: number) {
    if (id) {
      const url = config.get('url').base;
      const r = await axios.get(
        `${
          url ? url : 'https://secretlanguage.network/v1/'
        }user/getWeekReport/${id}`,
      );

      return {
        report: r.data,
        shareId: Number(id),
        sharedUrl: `https://secretlanguage.network/v1/week/share?id=${id}`,
        metaTitle: 'Secret Language Network',
        metaDescription: `Connect with people on Romance, Friendship, Business and even Finding Yourself with the Secret Language ✨ of Birthday’s & Relationships!`,
        imageUrl: r.data.image,
        icon: 'https://sln-storage.s3.us-east-2.amazonaws.com/icons/icon-1.svg',
      };
    } else
      throw new NotFoundException({
        statusCode: 404,
        message: ['Not found'],
      });
  }

  @Get('day/sitemap')
  async getDaySitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getDaySitemap();
    res.send(xml);
  }

  @Get('month/sitemap')
  async getMonthSitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getMonthSitemap();
    res.send(xml);
  }

  @Get('path/sitemap')
  async getPathSitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getPathSitemap();
    res.send(xml);
  }

  @Get('season/sitemap')
  async getSeasonSitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getSeasonSitemap();
    res.send(xml);
  }

  @Get('way/sitemap')
  async getWaySitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getWaySitemap();
    res.send(xml);
  }

  @Get('week/sitemap')
  async getWeekSitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.shareService.getWeekSitemap();
    res.send(xml);
  }
}
