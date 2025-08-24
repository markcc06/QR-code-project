import { BrowserQRCodeReader } from '@zxing/browser';
import jsQR from 'jsqr';

/**
 * Decode a File (image) and return the decoded text or null.
 */
export async function decodeImageFile(file: File): Promise<string | null> {
  // 读取为 data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error('Failed to read image file'));
    fr.readAsDataURL(file);
  });

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      // 在 canvas 上绘制并提取像素
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 方案 A：先用 jsQR（轻量且常用）
      try {
        const qr = jsQR(imageData.data, imageData.width, imageData.height);
        if (qr && qr.data) return resolve(qr.data);
      } catch (e) {
        // 忽略，继续后备方案
      }

      // 方案 B：用 ZXing 作为回退（对某些情况更鲁棒）
      try {
        const reader = new BrowserQRCodeReader();
        const result = await reader.decodeFromImageElement(img);
        if (result && typeof result.getText === 'function') {
          return resolve(result.getText());
        }
      } catch (e) {
        // 忽略错误，最后返回 null
      }

      resolve(null);
    };

    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}