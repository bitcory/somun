import { supabase } from './supabase';

// 이미지 최적화 설정
const MAX_WIDTH = 1200;  // 최대 너비
const MAX_HEIGHT = 1200; // 최대 높이
const QUALITY = 0.8;     // JPEG 품질 (0.0 ~ 1.0)

/**
 * 이미지 파일을 최적화하여 압축
 */
export const optimizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // 비율 유지하면서 크기 조정
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = (width * MAX_HEIGHT) / height;
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // WebP 또는 JPEG로 변환 (WebP 우선)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        'image/webp',
        QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    // 파일을 Data URL로 읽기
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지를 Supabase Storage에 업로드
 */
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    // 이미지 최적화
    const optimizedBlob = await optimizeImage(file);

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}_${randomId}.webp`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, optimizedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1년 캐시
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Public URL 반환
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image optimization/upload error:', error);
    return null;
  }
};

/**
 * 여러 이미지를 한 번에 업로드
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};

/**
 * Storage에서 이미지 삭제
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // URL에서 파일명 추출
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('images')
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Image delete error:', error);
    return false;
  }
};
