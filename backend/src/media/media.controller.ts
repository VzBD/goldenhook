import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

// Минимальный тип загруженного файла, чтобы не тянуть типы Express/Multer
type UploadedFileType = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadedFileType, @Body('key') key: string) {
    const url = await this.mediaService.uploadFile(
      key || file.originalname,
      file.buffer,
      file.mimetype,
    );
    return { url };
  }
}
