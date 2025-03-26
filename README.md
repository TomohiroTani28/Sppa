# Sppa（スパ） - バリ島のセラピストと観光客を繋ぐコンテンツファーストSNS

**Sppa**は、バリ島の熟練セラピストと、オーストラリア、ドイツ、フランス、韓国、日本、中国など主要国を含む世界中の観光客を、リアルタイムかつ多言語で繋ぐ新感覚SNSプラットフォームです。  
言葉の壁や予約の手間を解消し、誰もが心からリラックスできる体験を提供するため、エンジニア同士が自主的に協力しあえるオープンなコミュニティ運営を実現しています。

---

## プロジェクトのコンセプト

Sppaは、**リアルタイムチャット、即時予約管理、翻訳機能、SNSフィード**を中核に、セラピストとユーザーの体験を根本から革新します。  
私たちは、単なるプロダクト開発に留まらず、参加する全てのメンバーが「創業メンバー」として、自らの力でサービスを共に作り上げることを目指しています。

---

## 自主的なコミュニティでの開発推進

### オープンなコミュニケーション環境

- **GitHub Discussions & Issues**  
  提案、機能改善、設計の議論はGitHub上で活発に行い、IssueやPull Requestを通じてコードレビューと意見交換を実施します。

- **リアルタイムチャット（Slack）**  
  日々のコミュニケーションや緊急時のディスカッション、ブレインストーミングにはSlackを活用しています。  
  以下の招待リンクから参加し、**# sppa** チャネル（チャネルID: C08L0QQ5Q7J）で活発に意見交換をしましょう。  
  [Slack招待リンク](https://join.slack.com/t/sppaworld/shared_invite/zt-2dx91m6hy-cf6BsjfIyMQ4BS6PewjV1w)

- **自動化されたCI/CD**  
  GitHub Actionsによる自動テストとデプロイメントを導入。コードがマージされる前に品質チェックが行われ、安心して開発に集中できます。

### 自主性を尊重した開発環境

- **即時管理権限の付与**  
  初回コミットの意思表示が確認された開発者には、GitHubリポジトリのディレクトリ編集（Admin相当）の権限を即座に付与。  
  あなたのアイデアや改善提案が、すぐにプロダクトに反映される環境を用意しています。

- **創業メンバーとしての参加**  
  Sppaの成長を共に担う創業メンバーとして、あなたの技術や情熱がサービスの進化に直結します。  
  将来的なIPO（株式公開）に伴い、貢献度に応じた**最大5%のストックオプション**（または株式）が付与される仕組みを計画中です。

---

## ストックオプション付与の詳細条件

Sppaは、グローバル市場での急成長とIPOを視野に入れ、貢献したメンバーにリターンを還元します。以下の条件を満たした場合、**5%のストックオプション**を付与する予定です。（最終条件は個別面談・契約により決定します。）

1. **継続的な貢献:**  
   - 最低6ヶ月間、定期的なコミットおよび議論参加を行うこと。

2. **主要機能への貢献:**  
   - リアルタイムチャット、予約管理、翻訳機能など、サービスの中核部分の設計と実装で主導的役割を果たすこと。

3. **積極的なコミュニケーション:**  
   - GitHub上でのIssue、Discussions、Pull Requestを通じた建設的な意見交換およびコードレビューに積極的に参加すること。

4. **プロダクトへの提案と実行:**  
   - 新機能や改善点の提案を実行に移し、実際にプロトタイプや実装を通してプロダクトの向上に寄与すること.

> これらの条件はあくまでガイドラインです。最終的な付与割合や具体的な契約条件は、個々の貢献内容に応じた面談の上で決定します。

---

## 技術スタック & 特徴

| 項目                   | 使用技術                          | 特徴・メリット                                                               |
| ---------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| **フロントエンド**     | Next.js (App Router), TypeScript  | SSR + CSRを組み合わせたハイブリッド構成で高速かつ柔軟なレンダリングを実現         |
| **UIライブラリ**       | Shadcn/UI, Tailwind CSS           | シンプルで美しいUIを迅速に構築。カスタマイズも容易で、ユーザー体験を向上               |
| **API・DB**            | Hasura + PostgreSQL (GraphQL)     | スキーマ駆動設計とリアルタイムSubscriptionにより効率的なデータ管理と同期を実現         |
| **ファイル管理**       | Supabase Storage                  | 大容量ファイルのホスティングとCDN配信により、ユーザーに迅速なコンテンツ提供が可能       |
| **リアルタイム通信**   | Hasura Subscriptions              | 専用WebSocketサーバー不要で、リアルタイム更新をシームレスに実装                     |
| **翻訳サービス**       | LibreTranslate                    | 英語、インドネシア語、ドイツ語、フランス語、韓国語、日本語、中国語など、多言語対応に最適 |
| **ホスティング**       | Cloudflare Pages                  | グローバルCDNを活用し、主要国（オーストラリア、ドイツ、フランス、韓国、日本、中国）からの高速アクセスを実現 |
| **CI/CD & セキュリティ**| GitHub Actions, Cloudflare WAF    | 自動テスト・自動デプロイに加え、堅牢なWAFでセキュリティを強化

＿＿

## ディレクトリ構造

ディレクトリ構造が長いため、`<details>`タグを使用して折りたたみ可能にしています。「クリックして展開」をクリックすると、全体を確認できます。

<details>
<summary>クリックして展開</summary>
sppa
├── %
├── Dockerfile
├── Sppa概要
├── api-template.hbs
├── config.yaml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── hasura
│   ├── config.yaml
│   ├── metadata
│   │   ├── actions.graphql
│   │   ├── actions.yaml
│   │   ├── allow_list.yaml
│   │   ├── api_limits.yaml
│   │   ├── backend_configs.yaml
│   │   ├── cron_triggers.yaml
│   │   ├── databases
│   │   │   ├── databases.yaml
│   │   │   └── default
│   │   │       └── tables
│   │   │           ├── public_activity_logs.yaml
│   │   │           ├── public_application_settings.yaml
│   │   │           ├── public_bookings.yaml
│   │   │           ├── public_error_logs.yaml
│   │   │           ├── public_event_media.yaml
│   │   │           ├── public_events.yaml
│   │   │           ├── public_geography_columns.yaml
│   │   │           ├── public_geometry_columns.yaml
│   │   │           ├── public_likes.yaml
│   │   │           ├── public_local_experience_categories.yaml
│   │   │           ├── public_local_experience_media.yaml
│   │   │           ├── public_local_experiences.yaml
│   │   │           ├── public_matches.yaml
│   │   │           ├── public_media.yaml
│   │   │           ├── public_notifications.yaml
│   │   │           ├── public_posts.yaml
│   │   │           ├── public_realtime_messages.yaml
│   │   │           ├── public_regions.yaml
│   │   │           ├── public_reviews.yaml
│   │   │           ├── public_service_categories.yaml
│   │   │           ├── public_service_media.yaml
│   │   │           ├── public_spatial_ref_sys.yaml
│   │   │           ├── public_storage_buckets.yaml
│   │   │           ├── public_storage_objects.yaml
│   │   │           ├── public_therapist_availability.yaml
│   │   │           ├── public_therapist_profiles.yaml
│   │   │           ├── public_therapist_services.yaml
│   │   │           ├── public_tourist_profiles.yaml
│   │   │           ├── public_transactions.yaml
│   │   │           ├── public_unavailable_dates.yaml
│   │   │           ├── public_user_preferences.yaml
│   │   │           ├── public_users.yaml
│   │   │           └── tables.yaml
│   │   ├── graphql_schema_introspection.yaml
│   │   ├── inherited_roles.yaml
│   │   ├── metrics_config.yaml
│   │   ├── network.yaml
│   │   ├── opentelemetry.yaml
│   │   ├── permission.yaml
│   │   ├── query_collections.yaml
│   │   ├── remote_schemas.yaml
│   │   ├── rest_endpoints.yaml
│   │   └── version.yaml
│   ├── migrations
│   │   └── default
│   │       ├── 1742053444159_init
│   │       │   └── up.sql
│   │       ├── 1742054367761_init
│   │       │   └── up.sql
│   │       └── 20250226120000_create_tables.sql
│   ├── output.txt
│   ├── payload:{headers:Authorization:Bearer <your-token>}
│   ├── payload:{headers:Authorization:Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ik1IMGpoZFl0L05nclVwb0…}
│   ├── payload:{headers:x-hasura-role:tourist}
│   ├── seeds
│   │   └── default
│   │       └── 1741574725086_initial_data.sql
│   └── type:connection_init
├── metadata
│   ├── actions.graphql
│   ├── actions.yaml
│   ├── allow_list.yaml
│   ├── api_limits.yaml
│   ├── backend_configs.yaml
│   ├── cron_triggers.yaml
│   ├── databases
│   │   ├── databases.yaml
│   │   ├── default
│   │   │   └── tables
│   │   │       ├── public_geography_columns.yaml
│   │   │       ├── public_geometry_columns.yaml
│   │   │       ├── public_spatial_ref_sys.yaml
│   │   │       └── tables.yaml
│   │   └── sppa
│   │       └── tables
│   │           ├── pgsodium_decrypted_key.yaml
│   │           ├── pgsodium_key.yaml
│   │           ├── pgsodium_mask_columns.yaml
│   │           ├── pgsodium_masking_rule.yaml
│   │           ├── pgsodium_valid_key.yaml
│   │           ├── public_activity_logs.yaml
│   │           ├── public_application_settings.yaml
│   │           ├── public_bookings.yaml
│   │           ├── public_error_logs.yaml
│   │           ├── public_event_media.yaml
│   │           ├── public_events.yaml
│   │           ├── public_likes.yaml
│   │           ├── public_local_experience_categories.yaml
│   │           ├── public_local_experience_media.yaml
│   │           ├── public_local_experiences.yaml
│   │           ├── public_matches.yaml
│   │           ├── public_media.yaml
│   │           ├── public_notifications.yaml
│   │           ├── public_posts.yaml
│   │           ├── public_regions.yaml
│   │           ├── public_reviews.yaml
│   │           ├── public_service_categories.yaml
│   │           ├── public_service_media.yaml
│   │           ├── public_therapist_availability.yaml
│   │           ├── public_therapist_profiles.yaml
│   │           ├── public_therapist_services.yaml
│   │           ├── public_tourist_profiles.yaml
│   │           ├── public_transactions.yaml
│   │           ├── public_unavailable_dates.yaml
│   │           ├── public_user_preferences.yaml
│   │           ├── public_users.yaml
│   │           ├── realtime_messages.yaml
│   │           ├── realtime_schema_migrations.yaml
│   │           ├── realtime_subscription.yaml
│   │           ├── storage_buckets.yaml
│   │           ├── storage_migrations.yaml
│   │           ├── storage_objects.yaml
│   │           ├── storage_s3_multipart_uploads.yaml
│   │           ├── storage_s3_multipart_uploads_parts.yaml
│   │           ├── supabase_migrations_schema_migrations.yaml
│   │           ├── supabase_migrations_seed_files.yaml
│   │           ├── tables.yaml
│   │           ├── vault_decrypted_secrets.yaml
│   │           └── vault_secrets.yaml
│   ├── graphql_schema_introspection.yaml
│   ├── inherited_roles.yaml
│   ├── metrics_config.yaml
│   ├── network.yaml
│   ├── opentelemetry.yaml
│   ├── query_collections.yaml
│   ├── remote_schemas.yaml
│   ├── rest_endpoints.yaml
│   └── version.yaml
├── metadata.json
├── middleware.ts
├── migration_log.txt
├── migrations
│   ├── default
│   └── sppa
├── next-env.d.ts
├── next-i18next.config.js
├── next.config.js
├── output.txt
├── package.json
├── pg_hba.conf
├── postcss.config.js
├── public
│   └── images
│       ├── event1.jpg
│       ├── event2.jpg
│       ├── event3.jpg
│       ├── favicon.ico
│       ├── user1.jpg
│       └── user2.jpg
├── script.sql
├── scripts
│   └── organize_sppa_dirs.sh
├── seeds
├── server.js
├── src
│   ├── @types
│   │   └── shadcn__ui.d.ts
│   ├── api
│   │   ├── generate-api-from-permissions.js
│   │   ├── generated-api.ts
│   │   └── notifications
│   │       └── unread
│   │           └── route.ts
│   ├── app
│   │   ├── (common)
│   │   │   ├── chat
│   │   │   │   ├── [userId]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── AutoTranslateToggle.tsx
│   │   │   │   │   ├── ChatWindow.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   └── MessageInput.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── useAutoTranslation.ts
│   │   │   │   │   ├── useOnlineUsers.ts
│   │   │   │   │   ├── useRealtimeChat.ts
│   │   │   │   │   ├── useRecentChats.ts
│   │   │   │   │   └── useSearchUsers.ts
│   │   │   │   └── page.tsx
│   │   │   ├── home
│   │   │   │   ├── components
│   │   │   │   │   ├── FeedList.tsx
│   │   │   │   │   ├── MasonryFeed.tsx
│   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   ├── RealTimeAvailabilityBadge.tsx
│   │   │   │   │   ├── TabSelector.tsx
│   │   │   │   │   └── TranslationToggle.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── useFeedData.ts
│   │   │   │   │   ├── useNotificationState.ts
│   │   │   │   │   └── useTherapistErrorEffect.ts
│   │   │   │   └── page.tsx
│   │   │   ├── search
│   │   │   │   ├── components
│   │   │   │   │   ├── FilterPanel.tsx
│   │   │   │   │   ├── RealTimeAvailabilityIndicator.tsx
│   │   │   │   │   ├── ResultCard.tsx
│   │   │   │   │   └── SearchBar.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── useRealTimeAvailability.ts
│   │   │   │   │   └── useSearchResults.ts
│   │   │   │   └── page.tsx
│   │   │   └── therapists
│   │   │       └── [therapistId]
│   │   │           ├── components
│   │   │           │   ├── BookingButton.tsx
│   │   │           │   ├── RealTimeStatus.tsx
│   │   │           │   ├── ReviewList.tsx
│   │   │           │   ├── ServiceDetails.tsx
│   │   │           │   ├── TherapistProfile.tsx
│   │   │           │   ├── useRealTimeReviews.ts
│   │   │           │   └── useTherapistDetails.ts
│   │   │           └── page.tsx
│   │   ├── ApolloWrapper.tsx
│   │   ├── api
│   │   │   ├── activity-logs
│   │   │   │   └── route.ts
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   │       └── route.ts
│   │   │   ├── error-logs
│   │   │   │   └── route.ts
│   │   │   ├── events.ts
│   │   │   ├── experiences
│   │   │   │   └── route.ts
│   │   │   ├── graphql
│   │   │   │   └── route.ts
│   │   │   ├── graphql-fallback
│   │   │   │   └── route.ts
│   │   │   ├── therapists
│   │   │   │   ├── [therapistId]
│   │   │   │   │   ├── availability
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── translate
│   │   │   │   └── route.ts
│   │   │   ├── trends
│   │   │   │   └── route.ts
│   │   │   └── users
│   │   │       └── [userId]
│   │   │           └── route.ts
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── BookingButton.tsx
│   │   │   │   ├── BottomNavigation.tsx
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── FeedFilters.tsx
│   │   │   │   ├── HomeContent.tsx
│   │   │   │   ├── HomeHeader.tsx
│   │   │   │   ├── LanguageSwitcher.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── MediaDisplay.tsx
│   │   │   │   ├── MediaGallery.tsx
│   │   │   │   ├── MultiLanguageSupport.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── OfferCarousel.tsx
│   │   │   │   ├── PriceDisplay.tsx
│   │   │   │   ├── PushNotification.tsx
│   │   │   │   ├── RatingStars.tsx
│   │   │   │   ├── RecommendedExperiences.tsx
│   │   │   │   ├── ReviewCard.tsx
│   │   │   │   ├── ServiceBadge.tsx
│   │   │   │   ├── ServiceDetails.tsx
│   │   │   │   ├── TeaserCard.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   └── TherapistAvailabilityStatus.tsx
│   │   │   └── ui
│   │   │       ├── Alert.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Calendar.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Checkbox.tsx
│   │   │       ├── DatePicker.tsx
│   │   │       ├── Dialog.tsx
│   │   │       ├── ErrorMessage.tsx
│   │   │       ├── Form.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Label.tsx
│   │   │       ├── Navbar.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── Switch.tsx
│   │   │       ├── Text.tsx
│   │   │       └── Toast.tsx
│   │   ├── contexts
│   │   │   └── ChatContext.tsx
│   │   ├── create-ws-client.ts
│   │   ├── hooks
│   │   │   ├── api
│   │   │   │   ├── availability.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── useActivityLogging.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCreateBooking.ts
│   │   │   │   ├── useCreateEvent.ts
│   │   │   │   ├── useCreateReview.ts
│   │   │   │   ├── useCreateTransaction.ts
│   │   │   │   ├── useErrorLogApi.ts
│   │   │   │   ├── useFetchEvents.ts
│   │   │   │   ├── useFetchFilters.ts
│   │   │   │   ├── useFetchLocalExperiences.ts
│   │   │   │   ├── useFetchMedia.ts
│   │   │   │   ├── useFetchReviews.ts
│   │   │   │   ├── useFetchSearchResults.ts
│   │   │   │   ├── useFetchServiceCategories.ts
│   │   │   │   ├── useFetchServices.ts
│   │   │   │   ├── useFetchTherapistLocations.ts
│   │   │   │   ├── useFetchTherapists.ts
│   │   │   │   ├── useFetchTrends.ts
│   │   │   │   ├── useFetchUser.ts
│   │   │   │   ├── useIsomorphicLayoutEffect.ts
│   │   │   │   ├── useLikeTherapist.ts
│   │   │   │   ├── useMatchList.ts
│   │   │   │   ├── useMedia.ts
│   │   │   │   ├── useNotificationsApi.ts
│   │   │   │   ├── useRealtimeAvailability.ts
│   │   │   │   ├── useServices.ts
│   │   │   │   ├── useTherapistAvailabilityApi.ts
│   │   │   │   ├── useTherapistData.tsx
│   │   │   │   ├── useTherapistSearch.ts
│   │   │   │   ├── useTransactions.ts
│   │   │   │   ├── useTrends.ts
│   │   │   │   ├── useUnreadNotifications.ts
│   │   │   │   ├── useUpdateUser.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   └── users.ts
│   │   │   ├── realtime
│   │   │   │   ├── RealtimeMatchList.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   ├── TherapistAvailabilityStatus.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── useNotifications.ts
│   │   │   │   ├── useRealtimeAvailability.ts
│   │   │   │   ├── useRealtimeBookings.ts
│   │   │   │   ├── useRealtimeChat.ts
│   │   │   │   ├── useRealtimeEvents.ts
│   │   │   │   ├── useRealtimeFeedUpdates.ts
│   │   │   │   ├── useRealtimeMatchList.ts
│   │   │   │   ├── useRealtimeReviews.ts
│   │   │   │   ├── useRealtimeTransactions.ts
│   │   │   │   └── useTherapistAvailability.ts
│   │   │   ├── ui
│   │   │   │   └── useBottomSheet.ts
│   │   │   ├── useFeedStore.ts
│   │   │   ├── usePosts.ts
│   │   │   ├── useTherapistAvailability.ts
│   │   │   └── useWebSocketSubscription.ts
│   │   ├── i18n
│   │   │   ├── I18nProvider.tsx
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── settings.ts
│   │   ├── layout.tsx
│   │   ├── lib
│   │   │   ├── auth.client.ts
│   │   │   ├── auth.server.ts
│   │   │   ├── auth.ts
│   │   │   ├── authOptions.ts
│   │   │   ├── currency-utils.ts
│   │   │   ├── date-utils.ts
│   │   │   ├── enum-utils.ts
│   │   │   ├── geoUtils.ts
│   │   │   ├── graphql
│   │   │   │   └── queries
│   │   │   │       ├── post.ts
│   │   │   │       └── service.ts
│   │   │   ├── hasura-client.ts
│   │   │   ├── i18n.ts
│   │   │   ├── queries
│   │   │   │   ├── media.ts
│   │   │   │   ├── therapistAvailability.ts
│   │   │   │   └── user.ts
│   │   │   ├── storage-utils.ts
│   │   │   ├── string-utils.ts
│   │   │   ├── supabase-client.ts
│   │   │   └── utils.ts
│   │   ├── locales
│   │   │   ├── en.json
│   │   │   └── id.json
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── pages
│   │   │   └── UserIcon.tsx
│   │   ├── providers.tsx
│   │   ├── realtime
│   │   │   ├── RealtimeBookingList.tsx
│   │   │   ├── RealtimeEventList.tsx
│   │   │   ├── availability-listener.ts
│   │   │   ├── bookings-listener.ts
│   │   │   ├── chat-listener.ts
│   │   │   ├── likes-listener.ts
│   │   │   ├── notifications-push.tsx
│   │   │   └── profile-listener.ts
│   │   ├── signup
│   │   │   └── page.tsx
│   │   ├── therapist
│   │   │   ├── bookings
│   │   │   │   ├── components
│   │   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   │   ├── BookingDetailModal.tsx
│   │   │   │   │   ├── BookingList.tsx
│   │   │   │   │   └── TransactionList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TherapistAvailabilityPanel.tsx
│   │   │   │   └── TherapistLayout.tsx
│   │   │   ├── dashboard
│   │   │   │   ├── components
│   │   │   │   │   ├── ActivityLog.tsx
│   │   │   │   │   ├── BookingSummary.tsx
│   │   │   │   │   ├── DashboardSummary.tsx
│   │   │   │   │   └── RevenueChart.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── events
│   │   │   │   ├── components
│   │   │   │   │   ├── EventCard.tsx
│   │   │   │   │   ├── EventForm.tsx
│   │   │   │   │   └── EventList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useActivityLogs.ts
│   │   │   │   ├── useBookingData.ts
│   │   │   │   ├── useEventData.ts
│   │   │   │   └── useReviewData.ts
│   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   │   ├── components
│   │   │   │   │   ├── AvailabilitySettings.tsx
│   │   │   │   │   ├── EventForm.tsx
│   │   │   │   │   ├── MediaUploadForm.tsx
│   │   │   │   │   ├── ProfileForm.tsx
│   │   │   │   │   ├── ProfileSettings.tsx
│   │   │   │   │   ├── ServiceForm.tsx
│   │   │   │   │   ├── ServiceManagement.tsx
│   │   │   │   │   └── hooks
│   │   │   │   │       ├── useProfileData.ts
│   │   │   │   │       └── useRealTimeProfileUpdates.ts
│   │   │   │   └── page.tsx
│   │   │   ├── reviews
│   │   │   │   ├── components
│   │   │   │   │   ├── ReviewDetailModal.tsx
│   │   │   │   │   ├── ReviewList.tsx
│   │   │   │   │   └── ReviewOverview.tsx
│   │   │   │   └── page.tsx
│   │   │   └── settings
│   │   │       └── page.tsx
│   │   └── tourist
│   │       ├── bookings
│   │       │   ├── components
│   │       │   │   ├── AddOption.tsx
│   │       │   │   ├── BookingCalendar.tsx
│   │       │   │   ├── BookingCard.tsx
│   │       │   │   ├── BookingDetailModal.tsx
│   │       │   │   ├── BookingForm.tsx
│   │       │   │   ├── BookingList.tsx
│   │       │   │   ├── CancelPolicy.tsx
│   │       │   │   ├── MyBookingsList.tsx
│   │       │   │   ├── RealTimeAvailability.tsx
│   │       │   │   ├── ReminderNotification.tsx
│   │       │   │   └── TransactionDetails.tsx
│   │       │   ├── hooks
│   │       │   │   ├── useBookingNotifications.ts
│   │       │   │   └── useMyBookings.ts
│   │       │   └── page.tsx
│   │       ├── chat
│   │       │   ├── components
│   │       │   │   ├── AutoTranslate.tsx
│   │       │   │   ├── ChatWindow.tsx
│   │       │   │   ├── EmergencyContact.tsx
│   │       │   │   ├── MediaShare.tsx
│   │       │   │   ├── MessageInput.tsx
│   │       │   │   ├── MessageList.tsx
│   │       │   │   ├── OnlineTherapists.tsx
│   │       │   │   ├── PriorityMessage.tsx
│   │       │   │   ├── RecentConversations.tsx
│   │       │   │   ├── SearchBar.tsx
│   │       │   │   └── TemplateMessage.tsx
│   │       │   └── page.tsx
│   │       ├── components
│   │       │   ├── LocationService.ts
│   │       │   ├── RecommendedExperiences.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── TherapistCard.tsx
│   │       │   └── TouristLayout.tsx
│   │       ├── home
│   │       │   ├── components
│   │       │   │   ├── MultiLanguageSupport.tsx
│   │       │   │   ├── OfferCarousel.tsx
│   │       │   │   ├── RecommendedExperiences.tsx
│   │       │   │   ├── RecommendedTherapists.tsx
│   │       │   │   └── WelcomeMessage.tsx
│   │       │   ├── hooks
│   │       │   │   ├── useHomeData.ts
│   │       │   │   ├── useNotificationCount.ts
│   │       │   │   └── usePageData.ts
│   │       │   └── page.tsx
│   │       ├── hooks
│   │       │   ├── useLocalExperiences.ts
│   │       │   ├── useLocationService.ts
│   │       │   ├── useTherapistSearch.ts
│   │       │   └── useUserPreferences.ts
│   │       ├── likes
│   │       │   └── components
│   │       │       ├── LikeButton.tsx
│   │       │       └── MatchList.tsx
│   │       ├── local-experiences
│   │       │   ├── [experienceId]
│   │       │   │   ├── components
│   │       │   │   │   └── MediaGallery.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── components
│   │       │   │   ├── ExperienceCard.tsx
│   │       │   │   └── ExperienceList.tsx
│   │       │   └── page.tsx
│   │       ├── notifications
│   │       │   ├── components
│   │       │   │   ├── NotificationList.tsx
│   │       │   │   └── components
│   │       │   │       └── NotificationListStatic.tsx
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── preferences
│   │       │   ├── components
│   │       │   │   └── PreferenceForm.tsx
│   │       │   └── page.tsx
│   │       ├── profile
│   │       │   ├── components
│   │       │   │   ├── DarkModeToggle.tsx
│   │       │   │   ├── PaymentMethod.tsx
│   │       │   │   ├── PreferencesForm.tsx
│   │       │   │   ├── ProfileEdit.tsx
│   │       │   │   ├── ProfileForm.tsx
│   │       │   │   ├── ProfileView.tsx
│   │       │   │   ├── ReviewHistory.tsx
│   │       │   │   └── hooks
│   │       │   │       └── useUserProfile.ts
│   │       │   └── page.tsx
│   │       ├── search
│   │       │   ├── components
│   │       │   │   ├── FilterModal.tsx
│   │       │   │   ├── MapView.tsx
│   │       │   │   ├── SearchBar.tsx
│   │       │   │   ├── SearchResults.tsx
│   │       │   │   ├── TrendDisplay.tsx
│   │       │   │   ├── TrendTags.tsx
│   │       │   │   └── TrendingSearches.tsx
│   │       │   └── page.tsx
│   │       └── therapists
│   │           ├── [therapistId]
│   │           │   ├── components
│   │           │   │   ├── MediaGallery.tsx
│   │           │   │   ├── ReviewList.tsx
│   │           │   │   ├── TherapistAvailability.tsx
│   │           │   │   └── TherapistDetail.tsx
│   │           │   └── page.tsx
│   │           ├── components
│   │           │   ├── FilterPanel.tsx
│   │           │   ├── TherapistCard.tsx
│   │           │   ├── TherapistFilter.tsx
│   │           │   ├── TherapistList.tsx
│   │           │   └── TherapistMap.tsx
│   │           └── page.tsx
│   ├── backend
│   │   └── api
│   │       └── graphql
│   │           ├── availability.ts
│   │           ├── bookings.ts
│   │           ├── error-logs.ts
│   │           ├── events.ts
│   │           ├── index.ts
│   │           ├── likes.ts
│   │           ├── local-experiences.ts
│   │           ├── media.ts
│   │           ├── reviews.ts
│   │           ├── services.ts
│   │           ├── therapists.ts
│   │           ├── transactions.ts
│   │           ├── trends.ts
│   │           └── users.ts
│   ├── realtime
│   │   ├── availability-listener.ts
│   │   ├── bookings-listener.ts
│   │   ├── chat-listener.ts
│   │   ├── likes-listener.ts
│   │   ├── notifications-listener.ts
│   │   └── profile-listener.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── theme.ts
│   ├── types
│   │   ├── activity-log.ts
│   │   ├── auth.ts
│   │   ├── availability.ts
│   │   ├── booking.ts
│   │   ├── chat.ts
│   │   ├── enums.ts
│   │   ├── error-log.ts
│   │   ├── event.ts
│   │   ├── graphql.ts
│   │   ├── like.ts
│   │   ├── local-experience.ts
│   │   ├── lodash.d.ts
│   │   ├── match.ts
│   │   ├── media.ts
│   │   ├── next-auth.d.ts
│   │   ├── next-i18next.d.ts
│   │   ├── notification.ts
│   │   ├── post.ts
│   │   ├── preference.ts
│   │   ├── react-window.d.ts
│   │   ├── review.ts
│   │   ├── therapist.ts
│   │   ├── tourist.ts
│   │   ├── transaction.ts
│   │   ├── user.ts
│   │   ├── ws.d.ts
│   │   └── zen-observable-ts.d.ts
│   └── utils
│       ├── auth.ts
│       ├── hasura-client.ts
│       └── supabase
│           └── server.ts
├── supabase
│   └── config.toml
├── tailwind.config.js
└── tsconfig.json

---

## 今後の展望

Sppaは、バリ島に根ざしたサービスから始まり、世界各国のユーザーに愛されるプラットフォームへと成長することを目指します。

- **グローバル展開:**  
  オーストラリア、ドイツ、フランス、韓国、日本、中国など主要国への展開を進め、ユーザーに最適な体験を提供します。

- **多言語対応の強化:**  
  英語、インドネシア語、ドイツ語、フランス語、韓国語、日本語、中国語を基本とし、その他の言語にも柔軟に対応します。

- **プロダクト進化:**  
  ユーザーからのフィードバックを元に、機能追加や改善を継続的に実施。新たな技術やデザインを取り入れ、常に最先端の体験を提供します。

- **IPOを視野にした成長:**  
  創業メンバーとしての参加と、将来的なストックオプションによるリターンのシェアで、あなたの貢献がSppaの株価上昇に直結する仕組みを構築します。

---

## お問い合わせ・参加方法

- **参加方法:**  
  まずはGitHub上のDiscussionsやIssuesに積極的に参加し、あなたの意見やアイデアをどんどん共有してください。  
  初回のコミットが確認された時点で、リポジトリの管理権限（Admin相当）を即座に付与いたします。

- **リアルタイムのコミュニケーション:**  
  日々のディスカッションや緊急連絡にはSlackを利用しています。  
  下記の招待リンクからSlackに参加し、**# sppa** チャネル（チャネルID: C08L0QQ5Q7J）で、メンバー同士の交流を深めましょう。  
  [Slack招待リンク](https://join.slack.com/t/sppaworld/shared_invite/zt-2dx91m6hy-cf6BsjfIyMQ4BS6PewjV1w)

- **その他のお問い合わせ:**  
  - バグ報告や機能提案はGitHub Issuesから。  
  - 参加希望やストックオプションについては、[tani.party@gmail.com)までご連絡ください。

---

## あなたの力で未来を切り拓こう

Sppaは、あなたの技術と情熱によって進化するプラットフォームです。  
自主的なコミュニティとして、互いに刺激し合い、協力しながら最高のSNSを創り上げましょう。  
**創業メンバーとして参加し、共にSppaを世界標準のサービスへと育て上げる仲間を心からお待ちしています。**

さあ、あなたのアイデアとスキルで、未来のSppaを共に創りましょう！
