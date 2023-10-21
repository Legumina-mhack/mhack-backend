import { Body, Controller, Param, Post } from "@nestjs/common";
import { MediaService } from "./media.service";

@Controller('media')
export class MediaController {
    constructor(private readonly service: MediaService) {}

    @Post('report/upload/:num')
    public async uploadReportImg(@Param() {num}: any) {
        return this.service.getUrlForUploadReportImg('jpg', num);
    }
}