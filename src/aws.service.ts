import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';
import * as Rekognition from 'aws-sdk/clients/rekognition';
import * as sharp from 'sharp';

@Injectable()
export class AWSService {
  s3: S3;
  rekognition: Rekognition;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });

    this.rekognition = new Rekognition({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
      apiVersion: '2016-06-27',
    });
  }

  public async uploadFile(image: any, username: string, path?: string) {
    let buffer = Buffer.from(image.buffer);
    const mimetype: any = image.mimetype ? image.mimetype.split('/')[1] : 'jpg';
    if (mimetype === 'jpg' || mimetype === 'jpeg') {
      buffer = await this.scaleImage(buffer, 70);
    }
    try {
      return await this.s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: buffer,
          Key: `${path && path}${username}-${Date.now()}.${mimetype}`,
          ACL: process.env.AWS_FILE_PERMISSION,
        })
        .promise();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  public async deleteFile(key: string) {
    return await this.s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }

  public async checkNudity(key: string): Promise<boolean> {
    let result = false;
    const detect = await this.rekognition
      .detectModerationLabels({
        Image: {
          S3Object: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Name: key,
          },
        },
        MinConfidence: 60,
      })
      .promise();

    if (detect.ModerationLabels.length > 0) {
      detect.ModerationLabels.map((ob) => {
        // 1
        if (
          (ob.Name === 'Explicit Nudity' && ob.Confidence > 90) ||
          (ob.ParentName === 'Explicit Nudity' && ob.Confidence > 90)
        ) {
          result = true;
        }

        // 2
        if (
          ob.ParentName === 'Explicit Nudity' &&
          ob.Name === 'Nudity' &&
          ob.Confidence > 90
        )
          result = true;

        // 3
        if (
          ob.ParentName === 'Explicit Nudity' &&
          ob.Name === 'Sexual Activity' &&
          ob.Confidence > 90
        )
          result = true;

        // 4
        if (
          ob.ParentName === 'Explicit Nudity' &&
          ob.Name === 'Graphic Male Nudity' &&
          ob.Confidence > 90
        )
          result = true;

        // 5
        if (
          ob.ParentName === 'Explicit Nudity' &&
          ob.Name === 'Graphic Female Nudity' &&
          ob.Confidence > 90
        )
          result = true;
      });
    } else result = false;

    return result;
  }

  public async deleteChat(chatId: number) {
    this.s3.listObjectsV2(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `chat/${chatId}`,
      },
      (err, data) => {
        if (err) console.log(err.message);
        if (data.Contents) {
          data.Contents.forEach((item) => {
            this.s3.deleteObject(
              {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: item.Key,
              },
              (err) => {
                if (err) console.log(err.message);
                console.log('Deleted:', item.Key);
              },
            );
          });
        }
      },
    );
  }

  public async sendFileMessage(type: string, file: any, path?: string) {
    let buffer = Buffer.from(file, 'base64');
    let mimetype: any;
    switch (type) {
      case 'image':
        mimetype = 'jpg';
        break;
      case 'video':
        mimetype = 'mp4';
        break;
      case 'audio':
        mimetype = 'm4a';
        break;
      default:
        mimetype = type;
    }
    try {
      if (mimetype === 'jpg' || mimetype === 'jpeg') {
        buffer = await this.scaleImage(buffer, 70);
      }

      return await this.s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: buffer,
          Key: `${
            path ? `${path}/` : 'chat/'
          }message-${Date.now()}.${mimetype}`,
          ACL: process.env.AWS_FILE_PERMISSION,
        })
        .promise();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  private async scaleImage(buffer: Buffer, quality: number) {
    return await sharp(buffer)
      .resize(500, 500, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
      })
      .toBuffer()
      .then(async (buffer: Buffer) => buffer)
      .catch((err: any) => {
        throw new InternalServerErrorException(err.message);
      });
  }
}
