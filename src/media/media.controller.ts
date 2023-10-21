import { Controller, Post } from "@nestjs/common";
import { MediaService } from "./media.service";

@Controller('media')
export class MediaController {
    constructor(private readonly service: MediaService) {}

    @Post('report/upload')
    public async uploadReportImg(): Promise<{ urlToDownload: string; urlToUpload: string }> {
        return this.service.getUrlForUploadReportImg('jpg');
    }
}