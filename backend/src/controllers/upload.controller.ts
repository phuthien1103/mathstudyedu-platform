import { Request, Response } from 'express';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn một file hình ảnh' });
      }

      // Đường dẫn tĩnh truy cập file công khai
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      return res.status(201).json({
        message: 'Tải file lên thành công',
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      });
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}
