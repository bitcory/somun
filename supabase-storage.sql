-- =============================================
-- Supabase Storage 버킷 설정
-- =============================================

-- 1. images 버킷 생성 (public으로 설정)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,  -- 5MB 제한
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- 2. 누구나 이미지를 볼 수 있도록 SELECT 정책
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 3. 누구나 이미지를 업로드할 수 있도록 INSERT 정책
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- 4. 누구나 이미지를 삭제할 수 있도록 DELETE 정책 (글 삭제 시 필요)
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
