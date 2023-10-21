import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { S3Service } from './s3/s3.service';

@Injectable()
export class MediaService {
    constructor(readonly s3Service: S3Service) {}

    public async getUrlForUploadReportImg(
        ext: string, numberOfLinks: number
    ) {
        const links = []
        for(let i = 0; i < numberOfLinks; i++) {
            const filename = `${uuidv4()}.${ext}`;
            const urlToUpload = await this.s3Service.getUrlForUpload(`reports/${filename}`);
            const urlToDownload = this.s3Service.getUrlForDownload(`reports/${filename}`);
            links.push({urlToDownload, urlToUpload});
        }
        return links;
    }
}
