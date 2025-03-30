-- 出力をoutput.txtにリダイレクト開始
\o output.txt

-- 各テーブルの名前とデータを順に出力
SELECT 'Table: activity_logs';
SELECT * FROM activity_logs;

SELECT 'Table: application_settings';
SELECT * FROM application_settings;

SELECT 'Table: bookings';
SELECT * FROM bookings;

SELECT 'Table: error_logs';
SELECT * FROM error_logs;

SELECT 'Table: event_media';
SELECT * FROM event_media;

SELECT 'Table: events';
SELECT * FROM events;

SELECT 'Table: likes';
SELECT * FROM likes;

SELECT 'Table: local_experience_categories';
SELECT * FROM local_experience_categories;

SELECT 'Table: local_experience_media';
SELECT * FROM local_experience_media;

SELECT 'Table: local_experiences';
SELECT * FROM local_experiences;

SELECT 'Table: matches';
SELECT * FROM matches;

SELECT 'Table: media';
SELECT * FROM media;

SELECT 'Table: notifications';
SELECT * FROM notifications;

SELECT 'Table: posts';
SELECT * FROM posts;

SELECT 'Table: realtime_messages';
SELECT * FROM realtime_messages;

SELECT 'Table: regions';
SELECT * FROM regions;

SELECT 'Table: reviews';
SELECT * FROM reviews;

SELECT 'Table: service_categories';
SELECT * FROM service_categories;

SELECT 'Table: service_media';
SELECT * FROM service_media;

SELECT 'Table: storage_buckets';
SELECT * FROM storage_buckets;

SELECT 'Table: storage_objects';
SELECT * FROM storage_objects;

SELECT 'Table: therapist_availability';
SELECT * FROM therapist_availability;

SELECT 'Table: therapist_profiles';
SELECT * FROM therapist_profiles;

SELECT 'Table: therapist_services';
SELECT * FROM therapist_services;

SELECT 'Table: tourist_profiles';
SELECT * FROM tourist_profiles;

SELECT 'Table: transactions';
SELECT * FROM transactions;

SELECT 'Table: unavailable_dates';
SELECT * FROM unavailable_dates;

SELECT 'Table: user_preferences';
SELECT * FROM user_preferences;

SELECT 'Table: users';
SELECT * FROM users;

-- 出力を終了
\o