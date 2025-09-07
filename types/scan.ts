// /types/scan.ts
export type Mode = 'camera' | 'upload';

// 统一的回调签名（向下兼容 onDecoded）
export interface DecodeCallbacks {
  /** 推荐：解码成功回调（新） */
  action?: (text: string) => void;
  /** 兼容：解码成功回调（旧名） */
  onDecoded?: (text: string) => void;
  /** 解码失败回调 */
  onError?: (msg: string) => void;
}

// 移动端 Camera props
export interface CameraScannerMobileProps extends DecodeCallbacks {
  className?: string;
  /** 是否偏好后置摄像头 */
  preferBackCamera?: boolean;
  /** 外部启停（默认 true） */
  isActive?: boolean;
  /** 初次渲染是否自动启动（默认 true） */
  autoStart?: boolean;
}

// 移动端 Upload props
export interface ImageScannerMobileProps extends DecodeCallbacks {
  className?: string;
  /** input accept（默认 'image/*'） */
  accept?: string;
}