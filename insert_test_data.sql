-- Insert test videos
INSERT INTO public.videos (title, description, thumbnail_url, video_url, view_count, duration, visibility, allowed_tags)
VALUES
  ('Loomプラットフォーム完全ガイド', 'Loomの使い方を徹底解説します', 'https://placehold.co/640x360/6B8CAE/white?text=Video+1', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1234, 600, 'PUBLIC', ARRAY['副業', '人材']),
  ('マーケティング自動化の基礎', '効率的なマーケティング戦略を学びます', 'https://placehold.co/640x360/8FA88E/white?text=Video+2', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 856, 450, 'PUBLIC', ARRAY['マーケティング']),
  ('LINE配信の最適化テクニック', '開封率を上げるためのノウハウ', 'https://placehold.co/640x360/D4A574/white?text=Video+3', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 542, 720, 'UNLISTED', ARRAY['LINE', 'マーケティング']),
  ('データ分析で成果を最大化', 'KPIの見方と改善方法', 'https://placehold.co/640x360/B87C7C/white?text=Video+4', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 321, 540, 'PUBLIC', ARRAY['分析']);
