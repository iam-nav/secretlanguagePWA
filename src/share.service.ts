import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitemapStream, streamToPromise } from 'sitemap';
import { DayRepository } from './day/repository/day.repository';
import { MonthRepository } from './month/repository/month.repository';
import { PathRepository } from './path/repository/path.repository';
import { SeasonRepository } from './season/repository/season.repository';
import { WayRepository } from './way/repository/way.repository';
import { WeekRepository } from './week/repository/week.repository';
import * as moment from 'moment';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(DayRepository)
    private dayRepository: DayRepository,
    @InjectRepository(MonthRepository)
    private monthRepository: MonthRepository,
    @InjectRepository(PathRepository)
    private pathRepository: PathRepository,
    @InjectRepository(SeasonRepository)
    private seasonRepository: SeasonRepository,
    @InjectRepository(WayRepository)
    private wayRepository: WayRepository,
    @InjectRepository(WeekRepository)
    private weekRepository: WeekRepository,
  ) {}

  async getDaySitemap() {
    const take = 50;
    const daysCount = await this.dayRepository
      .createQueryBuilder('c_day')
      .getCount();

    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    for (let i = 1; i <= Math.ceil(daysCount / take); i++) {
      const days = await this.dayRepository
        .createQueryBuilder('c_day')
        .skip(take * (Number(i) - 1))
        .take(take)
        .getMany();

      days.map((d) => {
        smStream.write({
          url: `/v1/day/share?id=${d.id}`,
          changefreq: 'monthly',
          priority: 1,
          img: d.image,
          links: [
            {
              lang: 'en',
              url: `https://secretlanguage.network/v1/day/share?id=${d.id}`,
            },
          ],
          news: {
            publication: {
              name: d.day_name,
              language: 'en',
            },
            genres: 'Blog',
            publication_date: moment(new Date()).format('YYYY-MM-DD'),
            title: d.day_name,
            keywords:
              'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
          },
        });
      });
    }
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async getMonthSitemap() {
    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    const months = await this.monthRepository
      .createQueryBuilder('c_month')
      .getMany();

    months.map((m) => {
      smStream.write({
        url: `/v1/month/share?id=${m.id}`,
        changefreq: 'monthly',
        priority: 1,
        img: m.image,
        links: [
          {
            lang: 'en',
            url: `https://secretlanguage.network/v1/month/share?id=${m.id}`,
          },
        ],
        news: {
          publication: {
            name: m.name,
            language: 'en',
          },
          genres: 'Blog',
          publication_date: moment(new Date()).format('YYYY-MM-DD'),
          title: m.name,
          keywords:
            'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
        },
      });
    });
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async getPathSitemap() {
    const take = 50;
    const pathsCount = await this.pathRepository
      .createQueryBuilder('c_path')
      .getCount();

    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    for (let i = 1; i <= Math.ceil(pathsCount / take); i++) {
      const paths = await this.pathRepository
        .createQueryBuilder('c_path')
        .skip(take * (Number(i) - 1))
        .take(take)
        .leftJoinAndSelect('c_path.week_id', 'week_id')
        .getMany();

      paths.map((p) => {
        smStream.write({
          url: `/v1/path/share?id=${p.id}`,
          changefreq: 'monthly',
          priority: 1,
          img: p.image,
          links: [
            {
              lang: 'en',
              url: `https://secretlanguage.network/v1/path/share?id=${p.id}`,
            },
          ],
          news: {
            publication: {
              name: p.week_id.name_long,
              language: 'en',
            },
            genres: 'Blog',
            publication_date: moment(new Date()).format('YYYY-MM-DD'),
            title: p.week_id.name_long,
            keywords:
              'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
          },
        });
      });
    }
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async getSeasonSitemap() {
    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    const seasons = await this.seasonRepository
      .createQueryBuilder('c_season')
      .getMany();

    seasons.map((s) => {
      smStream.write({
        url: `/v1/season/share?id=${s.id}`,
        changefreq: 'monthly',
        priority: 1,
        img: s.image,
        links: [
          {
            lang: 'en',
            url: `https://secretlanguage.network/v1/season/share?id=${s.id}`,
          },
        ],
        news: {
          publication: {
            name: s.name,
            language: 'en',
          },
          genres: 'Blog',
          publication_date: moment(new Date()).format('YYYY-MM-DD'),
          title: s.name,
          keywords:
            'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
        },
      });
    });
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async getWaySitemap() {
    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    const ways = await this.wayRepository.createQueryBuilder('c_way').getMany();

    ways.map((w) => {
      smStream.write({
        url: `/v1/way/share?id=${w.id}`,
        changefreq: 'monthly',
        priority: 1,
        img: w.image,
        links: [
          {
            lang: 'en',
            url: `https://secretlanguage.network/v1/way/share?id=${w.id}`,
          },
        ],
        news: {
          publication: {
            name: w.name,
            language: 'en',
          },
          genres: 'Blog',
          publication_date: moment(new Date()).format('YYYY-MM-DD'),
          title: w.name,
          keywords:
            'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
        },
      });
    });
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async getWeekSitemap() {
    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    const weeks = await this.weekRepository
      .createQueryBuilder('c_week')
      .getMany();

    weeks.map((w) => {
      smStream.write({
        url: `/v1/week/share?id=${w.id}`,
        changefreq: 'monthly',
        priority: 1,
        img: w.image,
        links: [
          {
            lang: 'en',
            url: `https://secretlanguage.network/v1/week/share?id=${w.id}`,
          },
        ],
        news: {
          publication: {
            name: w.name_long,
            language: 'en',
          },
          genres: 'Blog',
          publication_date: moment(new Date()).format('YYYY-MM-DD'),
          title: w.name_long,
          keywords:
            'secret language network, relationships, online chat, horoscope, social networking service, dating, online dating service, social network, business, romance, books, astrology or friendship',
        },
      });
    });
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }
}
