# <img src="https://img.shields.io/badge/Sppa-Connect%20Bali%20Therapists%20with%20the%20World-ed7342?style=for-the-badge" alt="Sppa Banner" />

```ascii
____                       
/ ___|  _ __  _ __   __ _ 
\___ \ | '_ \| '_ \ / _` |
___) || |_) | |_) | (_| |
|____/ | .__/| .__/ \__,_|
      |_|   |_|

バリ島の熟練セラピストと世界の観光客をリアルタイム・多言語でつなぐSNS
共同開発・コミュニティ運営を通じて最高の体験を実現する


目次

Sppaとは？

プロジェクトのコンセプト

開発コミュニティの特徴

オープンなコミュニケーション環境

自主性を尊重した開発環境

ストックオプション付与の詳細条件

技術スタック & 特徴

アーキテクチャイメージ

今後の展望

参加方法・お問い合わせ

未来を切り拓く仲間を募集

Sppaとは？
Sppa（スパ）は、インドネシア・バリ島を拠点とするセラピストと、
オーストラリア・ドイツ・フランス・韓国・日本・中国をはじめとする世界中の観光客とを
リアルタイムかつ多言語でつなぐSNSプラットフォームです。

言葉の壁を乗り越える翻訳機能

予約をスムーズに管理する即時予約システム

SNSフィードでのコンテンツ発信

など、旅行者とローカルのセラピスト双方にとって新たな価値を提供することを目指しています。

プロジェクトのコンセプト
Sppaの中核機能は以下の通りです。

リアルタイムチャット:
世界中のユーザーとバリ島のセラピストが、即座にコミュニケーションできるチャット機能。

即時予約管理:
予約・空き状況がリアルタイムに共有されるため、ユーザーは最適な時間を即時に確保可能。

翻訳機能:
多言語対応の翻訳サービス（LibreTranslate）により、ユーザーとセラピストの言語の壁を解消。

SNSフィード:
写真や動画、体験レポートなどを気軽にシェアし、コミュニティ全体での盛り上がりを創出。

開発者全員が“創業メンバー” として、共にこのプラットフォームを育てていくことを目指します。

開発コミュニティの特徴
オープンなコミュニケーション環境
GitHub Discussions & Issues
設計議論や機能提案、バグ修正アイデアをIssueやPull Requestを通じて共有しながら、
透明性の高い開発プロセスを実現します。

リアルタイムチャット（Slack）
日々の雑談や緊急時の対応、ブレインストーミングはSlackでカバー。
Slack招待リンク に参加し、
#sppa チャネル（ID: C08L0QQ5Q7J）で積極的に交流しましょう！

CI/CDパイプラインの導入
GitHub Actionsを利用して自動テスト・デプロイを行うため、コードがマージされる前に品質チェックが可能。
スピーディかつ安全に開発を進められます。

自主性を尊重した開発環境
即時管理権限の付与
初回コミットの意思表示（PR提出など）が確認され次第、
リポジトリの管理権限(Admin相当) を付与。あなたのアイデアを即座に反映できる環境です。

創業メンバーとしての参加
将来のIPOに備え、貢献度に応じた最大5%のストックオプションが付与される仕組みを構築中。
あなたの努力と情熱が、ダイレクトにリターンとして返ってきます。

ストックオプション付与の詳細条件
以下のガイドラインを大まかに満たすメンバーには、最大5% のストックオプション（または株式）を付与予定です。

継続的な貢献:

少なくとも6ヶ月間、継続してコミットやIssue参加を行う。

主要機能への貢献:

リアルタイムチャット、予約管理、翻訳機能などの中核機能の開発を主導する。

積極的なコミュニケーション:

GitHubやSlackでのディスカッションに参加し、建設的な議論とレビューを行う。

プロダクトへの提案と実行:

新機能や改善点の提案から実装までを率先して行い、サービス品質を高める。

最終的な付与割合や条件は、個別面談での合意ベースとなります。

技術スタック & 特徴
項目	使用技術	特徴・メリット
フロントエンド	Next.js (App Router), TypeScript	SSR+CSRのハイブリッド構成で高速＆柔軟なレンダリングを実現
UIライブラリ	Shadcn/UI, Tailwind CSS	シンプルかつ美しいデザインを瞬時に開発。カスタマイズが容易でユーザーエクスペリエンスを向上
API・DB	Hasura + PostgreSQL (GraphQL)	スキーマ駆動設計とリアルタイムSubscriptionで、効率的なデータ操作と同期を実装
ファイル管理	Supabase Storage	大容量ファイルのホスティング＆CDN配信により、利用者へ高速にコンテンツ提供
リアルタイム通信	Hasura Subscriptions	専用WebSocketサーバー不要。GraphQLでリアルタイム更新をシームレスに実現
翻訳サービス	LibreTranslate	英語、インドネシア語、ドイツ語、フランス語、韓国語、日本語、中国語など、多彩な言語対応
ホスティング	Cloudflare Pages	グローバルCDNを活用し、世界中からのアクセスを高速かつ安定的にサポート
CI/CD & セキュリティ	GitHub Actions, Cloudflare WAF	自動テスト・自動デプロイ＋堅牢なWAFによるセキュリティ強化
アーキテクチャイメージ (Mermaid)
mermaid
コピーする
編集する
flowchart LR
    A(ユーザー) -- リアルタイムアクセス --> B[フロントエンド <br/> (Next.js)]
    B -- GraphQL --> C[Hasura + PostgreSQL]
    C -- Realtime Subscriptions --> B
    B -- ファイル操作 --> D[Supabase Storage]
    B -- 翻訳API --> E[LibreTranslate]
    B -- デプロイ --> F[Cloudflare Pages]
    F -- CDN --> A
リアルタイムなデータ同期や多言語翻訳機能をスムーズに実装するため、HasuraによるSubscriptionとLibreTranslateを組み合わせ、
さらにSupabase Storageを用いたファイルホスティングも活用する設計となっています。

今後の展望
グローバル展開:
バリ島から始まり、主要観光国（オーストラリア、ドイツ、フランス、韓国、日本、中国など）への展開を目指す。

多言語対応強化:
英語、インドネシア語、ドイツ語、フランス語、韓国語、日本語、中国語をメインとし、更なる言語にも対応予定。

ユーザー体験の向上:
リアルタイムフィードバックやSNS上の活発なコミュニケーションをベースに、機能追加・改善を続ける。

IPOを見据えた成長:
創業メンバーとしてのストックオプション付与により、メンバー全員のモチベーションと連動したスケーラブルな組織運営を構築。

参加方法・お問い合わせ
GitHubでコントリビュート

Issues や Discussions でアイデアを共有し、Pull Requestを送ってください。

初回コミットが確認された時点で、管理権限を付与 します。

Slackでのコミュニケーション

下記リンクからSlackワークスペースに参加し、#sppa チャネルで意見交換をどうぞ。

Slack招待リンク

その他のお問い合わせ

機能提案・バグ報告：GitHubのIssuesへ

参加希望やストックオプションに関する相談：tani.party@gmail.com

未来を切り拓く仲間を募集
Sppaは、あなたの技術力とアイデアで大きく進化します。
バリ島のセラピストと世界中の旅行者を、リアルタイムでつなぐプラットフォームを一緒に育てませんか？

やりたいことを自主的に始められるコミュニティ

サービス創造に直結するエンジニアリング

将来のIPOを見据えたストックオプション

あなたの一歩が新しい体験を世界に広げる鍵となります。
共に最高のサービスを創り上げましょう！

＿＿

## ディレクトリ構造

ディレクトリ構造が長いため、以下に折りたたみ可能な形で表示します。「クリックして展開」をクリックすると全体を確認できます。展開しても、以下の「技術スタック」や「セットアップ手順」などのコンテンツは表示されたままです。

<details>
<summary>クリックして展開</summary>

sppa/
├── %
├── Dockerfile
├── Sppa概要
├── api-template.hbs
├── config.yaml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── hasura/
│   ├── config.yaml
│   ├── metadata/
│   │   ├── actions.graphql
│   │   ├── actions.yaml
│   │   ├── allow_list.yaml
│   │   ├── api_limits.yaml
│   │   ├── backend_configs.yaml
│   │   ├── cron_triggers.yaml
│   │   ├── databases/
│   │   │   ├── databases.yaml
│   │   │   └── default/
│   │   │       └── tables/
│   │   │           ├── public_activity_logs.yaml
│   │   │           ├── public_application_settings.yaml
│   │   │           ├── public_bookings.yaml
│   │   │           ├── public_error_logs.yaml
│   │   │           ├── public_event_media.yaml
│   │   │           ├── public_events.yaml
│   │   │           ├── public_geography_columns.yaml
│   │   │           ├── public_geometry_columns.yaml
│   │   │           ├── public_likes.yaml
│   │   │           ├── public_local_experience_categories.yaml
│   │   │           ├── public_local_experience_media.yaml
│   │   │           ├── public_local_experiences.yaml
│   │   │           ├── public_matches.yaml
│   │   │           ├── public_media.yaml
│   │   │           ├── public_notifications.yaml
│   │   │           ├── public_posts.yaml
│   │   │           ├── public_realtime_messages.yaml
│   │   │           ├── public_regions.yaml
│   │   │           ├── public_reviews.yaml
│   │   │           ├── public_service_categories.yaml
│   │   │           ├── public_service_media.yaml
│   │   │           ├── public_spatial_ref_sys.yaml
│   │   │           ├── public_storage_buckets.yaml
│   │   │           ├── public_storage_objects.yaml
│   │   │           ├── public_therapist_availability.yaml
│   │   │           ├── public_therapist_profiles.yaml
│   │   │           ├── public_therapist_services.yaml
│   │   │           ├── public_tourist_profiles.yaml
│   │   │           ├── public_transactions.yaml
│   │   │           ├── public_unavailable_dates.yaml
│   │   │           ├── public_user_preferences.yaml
│   │   │           ├── public_users.yaml
│   │   │           └── tables.yaml
│   │   ├── graphql_schema_introspection.yaml
│   │   ├── inherited_roles.yaml
│   │   ├── metrics_config.yaml
│   │   ├── network.yaml
│   │   ├── opentelemetry.yaml
│   │   ├── permission.yaml
│   │   ├── query_collections.yaml
│   │   ├── remote_schemas.yaml
│   │   ├── rest_endpoints.yaml
│   │   └── version.yaml
│   ├── migrations/
│   │   └── default/
│   │       ├── 1742053444159_init/
│   │       │   └── up.sql
│   │       ├── 1742054367761_init/
│   │       │   └── up.sql
│   │       └── 20250226120000_create_tables.sql
│   ├── output.txt
│   ├── payload:{headers:Authorization:Bearer <your-token>}
│   ├── payload:{headers:Authorization:Bearer eyJhbGci...}
│   ├── payload:{headers:x-hasura-role:tourist}
│   ├── seeds/
│   │   └── default/
│   │       └── 1741574725086_initial_data.sql
│   └── type:connection_init
├── metadata/
│   ├── actions.graphql
│   ├── actions.yaml
│   ├── allow_list.yaml
│   ├── api_limits.yaml
│   ├── backend_configs.yaml
│   ├── cron_triggers.yaml
│   ├── databases/
│   │   ├── databases.yaml
│   │   ├── default/
│   │   │   └── tables/
│   │   │       ├── public_geography_columns.yaml
│   │   │       ├── public_geometry_columns.yaml
│   │   │       ├── public_spatial_ref_sys.yaml
│   │   │       └── tables.yaml
│   │   └── sppa/
│   │       └── tables/
│   │           ├── pgsodium_decrypted_key.yaml
│   │           ├── pgsodium_key.yaml
│   │           ├── pgsodium_mask_columns.yaml
│   │           ├── pgsodium_masking_rule.yaml
│   │           ├── pgsodium_valid_key.yaml
│   │           ├── public_activity_logs.yaml
│   │           ├── public_application_settings.yaml
│   │           ├── public_bookings.yaml
│   │           ├── public_error_logs.yaml
│   │           ├── public_event_media.yaml
│   │           ├── public_events.yaml
│   │           ├── public_likes.yaml
│   │           ├── public_local_experience_categories.yaml
│   │           ├── public_local_experience_media.yaml
│   │           ├── public_local_experiences.yaml
│   │           ├── public_matches.yaml
│   │           ├── public_media.yaml
│   │           ├── public_notifications.yaml
│   │           ├── public_posts.yaml
│   │           ├── public_regions.yaml
│   │           ├── public_reviews.yaml
│   │           ├── public_service_categories.yaml
│   │           ├── public_service_media.yaml
│   │           ├── public_therapist_availability.yaml
│   │           ├── public_therapist_profiles.yaml
│   │           ├── public_therapist_services.yaml
│   │           ├── public_tourist_profiles.yaml
│   │           ├── public_transactions.yaml
│   │           ├── public_unavailable_dates.yaml
│   │           ├── public_user_preferences.yaml
│   │           ├── public_users.yaml
│   │           ├── realtime_messages.yaml
│   │           ├── realtime_schema_migrations.yaml
│   │           ├── realtime_subscription.yaml
│   │           ├── storage_buckets.yaml
│   │           ├── storage_migrations.yaml
│   │           ├── storage_objects.yaml
│   │           ├── storage_s3_multipart_uploads.yaml
│   │           ├── storage_s3_multipart_uploads_parts.yaml
│   │           ├── supabase_migrations_schema_migrations.yaml
│   │           ├── supabase_migrations_seed_files.yaml
│   │           ├── tables.yaml
│   │           ├── vault_decrypted_secrets.yaml
│   │           └── vault_secrets.yaml
│   ├── graphql_schema_introspection.yaml
│   ├── inherited_roles.yaml
│   ├── metrics_config.yaml
│   ├── network.yaml
│   ├── opentelemetry.yaml
│   ├── query_collections.yaml
│   ├── remote_schemas.yaml
│   ├── rest_endpoints.yaml
│   └── version.yaml
├── metadata.json
├── middleware.ts
├── migration_log.txt
├── migrations/
│   ├── default/
│   └── sppa/
├── next-env.d.ts
├── next-i18next.config.js
├── next.config.js
├── output.txt
├── package.json
├── pg_hba.conf
├── postcss.config.js
├── public/
│   └── images/
│       ├── event1.jpg
│       ├── event2.jpg
│       ├── event3.jpg
│       ├── favicon.ico
│       ├── user1.jpg
│       └── user2.jpg
├── script.sql
├── scripts/
│   └── organize_sppa_dirs.sh
├── seeds/
├── server.js
├── src/
│   ├── @types/
│   │   └── shadcn__ui.d.ts
│   ├── api/
│   │   ├── generate-api-from-permissions.js
│   │   ├── generated-api.ts
│   │   └── notifications/
│   │       └── unread/
│   │           └── route.ts
│   ├── app/
│   │   ├── (common)/
│   │   │   ├── chat/
│   │   │   │   ├── [userId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── AutoTranslateToggle.tsx
│   │   │   │   │   ├── ChatWindow.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   └── MessageInput.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAutoTranslation.ts
│   │   │   │   │   ├── useOnlineUsers.ts
│   │   │   │   │   ├── useRealtimeChat.ts
│   │   │   │   │   ├── useRecentChats.ts
│   │   │   │   │   └── useSearchUsers.ts
│   │   │   │   └── page.tsx
│   │   │   ├── home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── FeedList.tsx
│   │   │   │   │   ├── MasonryFeed.tsx
│   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   ├── RealTimeAvailabilityBadge.tsx
│   │   │   │   │   ├── TabSelector.tsx
│   │   │   │   │   └── TranslationToggle.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useFeedData.ts
│   │   │   │   │   ├── useNotificationState.ts
│   │   │   │   │   └── useTherapistErrorEffect.ts
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   ├── components/
│   │   │   │   │   ├── FilterPanel.tsx
│   │   │   │   │   ├── RealTimeAvailabilityIndicator.tsx
│   │   │   │   │   ├── ResultCard.tsx
│   │   │   │   │   └── SearchBar.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useRealTimeAvailability.ts
│   │   │   │   │   └── useSearchResults.ts
│   │   │   │   └── page.tsx
│   │   │   └── therapists/
│   │   │       └── [therapistId]/
│   │   │           ├── components/
│   │   │           │   ├── BookingButton.tsx
│   │   │           │   ├── RealTimeStatus.tsx
│   │   │           │   ├── ReviewList.tsx
│   │   │           │   ├── ServiceDetails.tsx
│   │   │           │   ├── TherapistProfile.tsx
│   │   │           │   ├── useRealTimeReviews.ts
│   │   │           │   └── useTherapistDetails.ts
│   │   │           └── page.tsx
│   │   ├── ApolloWrapper.tsx
│   │   ├── api/
│   │   │   ├── activity-logs/
│   │   │   │   └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── error-logs/
│   │   │   │   └── route.ts
│   │   │   ├── events.ts
│   │   │   ├── experiences/
│   │   │   │   └── route.ts
│   │   │   ├── graphql/
│   │   │   │   └── route.ts
│   │   │   ├── graphql-fallback/
│   │   │   │   └── route.ts
│   │   │   ├── therapists/
│   │   │   │   ├── [therapistId]/
│   │   │   │   │   ├── availability/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── translate/
│   │   │   │   └── route.ts
│   │   │   ├── trends/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── [userId]/
│   │   │           └── route.ts
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── BookingButton.tsx
│   │   │   │   ├── BottomNavigation.tsx
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── FeedFilters.tsx
│   │   │   │   ├── HomeContent.tsx
│   │   │   │   ├── HomeHeader.tsx
│   │   │   │   ├── LanguageSwitcher.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── MediaDisplay.tsx
│   │   │   │   ├── MediaGallery.tsx
│   │   │   │   ├── MultiLanguageSupport.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── OfferCarousel.tsx
│   │   │   │   ├── PriceDisplay.tsx
│   │   │   │   ├── PushNotification.tsx
│   │   │   │   ├── RatingStars.tsx
│   │   │   │   ├── RecommendedExperiences.tsx
│   │   │   │   ├── ReviewCard.tsx
│   │   │   │   ├── ServiceBadge.tsx
│   │   │   │   ├── ServiceDetails.tsx
│   │   │   │   ├── TeaserCard.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   └── TherapistAvailabilityStatus.tsx
│   │   │   └── ui/
│   │   │       ├── Alert.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Calendar.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Checkbox.tsx
│   │   │       ├── DatePicker.tsx
│   │   │       ├── Dialog.tsx
│   │   │       ├── ErrorMessage.tsx
│   │   │       ├── Form.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Label.tsx
│   │   │       ├── Navbar.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── Switch.tsx
│   │   │       ├── Text.tsx
│   │   │       └── Toast.tsx
│   │   ├── contexts/
│   │   │   └── ChatContext.tsx
│   │   ├── create-ws-client.ts
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── availability.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── useActivityLogging.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCreateBooking.ts
│   │   │   │   ├── useCreateEvent.ts
│   │   │   │   ├── useCreateReview.ts
│   │   │   │   ├── useCreateTransaction.ts
│   │   │   │   ├── useErrorLogApi.ts
│   │   │   │   ├── useFetchEvents.ts
│   │   │   │   ├── useFetchFilters.ts
│   │   │   │   ├── useFetchLocalExperiences.ts
│   │   │   │   ├── useFetchMedia.ts
│   │   │   │   ├── useFetchReviews.ts
│   │   │   │   ├── useFetchSearchResults.ts
│   │   │   │   ├── useFetchServiceCategories.ts
│   │   │   │   ├── useFetchServices.ts
│   │   │   │   ├── useFetchTherapistLocations.ts
│   │   │   │   ├── useFetchTherapists.ts
│   │   │   │   ├── useFetchTrends.ts
│   │   │   │   ├── useFetchUser.ts
│   │   │   │   ├── useIsomorphicLayoutEffect.ts
│   │   │   │   ├── useLikeTherapist.ts
│   │   │   │   ├── useMatchList.ts
│   │   │   │   ├── useMedia.ts
│   │   │   │   ├── useNotificationsApi.ts
│   │   │   │   ├── useRealtimeAvailability.ts
│   │   │   │   ├── useServices.ts
│   │   │   │   ├── useTherapistAvailabilityApi.ts
│   │   │   │   ├── useTherapistData.tsx
│   │   │   │   ├── useTherapistSearch.ts
│   │   │   │   ├── useTransactions.ts
│   │   │   │   ├── useTrends.ts
│   │   │   │   ├── useUnreadNotifications.ts
│   │   │   │   ├── useUpdateUser.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   └── users.ts
│   │   │   ├── realtime/
│   │   │   │   ├── RealtimeMatchList.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   ├── TherapistAvailabilityStatus.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── useNotifications.ts
│   │   │   │   ├── useRealtimeAvailability.ts
│   │   │   │   ├── useRealtimeBookings.ts
│   │   │   │   ├── useRealtimeChat.ts
│   │   │   │   ├── useRealtimeEvents.ts
│   │   │   │   ├── useRealtimeFeedUpdates.ts
│   │   │   │   ├── useRealtimeMatchList.ts
│   │   │   │   ├── useRealtimeReviews.ts
│   │   │   │   ├── useRealtimeTransactions.ts
│   │   │   │   └── useTherapistAvailability.ts
│   │   │   └── ui/
│   │   │       └── useBottomSheet.ts
│   │   ├── i18n/
│   │   │   ├── I18nProvider.tsx
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── settings.ts
│   │   ├── layout.tsx
│   │   ├── lib/
│   │   │   ├── auth.client.ts
│   │   │   ├── auth.server.ts
│   │   │   ├── auth.ts
│   │   │   ├── authOptions.ts
│   │   │   ├── currency-utils.ts
│   │   │   ├── date-utils.ts
│   │   │   ├── enum-utils.ts
│   │   │   ├── graphql/
│   │   │   │   └── queries/
│   │   │   │       ├── post.ts
│   │   │   │       └── service.ts
│   │   │   ├── hasura-client.ts
│   │   │   ├── i18n.ts
│   │   │   ├── queries/
│   │   │   │   ├── media.ts
│   │   │   │   ├── therapistAvailability.ts
│   │   │   │   └── user.ts
│   │   │   ├── storage-utils.ts
│   │   │   ├── string-utils.ts
│   │   │   ├── supabase-client.ts
│   │   │   └── utils.ts
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── id.json
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── pages/
│   │   │   └── UserIcon.tsx
│   │   ├── providers.tsx
│   │   ├── realtime/
│   │   │   ├── RealtimeBookingList.tsx
│   │   │   ├── RealtimeEventList.tsx
│   │   │   ├── availability-listener.ts
│   │   │   ├── bookings-listener.ts
│   │   │   ├── chat-listener.ts
│   │   │   ├── likes-listener.ts
│   │   │   ├── notifications-push.tsx
│   │   │   └── profile-listener.ts
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── therapist/
│   │   │   ├── bookings/
│   │   │   │   ├── components/
│   │   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   │   ├── BookingDetailModal.tsx
│   │   │   │   │   ├── BookingList.tsx
│   │   │   │   │   └── TransactionList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   └── TherapistLayout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ActivityLog.tsx
│   │   │   │   │   ├── BookingSummary.tsx
│   │   │   │   │   ├── DashboardSummary.tsx
│   │   │   │   │   └── RevenueChart.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── components/
│   │   │   │   │   ├── EventCard.tsx
│   │   │   │   │   ├── EventForm.tsx
│   │   │   │   │   └── EventList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useActivityLogs.ts
│   │   │   │   ├── useBookingData.ts
│   │   │   │   ├── useEventData.ts
│   │   │   │   └── useReviewData.ts
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AvailabilitySettings.tsx
│   │   │   │   │   ├── EventForm.tsx
│   │   │   │   │   ├── MediaUploadForm.tsx
│   │   │   │   │   ├── ProfileForm.tsx
│   │   │   │   │   ├── ProfileSettings.tsx
│   │   │   │   │   ├── ServiceForm.tsx
│   │   │   │   │   ├── ServiceManagement.tsx
│   │   │   │   │   └── hooks/
│   │   │   │   │       ├── useProfileData.ts
│   │   │   │   │       └── useRealTimeProfileUpdates.ts
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ReviewDetailModal.tsx
│   │   │   │   │   ├── ReviewList.tsx
│   │   │   │   │   └── ReviewOverview.tsx
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── tourist/
│   │       ├── bookings/
│   │       │   ├── components/
│   │       │   │   ├── AddOption.tsx
│   │       │   │   ├── BookingCalendar.tsx
│   │       │   │   ├── BookingCard.tsx
│   │       │   │   ├── BookingDetailModal.tsx
│   │       │   │   ├── BookingForm.tsx
│   │       │   │   ├── BookingList.tsx
│   │       │   │   ├── CancelPolicy.tsx
│   │       │   │   ├── MyBookingsList.tsx
│   │       │   │   ├── RealTimeAvailability.tsx
│   │       │   │   ├── ReminderNotification.tsx
│   │       │   │   └── TransactionDetails.tsx
│   │       │   ├── hooks/
│   │       │   │   ├── useBookingNotifications.ts
│   │       │   │   └── useMyBookings.ts
│   │       │   └── page.tsx
│   │       ├── chat/
│   │       │   ├── components/
│   │       │   │   ├── AutoTranslate.tsx
│   │       │   │   ├── ChatWindow.tsx
│   │       │   │   ├── EmergencyContact.tsx
│   │       │   │   ├── MediaShare.tsx
│   │       │   │   ├── MessageInput.tsx
│   │       │   │   ├── MessageList.tsx
│   │       │   │   ├── OnlineTherapists.tsx
│   │       │   │   ├── PriorityMessage.tsx
│   │       │   │   ├── RecentConversations.tsx
│   │       │   │   ├── SearchBar.tsx
│   │       │   │   └── TemplateMessage.tsx
│   │       │   └── page.tsx
│   │       ├── components/
│   │       │   ├── LocationService.ts
│   │       │   ├── RecommendedExperiences.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── TherapistCard.tsx
│   │       │   └── TouristLayout.tsx
│   │       ├── home/
│   │       │   ├── components/
│   │       │   │   ├── MultiLanguageSupport.tsx
│   │       │   │   ├── OfferCarousel.tsx
│   │       │   │   ├── RecommendedExperiences.tsx
│   │       │   │   ├── RecommendedTherapists.tsx
│   │       │   │   └── WelcomeMessage.tsx
│   │       │   ├── hooks/
│   │       │   │   ├── useHomeData.ts
│   │       │   │   ├── useNotificationCount.ts
│   │       │   │   └── usePageData.ts
│   │       │   └── page.tsx
│   │       ├── hooks/
│   │       │   ├── useLocalExperiences.ts
│   │       │   ├── useLocationService.ts
│   │       │   ├── useTherapistSearch.ts
│   │       │   └── useUserPreferences.ts
│   │       ├── likes/
│   │       │   └── components/
│   │       │       ├── LikeButton.tsx
│   │       │       └── MatchList.tsx
│   │       ├── local-experiences/
│   │       │   ├── [experienceId]/
│   │       │   │   ├── components/
│   │       │   │   │   └── MediaGallery.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── components/
│   │       │   │   ├── ExperienceCard.tsx
│   │       │   │   └── ExperienceList.tsx
│   │       │   └── page.tsx
│   │       ├── notifications/
│   │       │   ├── components/
│   │       │   │   ├── NotificationList.tsx
│   │       │   │   └── components/
│   │       │   │       └── NotificationListStatic.tsx
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── preferences/
│   │       │   ├── components/
│   │       │   │   └── PreferenceForm.tsx
│   │       │   └── page.tsx
│   │       ├── profile/
│   │       │   ├── components/
│   │       │   │   ├── DarkModeToggle.tsx
│   │       │   │   ├── PaymentMethod.tsx
│   │       │   │   ├── PreferencesForm.tsx
│   │       │   │   ├── ProfileEdit.tsx
│   │       │   │   ├── ProfileForm.tsx
│   │       │   │   ├── ProfileView.tsx
│   │       │   │   ├── ReviewHistory.tsx
│   │       │   │   └── hooks/
│   │       │   │       └── useUserProfile.ts
│   │       │   └── page.tsx
│   │       ├── search/
│   │       │   ├── components/
│   │       │   │   ├── FilterModal.tsx
│   │       │   │   ├── MapView.tsx
│   │       │   │   ├── SearchBar.tsx
│   │       │   │   ├── SearchResults.tsx
│   │       │   │   ├── TrendDisplay.tsx
│   │       │   │   ├── TrendTags.tsx
│   │       │   │   └── TrendingSearches.tsx
│   │       │   └── page.tsx
│   │       └── therapists/
│   │           ├── [therapistId]/
│   │           │   ├── components/
│   │           │   │   ├── MediaGallery.tsx
│   │           │   │   ├── ReviewList.tsx
│   │           │   │   ├── TherapistAvailability.tsx
│   │           │   │   └── TherapistDetail.tsx
│   │           │   └── page.tsx
│   │           ├── components/
│   │           │   ├── FilterPanel.tsx
│   │           │   ├── TherapistCard.tsx
│   │           │   ├── TherapistFilter.tsx
│   │           │   ├── TherapistList.tsx
│   │           │   └── TherapistMap.tsx
│   │           └── page.tsx
│   ├── backend/
│   │   └── api/
│   │       └── graphql/
│   │           ├── availability.ts
│   │           ├── bookings.ts
│   │           ├── error-logs.ts
│   │           ├── events.ts
│   │           ├── index.ts
│   │           ├── likes.ts
│   │           ├── local-experiences.ts
│   │           ├── media.ts
│   │           ├── reviews.ts
│   │           ├── services.ts
│   │           ├── therapists.ts
│   │           ├── transactions.ts
│   │           ├── trends.ts
│   │           └── users.ts
│   ├── realtime/
│   │   ├── availability-listener.ts
│   │   ├── bookings-listener.ts
│   │   ├── chat-listener.ts
│   │   ├── likes-listener.ts
│   │   ├── notifications-listener.ts
│   │   └── profile-listener.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.ts
│   ├── types/
│   │   ├── activity-log.ts
│   │   ├── auth.ts
│   │   ├── availability.ts
│   │   ├── booking.ts
│   │   ├── chat.ts
│   │   ├── enums.ts
│   │   ├── error-log.ts
│   │   ├── event.ts
│   │   ├── graphql.ts
│   │   ├── like.ts
│   │   ├── local-experience.ts
│   │   ├── lodash.d.ts
│   │   ├── match.ts
│   │   ├── media.ts
│   │   ├── next-auth.d.ts
│   │   ├── next-i18next.d.ts
│   │   ├── notification.ts
│   │   ├── post.ts
│   │   ├── preference.ts
│   │   ├── react-window.d.ts
│   │   ├── review.ts
│   │   ├── therapist.ts
│   │   ├── tourist.ts
│   │   ├── transaction.ts
│   │   ├── user.ts
│   │   ├── ws.d.ts
│   │   └── zen-observable-ts.d.ts
│   └── utils/
│       ├── auth.ts
│       ├── hasura-client.ts
│       └── supabase/
│           └── server.ts
├── supabase/
│   └── config.toml
├── tailwind.config.js
└── tsconfig.json
    
</details>

---

Sppaは、あなたの技術と情熱によって進化するプラットフォームです。  
自主的なコミュニティとして、互いに刺激し合い、協力しながら最高のSNSを創り上げましょう。  
**創業メンバーとして参加し、共にSppaを世界標準のサービスへと育て上げる仲間を心からお待ちしています。**

さあ、あなたのアイデアとスキルで、未来のSppaを共に創りましょう！
