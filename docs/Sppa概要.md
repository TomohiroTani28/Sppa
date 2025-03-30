## 🚩 プロジェクト概要
- **プロジェクト名：** Sppa
- **目的：** バリ島のセラピストと外国人観光客をつなぐリアルタイム型コンテンツファーストSNS
- **主要機能：** リアルタイム通信、予約管理、レビュー、通知、翻訳、地域連携
- **ターゲットユーザー：** セラピスト（バリ在住）、外国人観光客（英語圏・インドネシア語圏）
- **主要画面構成：**
  - ホームフィード
  - 検索・発見
  - 施術詳細
  - チャット（リアルタイム翻訳付き）
  - 予約管理（セラピスト・観光客別）
  - プロフィール管理（セラピスト・観光客別）

---

## 🚩 技術スタック
- **フレームワーク・言語：** Next.js (App Router), TypeScript
- **デザイン・UI：** Shadcn/UI, Tailwind CSS
- **データベース・API：** PostgreSQL + Hasura（GraphQL）
- **リアルタイム通信：** Hasura Subscriptions
- **ファイル管理：** Supabase Storage
- **ホスティング：** Cloudflare Pages
- **翻訳ライブラリ：** LibreTranslate
- **CI/CD・セキュリティ：** GitHub Actions, Cloudflare WAF

---

## 🚩ディレクトリ構造（重要箇所）
```
Sppa
├── Dockerfile
├── README.md
├── bug_report.md
├── config
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── pg_hba.conf
├── docs
│   └── Sppa概要.md
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
│   └── seeds
│       └── default
│           └── 1741574725086_initial_data.sql
├── middleware.ts
├── next-env.d.ts
├── next-i18next.config.js
├── next.config.js
├── package.json
├── postcss.config.js
├── public
│   └── images
│       ├── event1.jpg
│       ├── event2.jpg
│       ├── event3.jpg
│       ├── favicon.ico
│       ├── sppa.png
│       ├── sppa2.png
│       ├── technology_stack.png
│       ├── user1.jpg
│       └── user2.jpg
├── scripts
│   ├── dev
│   │   ├── organize_sppa_dirs.sh
│   │   └── server.js
│   ├── generate
│   │   └── api-template.hbs
│   ├── generate-api-from-permissions.js
│   ├── logs
│   │   ├── migration_log.txt
│   │   └── output.txt
│   └── migrations
│       └── script.sql
├── src
│   ├── app
│   │   ├── (common)
│   │   │   ├── chat
│   │   │   │   ├── [userId]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── AutoTranslate.tsx
│   │   │   │   │   ├── AutoTranslateToggle.tsx
│   │   │   │   │   ├── ChatWindow.tsx
│   │   │   │   │   ├── EmergencyContact.tsx
│   │   │   │   │   ├── MediaShare.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   ├── MessageInput.tsx
│   │   │   │   │   ├── MessageList.tsx
│   │   │   │   │   ├── OnlineTherapists.tsx
│   │   │   │   │   ├── PriorityMessage.tsx
│   │   │   │   │   ├── RecentConversations.tsx
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   └── TemplateMessage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   ├── LocationService.ts
│   │   │   │   └── TouristLayout.tsx
│   │   │   ├── feed
│   │   │   │   ├── components
│   │   │   │   │   ├── FeedList.tsx
│   │   │   │   │   ├── MasonryFeed.tsx
│   │   │   │   │   ├── MultiLanguageSupport.tsx
│   │   │   │   │   ├── OfferCarousel.tsx
│   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   ├── RealTimeAvailabilityBadge.tsx
│   │   │   │   │   ├── RecommendedExperiences.tsx
│   │   │   │   │   ├── RecommendedTherapists.tsx
│   │   │   │   │   ├── TabSelector.tsx
│   │   │   │   │   ├── TranslationToggle.tsx
│   │   │   │   │   └── WelcomeMessage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── likes
│   │   │   │   └── components
│   │   │   │       ├── LikeButton.tsx
│   │   │   │       └── MatchList.tsx
│   │   │   ├── notifications
│   │   │   │   ├── components
│   │   │   │   │   ├── NotificationList.tsx
│   │   │   │   │   └── components
│   │   │   │   │       └── NotificationListStatic.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── search
│   │   │   │   ├── components
│   │   │   │   │   ├── FilterModal.tsx
│   │   │   │   │   ├── FilterPanel.tsx
│   │   │   │   │   ├── MapView.tsx
│   │   │   │   │   ├── RealTimeAvailabilityIndicator.tsx
│   │   │   │   │   ├── ResultCard.tsx
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── SearchResults.tsx
│   │   │   │   │   ├── TherapistCard.tsx
│   │   │   │   │   ├── TrendDisplay.tsx
│   │   │   │   │   ├── TrendTags.tsx
│   │   │   │   │   └── TrendingSearches.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── therapists
│   │   │   │   └── [therapistId]
│   │   │   │       ├── MediaGallery.tsx
│   │   │   │       ├── ReviewList.tsx
│   │   │   │       ├── TherapistAvailability.tsx
│   │   │   │       ├── TherapistDetail.tsx
│   │   │   │       └── components
│   │   │   │           ├── BookingButton.tsx
│   │   │   │           ├── FilterPanel.tsx
│   │   │   │           ├── RealTimeStatus.tsx
│   │   │   │           ├── ReviewList.tsx
│   │   │   │           ├── ServiceDetails.tsx
│   │   │   │           ├── TherapistCard.tsx
│   │   │   │           ├── TherapistFilter.tsx
│   │   │   │           ├── TherapistList.tsx
│   │   │   │           ├── TherapistMap.tsx
│   │   │   │           └── TherapistProfile.tsx
│   │   │   └── treatment
│   │   │       └── [id]
│   │   │           └── page.tsx
│   │   ├── (therapist)
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
│   │   ├── (tourist)
│   │   │   ├── bookings
│   │   │   │   ├── components
│   │   │   │   │   ├── AddOption.tsx
│   │   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   │   ├── BookingCard.tsx
│   │   │   │   │   ├── BookingDetailModal.tsx
│   │   │   │   │   ├── BookingForm.tsx
│   │   │   │   │   ├── BookingList.tsx
│   │   │   │   │   ├── CancelPolicy.tsx
│   │   │   │   │   ├── MyBookingsList.tsx
│   │   │   │   │   ├── RealTimeAvailability.tsx
│   │   │   │   │   ├── ReminderNotification.tsx
│   │   │   │   │   └── TransactionDetails.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── local-experiences
│   │   │   │   ├── [experienceId]
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── MediaGallery.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── ExperienceCard.tsx
│   │   │   │   │   └── ExperienceList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── preferences
│   │   │   │   ├── components
│   │   │   │   │   └── PreferenceForm.tsx
│   │   │   │   └── page.tsx
│   │   │   └── profile
│   │   │       ├── components
│   │   │       │   ├── DarkModeToggle.tsx
│   │   │       │   ├── PaymentMethod.tsx
│   │   │       │   ├── PreferencesForm.tsx
│   │   │       │   ├── ProfileEdit.tsx
│   │   │       │   ├── ProfileForm.tsx
│   │   │       │   ├── ProfileView.tsx
│   │   │       │   └── ReviewHistory.tsx
│   │   │       └── page.tsx
│   │   ├── ApolloWrapper.tsx
│   │   ├── api
│   │   │   ├── activity-logs
│   │   │   │   └── route.ts
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   ├── error-logs
│   │   │   │   └── route.ts
│   │   │   ├── events
│   │   │   │   └── route.ts
│   │   │   ├── experiences
│   │   │   │   └── route.ts
│   │   │   ├── graphql
│   │   │   │   └── route.ts
│   │   │   ├── graphql-fallback
│   │   │   │   └── route.ts
│   │   │   ├── notifications
│   │   │   │   └── unread
│   │   │   │       └── route.ts
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
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── signup
│   │       └── page.tsx
│   ├── backend
│   │   └── api
│   │       ├── generated-api.ts
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
│   ├── components
│   │   ├── Avatar.tsx
│   │   ├── BookingButton.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── EventCard.tsx
│   │   ├── FeedFilters.tsx
│   │   ├── HomeContent.tsx
│   │   ├── HomeHeader.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MediaDisplay.tsx
│   │   ├── MediaGallery.tsx
│   │   ├── MultiLanguageSupport.tsx
│   │   ├── NotificationItem.tsx
│   │   ├── OfferCarousel.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── PushNotification.tsx
│   │   ├── RatingStars.tsx
│   │   ├── RecommendedExperiences.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ServiceBadge.tsx
│   │   ├── ServiceDetails.tsx
│   │   ├── TeaserCard.tsx
│   │   ├── TherapistAvailabilityPanel.tsx
│   │   ├── TherapistAvailabilityStatus.tsx
│   │   └── ui
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Calendar.tsx
│   │       ├── Card.tsx
│   │       ├── Checkbox.tsx
│   │       ├── DatePicker.tsx
│   │       ├── Dialog.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── Form.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       ├── Navbar.tsx
│   │       ├── Select.tsx
│   │       ├── Spinner.tsx
│   │       ├── Switch.tsx
│   │       ├── Text.tsx
│   │       └── Toast.tsx
│   ├── contexts
│   │   └── ChatContext.tsx
│   ├── graphql
│   │   └── queries.ts
│   ├── hooks
│   │   ├── api
│   │   │   ├── availability.ts
│   │   │   ├── index.ts
│   │   │   ├── useActivityLogging.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useCreateBooking.ts
│   │   │   ├── useCreateEvent.ts
│   │   │   ├── useCreateReview.ts
│   │   │   ├── useCreateTransaction.ts
│   │   │   ├── useErrorLogApi.ts
│   │   │   ├── useFetchEvents.ts
│   │   │   ├── useFetchFilters.ts
│   │   │   ├── useFetchLocalExperiences.ts
│   │   │   ├── useFetchMedia.ts
│   │   │   ├── useFetchReviews.ts
│   │   │   ├── useFetchSearchResults.ts
│   │   │   ├── useFetchServiceCategories.ts
│   │   │   ├── useFetchServices.ts
│   │   │   ├── useFetchTherapistLocations.ts
│   │   │   ├── useFetchTherapists.ts
│   │   │   ├── useFetchTrends.ts
│   │   │   ├── useFetchUser.ts
│   │   │   ├── useIsomorphicLayoutEffect.ts
│   │   │   ├── useLikeTherapist.ts
│   │   │   ├── useLikeUser.ts
│   │   │   ├── useMatchList.ts
│   │   │   ├── useMedia.ts
│   │   │   ├── useNotificationsApi.ts
│   │   │   ├── useRealtimeAvailability.ts
│   │   │   ├── useServices.ts
│   │   │   ├── useTherapistAvailabilityApi.ts
│   │   │   ├── useTherapistData.tsx
│   │   │   ├── useTherapistSearch.ts
│   │   │   ├── useTransactions.ts
│   │   │   ├── useTrends.ts
│   │   │   ├── useUnreadNotifications.ts
│   │   │   ├── useUpdateUser.ts
│   │   │   ├── useUser.ts
│   │   │   └── users.ts
│   │   ├── realtime
│   │   ├── ui
│   │   │   └── useBottomSheet.ts
│   │   ├── useAutoTranslation.ts
│   │   ├── useBookingNotifications.ts
│   │   ├── useFeedData.ts
│   │   ├── useFeedStore.ts
│   │   ├── useHomeData.ts
│   │   ├── useLocalExperiences.ts
│   │   ├── useLocationService.ts
│   │   ├── useMyBookings.ts
│   │   ├── useNotificationCount.ts
│   │   ├── useNotificationState.ts
│   │   ├── useOnlineUsers.ts
│   │   ├── usePageData.ts
│   │   ├── usePosts.ts
│   │   ├── useRealTimeAvailability.ts
│   │   ├── useRealTimeReviews.ts
│   │   ├── useRealtimeChat.ts
│   │   ├── useRecentChats.ts
│   │   ├── useSearchResults.ts
│   │   ├── useSearchUsers.ts
│   │   ├── useTherapistAvailability.ts
│   │   ├── useTherapistDetails.ts
│   │   ├── useTherapistErrorEffect.ts
│   │   ├── useTherapistSearch.ts
│   │   ├── useUserPreferences.ts
│   │   ├── useUserProfile.ts
│   │   └── useWebSocketSubscription.ts
│   ├── i18n
│   │   ├── I18nProvider.tsx
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── settings.ts
│   ├── lib
│   │   ├── auth.client.ts
│   │   ├── auth.server.ts
│   │   ├── create-ws-client.ts
│   │   ├── currency-utils.ts
│   │   ├── date-utils.ts
│   │   ├── enum-utils.ts
│   │   ├── geoUtils.ts
│   │   ├── hasura-client.ts
│   │   ├── i18n.ts
│   │   ├── queries
│   │   │   ├── media.ts
│   │   │   ├── post.ts
│   │   │   ├── service.ts
│   │   │   ├── therapistAvailability.ts
│   │   │   └── user.ts
│   │   ├── storage-utils.ts
│   │   ├── string-utils.ts
│   │   ├── supabase-client.ts
│   │   └── utils.ts
│   ├── locales
│   │   ├── en.json
│   │   └── id.json
│   ├── realtime
│   │   ├── RealtimeBookingList.tsx
│   │   ├── RealtimeEventList.tsx
│   │   ├── RealtimeMatchList.tsx
│   │   ├── TherapistAvailabilityPanel.tsx
│   │   ├── TherapistAvailabilityStatus.tsx
│   │   ├── availability-listener.ts
│   │   ├── bookings-listener.ts
│   │   ├── chat-listener.ts
│   │   ├── index.ts
│   │   ├── likes-listener.ts
│   │   ├── notifications-listener.ts
│   │   ├── notifications-push.tsx
│   │   ├── profile-listener.ts
│   │   ├── useNotifications.ts
│   │   ├── useRealtimeAvailability.ts
│   │   ├── useRealtimeBookings.ts
│   │   ├── useRealtimeChat.ts
│   │   ├── useRealtimeEvents.ts
│   │   ├── useRealtimeFeedUpdates.ts
│   │   ├── useRealtimeMatchList.ts
│   │   ├── useRealtimeReviews.ts
│   │   ├── useRealtimeTransactions.ts
│   │   └── useTherapistAvailability.ts
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
│   │   ├── next-i18next.d.ts
│   │   ├── notification.ts
│   │   ├── post.ts
│   │   ├── preference.ts
│   │   ├── react-window.d.ts
│   │   ├── review.ts
│   │   ├── shadcn__ui.d.ts
│   │   ├── therapist.ts
│   │   ├── tourist.ts
│   │   ├── transaction.ts
│   │   ├── user.ts
│   │   ├── ws.d.ts
│   │   └── zen-observable-ts.d.ts
│   └── utils
│       ├── auth.ts
│       └── supabase
│           └── server.ts
├── supabase
│   └── config.toml
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚩 API・リアルタイム機能の仕様
- GraphQLを使った統一されたAPI設計
- Hasura Subscriptionsでリアルタイム処理を最適化
- いいね、マッチング、チャット、予約のリアルタイム処理を含む

### GraphQLサンプル
```graphql
query GetTherapistProfile($id: UUID!) {
  therapist_profiles_by_pk(id: $id) {
    id
    user_id
    bio
    languages
    working_hours
    status
  }
}

subscription OnTherapistAvailability($therapistId: UUID!) {
  therapist_availability(where: {therapist_id: {_eq: $therapistId}}) {
    id
    start_time
    end_time
    is_available
  }
}
```

---

## 🚩 データ型定義（TypeScript）
```typescript
export interface TherapistProfile {
  id: string;
  userId: string;
  bio?: string;
  languages: string[];
  workingHours: WorkingHour[];
  status: "online" | "offline" | "busy" | "vacation";
}

export interface WorkingHour {
  day: string;
  startTime: string;
  endTime: string;
}
```

---

## 🚩 UI/UXデザインのガイドライン
- AirbnbやBooking.comを意識したモダンかつミニマルデザイン
- 白基調、アクセントカラー (#007aff)
- レスポンシブ対応必須
- アイコン多用で直感的なノンバーバルデザイン

---

## 🚩 コーディング規約
- ESLint、Prettier標準設定
- インデント: 2スペース
- コンポーネント: PascalCase、関数型のみ
- ファイル・フォルダ: ケバブケース
- JSDocスタイルのコメント
- 専用カスタムフックでデータフェッチ管理
- Zustandを使用した状態管理

---

## 🚩 共通コンポーネント例
```tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded px-4 py-2 transition-colors',
        variant === 'default' && 'bg-blue-500 text-white',
        variant === 'outline' && 'border border-gray-300 text-gray-700',
        className
      )}
      {...props}
    />
  );
}
```

---

## 🚩 リアルタイム処理方針
- GraphQL Subscriptionsを使い、シンプルでスケーラブルなリアルタイム更新
- 専用のメッセージングサービス不要
- 翻訳結果キャッシュを実装してAPI利用を最適化

---

## 🚩 セキュリティ・権限管理
- Cloudflare WAFで基本的な保護
- Hasuraによるロールベースの認可設定
- GitHub Actionsを使ったCI/CD

---

## 🚩 ChatGPTへの具体的な依頼例
- 上記の仕様・構成に従い、高品質なNext.jsコンポーネントを作成してください。
- 提供したGraphQL APIとTypeScript型を使用して、統一感あるコードに仕上げてください。
- エラー処理、ロード中の状態、リアルタイム更新を明示的に実装してください。
- コンポーネントは再利用性を考慮し、必要に応じてカスタムフックを作成してください。
- 国際化(i18n)を考慮し、テキストはJSONファイルから取得してください。

---



-- hasura/migrations/sppa/20250226120000_create_tables.sql
-- ============================================
-- Sppa Database Schema (Fully Optimized, Final)
-- ============================================
-- Notes:
-- - UUIDを主キーとして使用し、gen_random_uuid()で自動生成。
-- - 外部キー制約でデータ整合性を確保。
-- - 列挙型（ENUM）を活用してデータの型安全性を向上。
-- - リアルタイム対応のため、created_atとupdated_atを標準装備。

-- ==========================================================
-- 1. ENUM Types
-- ==========================================================
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('therapist', 'tourist');

DROP TYPE IF EXISTS booking_status CASCADE;
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled', 'completed');

DROP TYPE IF EXISTS media_type_enum CASCADE;
CREATE TYPE media_type_enum AS ENUM ('photo', 'video');

DROP TYPE IF EXISTS payment_status_enum CASCADE;
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed');

DROP TYPE IF EXISTS notification_type_enum CASCADE;
CREATE TYPE notification_type_enum AS ENUM ('like', 'match', 'booking_update', 'review', 'payment', 'promotion', 'chat');

DROP TYPE IF EXISTS therapist_status_enum CASCADE;
CREATE TYPE therapist_status_enum AS ENUM ('online', 'offline', 'busy', 'vacation');

DROP TYPE IF EXISTS payment_method_enum CASCADE;
CREATE TYPE payment_method_enum AS ENUM ('credit_card', 'paypal', 'stripe', 'cash', 'other');

DROP TYPE IF EXISTS review_type_enum CASCADE;
CREATE TYPE review_type_enum AS ENUM ('service', 'general');

DROP TYPE IF EXISTS media_access_level CASCADE;
CREATE TYPE media_access_level AS ENUM ('public', 'private');

DROP TYPE IF EXISTS activity_type CASCADE;
CREATE TYPE activity_type AS ENUM ('login', 'logout', 'update_profile', 'booking_created', 'review_posted');

DROP TYPE IF EXISTS post_type CASCADE;
CREATE TYPE post_type AS ENUM ('service', 'review', 'question', 'general');

DROP TYPE IF EXISTS currency_enum CASCADE;
CREATE TYPE currency_enum AS ENUM ('USD', 'EUR', 'JPY', 'SGD', 'AUD');

-- ==========================================================
-- 2. USERS
-- ==========================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    profile_picture TEXT,
    phone_number TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 3. THERAPIST PROFILES
-- ==========================================================
CREATE TABLE therapist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER,
    location TEXT,
    languages TEXT[] DEFAULT '{}',
    certifications JSONB,
    working_hours JSONB,
    status therapist_status_enum DEFAULT 'offline',
    last_online_at TIMESTAMPTZ,
    price_range_min DECIMAL,
    price_range_max DECIMAL,
    currency currency_enum,
    business_name TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 4. TOURIST PROFILES
-- ==========================================================
CREATE TABLE tourist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nationality TEXT,
    languages TEXT[] DEFAULT '{}',
    interests JSONB,
    travel_dates JSONB,
    budget DECIMAL,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 5. THERAPIST AVAILABILITY
-- ==========================================================
CREATE TABLE therapist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    recurrence_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 6. THERAPIST SERVICES
-- ==========================================================
CREATE TABLE therapist_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    description TEXT,
    duration INTEGER,
    price DECIMAL NOT NULL,
    currency currency_enum NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 7. BOOKINGS
-- ==========================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES therapist_services(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status DEFAULT 'pending',
    booking_notes TEXT,
    confirmed_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 8. LIKES
-- ==========================================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(guest_id, therapist_id)
);

-- ==========================================================
-- 9. MATCHES
-- ==========================================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(guest_id, therapist_id)
);

-- ==========================================================
-- 10. MEDIA
-- ==========================================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_type media_type_enum NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    access_level media_access_level DEFAULT 'public',
    is_profile_image BOOLEAN DEFAULT FALSE,
    is_service_image BOOLEAN DEFAULT FALSE,
    is_review_image BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 11. REVIEWS
-- ==========================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL NOT NULL,
    comment TEXT,
    review_type review_type_enum DEFAULT 'service',
    media_urls JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 12. TRANSACTIONS
-- ==========================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    currency currency_enum NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    payment_method payment_method_enum,
    gateway_transaction_id VARCHAR(255),
    transaction_date TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 13. USER_PREFERENCES
-- ==========================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_services TEXT[],
    preferred_duration INTEGER,
    preferred_budget DECIMAL,
    preferred_languages TEXT[],
    gender_preference TEXT,
    amenities_preference JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 14. NOTIFICATIONS
-- ==========================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    message TEXT,
    details JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 15. EVENTS
-- ==========================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    discount_percentage DECIMAL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 16. LOCAL_EXPERIENCES
-- ==========================================================
CREATE TABLE local_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    price DECIMAL,
    currency currency_enum,
    duration INTEGER,
    languages TEXT[] DEFAULT '{}',
    available_dates JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 17. ACTIVITY_LOGS
-- ==========================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    description TEXT,
    request_details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 18. ERROR_LOGS
-- ==========================================================
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_type TEXT NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    request_details JSONB,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 19. SERVICE_CATEGORIES
-- ==========================================================
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 20. LOCAL_EXPERIENCE_CATEGORIES
-- ==========================================================
CREATE TABLE local_experience_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_category_id UUID REFERENCES local_experience_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 21. REGIONS
-- ==========================================================
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    geojson JSONB,
    parent_region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 22. UNAVAILABLE_DATES
-- ==========================================================
CREATE TABLE unavailable_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 23. SERVICE_MEDIA
-- ==========================================================
CREATE TABLE service_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES therapist_services(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 24. EVENT_MEDIA
-- ==========================================================
CREATE TABLE event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 25. LOCAL_EXPERIENCE_MEDIA
-- ==========================================================
CREATE TABLE local_experience_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    local_experience_id UUID REFERENCES local_experiences(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 26. APPLICATION_SETTINGS
-- ==========================================================
CREATE TABLE application_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 27. REALTIME_MESSAGES
-- ==========================================================
CREATE TABLE realtime_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    translated_content JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 28. STORAGE_BUCKETS & STORAGE_OBJECTS
-- ==========================================================
CREATE TABLE storage_buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE storage_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
    object_path TEXT NOT NULL,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    mime_type TEXT NOT NULL,
    size INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 29. POSTS
-- ==========================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    post_type post_type DEFAULT 'general',
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- Indexes (パフォーマンス最適化)
-- ==========================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_therapist_profiles_user_id ON therapist_profiles(user_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_therapist_id ON bookings(therapist_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_realtime_messages_sender_id ON realtime_messages(sender_id);
CREATE INDEX idx_realtime_messages_receiver_id ON realtime_messages(receiver_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_therapist_id_start_time ON bookings(therapist_id, start_time);

-- ==========================================================
-- END OF SCHEMA
-- ==========================================================




tables:
  # Users table: ユーザー情報の基本テーブル
  - table:
      name: users
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "name", "role", "profile_picture", "created_at", "updated_at", "verified_at", "phone_number"]
          filter: {}
          allow_aggregations: true
      - role: tourist
        permission:
          columns: ["id", "name", "role", "profile_picture", "created_at", "verified_at", "phone_number"]
          filter: {}
          allow_aggregations: true
    insert_permissions:
      - role: therapist
        permission:
          columns: ["name", "email", "password_hash", "role", "profile_picture", "phone_number"]
          check: { role: { _eq: "therapist" } }
      - role: tourist
        permission:
          columns: ["name", "email", "password_hash", "role", "profile_picture", "phone_number"]
          check: { role: { _eq: "tourist" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["name", "profile_picture", "phone_number"]
          filter: { id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["name", "profile_picture", "phone_number"]
          filter: { id: { _eq: "X-Hasura-User-Id" } }

  # Posts: 投稿管理（SNSフィード用）
  - table:
      name: posts
      schema: public
    configuration:
      realtime: true
    object_relationships:
      - name: user
        using:
          foreign_key_constraint_on: user_id
      - name: media
        using:
          foreign_key_constraint_on: media_id
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "user_id", "content", "post_type", "location", "created_at", "updated_at"]
          filter: {}
          allow_aggregations: true
      - role: tourist
        permission:
          columns: ["id", "user_id", "content", "post_type", "location", "created_at", "updated_at"]
          filter: {}
          allow_aggregations: true
    insert_permissions:
      - role: therapist
        permission:
          columns: ["user_id", "content", "media_id", "post_type", "location"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["user_id", "content", "media_id", "post_type", "location"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["content", "media_id", "post_type", "location"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["content", "media_id", "post_type", "location"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Media: メディアファイル管理
  - table:
      name: media
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "therapist_id", "media_type", "url", "caption", "created_at", "is_profile_image", "is_service_image", "is_review_image"]
          filter: { access_level: { _eq: "public" } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["therapist_id", "media_type", "url", "caption", "is_profile_image", "is_service_image", "is_review_image", "access_level"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["caption", "access_level"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Therapist Profiles: セラピストの詳細プロフィール
  - table:
      name: therapist_profiles
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "user_id", "bio", "experience_years", "location", "languages", "certifications", "working_hours", "status", "last_online_at", "price_range_min", "price_range_max", "currency", "business_name", "address"]
          filter: {}
          allow_aggregations: true
      - role: tourist
        permission:
          columns: ["id", "user_id", "bio", "experience_years", "location", "languages", "certifications", "working_hours", "status", "last_online_at", "price_range_min", "price_range_max", "currency", "business_name", "address"]
          filter: {}
          allow_aggregations: true
    insert_permissions:
      - role: therapist
        permission:
          columns: ["user_id", "bio", "experience_years", "location", "languages", "certifications", "working_hours", "price_range_min", "price_range_max", "currency", "business_name", "address", "status"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["bio", "experience_years", "location", "languages", "certifications", "working_hours", "price_range_min", "price_range_max", "currency", "business_name", "address", "status"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Tourist Profiles: 観光客の詳細プロフィール
  - table:
      name: tourist_profiles
      schema: public
    select_permissions:
      - role: tourist
        permission:
          columns: ["id", "user_id", "nationality", "languages", "interests", "travel_dates", "budget", "preferences"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: therapist
        permission:
          columns: ["id", "user_id", "nationality", "languages", "interests", "travel_dates", "budget", "preferences"]
          filter: {}
    insert_permissions:
      - role: tourist
        permission:
          columns: ["user_id", "nationality", "languages", "interests", "travel_dates", "budget", "preferences"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: tourist
        permission:
          columns: ["nationality", "languages", "interests", "travel_dates", "budget", "preferences"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Therapist Availability: セラピストの予約可能時間
  - table:
      name: therapist_availability
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "therapist_id", "start_time", "end_time", "is_available", "recurrence_rule"]
          filter: { is_available: { _eq: true } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["therapist_id", "start_time", "end_time", "is_available", "recurrence_rule"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["start_time", "end_time", "is_available", "recurrence_rule"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Therapist Services: セラピストが提供するサービス
  - table:
      name: therapist_services
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "therapist_id", "service_name", "description", "duration", "price", "currency", "category", "is_active", "created_at", "updated_at"]
          filter: { is_active: { _eq: true } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["therapist_id", "service_name", "description", "duration", "price", "currency", "category", "is_active"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["service_name", "description", "duration", "price", "currency", "category", "is_active"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Bookings: 予約情報
  - table:
      name: bookings
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: tourist
        permission:
          columns: ["guest_id", "therapist_id", "service_id", "start_time", "end_time", "booking_notes"]
          check: { guest_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["status", "confirmed_at", "completed_at"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["status", "canceled_at"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: tourist
        permission:
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }

  # Likes: いいね機能
  - table:
      name: likes
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "guest_id", "therapist_id", "created_at", "updated_at"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "guest_id", "therapist_id", "created_at", "updated_at"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: tourist
        permission:
          columns: ["guest_id", "therapist_id"]
          check: { guest_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: tourist
        permission:
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }

  # Matches: マッチング情報
  - table:
      name: matches
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "guest_id", "therapist_id", "matched_at", "created_at", "updated_at"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "guest_id", "therapist_id", "matched_at", "created_at", "updated_at"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["guest_id", "therapist_id", "matched_at"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Reviews: レビュー管理
  - table:
      name: reviews
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: tourist
        permission:
          columns: ["booking_id", "guest_id", "therapist_id", "rating", "comment", "review_type", "media_urls"]
          check: { guest_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: tourist
        permission:
          columns: ["rating", "comment", "media_urls"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: tourist
        permission:
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }

  # Transactions: 取引履歴
  - table:
      name: transactions
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { guest_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: tourist
        permission:
          columns: ["booking_id", "guest_id", "therapist_id", "amount", "currency", "payment_status", "payment_method", "gateway_transaction_id", "transaction_date"]
          check: { guest_id: { _eq: "X-Hasura-User-Id" } }

  # User Preferences: ユーザーの好み設定
  - table:
      name: user_preferences
      schema: public
    select_permissions:
      - role: tourist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: tourist
        permission:
          columns: ["user_id", "preferred_services", "preferred_duration", "preferred_budget", "preferred_languages", "gender_preference", "amenities_preference"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: tourist
        permission:
          columns: ["preferred_services", "preferred_duration", "preferred_budget", "preferred_languages", "gender_preference", "amenities_preference"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Notifications: 通知管理
  - table:
      name: notifications
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["user_id", "type", "message", "details", "is_read"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["user_id", "type", "message", "details", "is_read"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["is_read"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["is_read"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Events: イベント情報
  - table:
      name: events
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "therapist_id", "title", "description", "start_date", "end_date", "discount_percentage", "is_active", "created_at", "updated_at"]
          filter: { is_active: { _eq: true } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["therapist_id", "title", "description", "start_date", "end_date", "discount_percentage", "is_active"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["title", "description", "start_date", "end_date", "discount_percentage", "is_active"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Local Experiences: ローカル体験
  - table:
      name: local_experiences
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Activity Logs: アクティビティログ
  - table:
      name: activity_logs
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["user_id", "activity_type", "description", "request_details"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["user_id", "activity_type", "description", "request_details"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Error Logs: エラーログ
  - table:
      name: error_logs
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["*"]
          filter: { user_id: { _eq: "X-Hasura-User-Id" } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["user_id", "error_type", "message", "stack_trace", "request_details"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["user_id", "error_type", "message", "stack_trace", "request_details"]
          check: { user_id: { _eq: "X-Hasura-User-Id" } }

  # Service Categories: サービスカテゴリ
  - table:
      name: service_categories
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Local Experience Categories: ローカル体験カテゴリ
  - table:
      name: local_experience_categories
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Regions: 地域情報
  - table:
      name: regions
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Unavailable Dates: セラピストの予約不可日
  - table:
      name: unavailable_dates
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["id", "therapist_id", "start_date", "end_date"]
          filter: {}
    insert_permissions:
      - role: therapist
        permission:
          columns: ["therapist_id", "start_date", "end_date"]
          check: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["start_date", "end_date"]
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { therapist_id: { _eq: "X-Hasura-User-Id" } }

  # Service Media: サービス関連メディア
  - table:
      name: service_media
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { service_id: { _in: { _select: { columns: ["id"], table: { name: "therapist_services", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
      - role: tourist
        permission:
          columns: ["id", "service_id", "media_id", "order_index"]
          filter: {}
    insert_permissions:
      - role: therapist
        permission:
          columns: ["service_id", "media_id", "order_index"]
          check: { service_id: { _in: { _select: { columns: ["id"], table: { name: "therapist_services", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["order_index"]
          filter: { service_id: { _in: { _select: { columns: ["id"], table: { name: "therapist_services", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { service_id: { _in: { _select: { columns: ["id"], table: { name: "therapist_services", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }

  # Event Media: イベント関連メディア
  - table:
      name: event_media
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { event_id: { _in: { _select: { columns: ["id"], table: { name: "events", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
      - role: tourist
        permission:
          columns: ["id", "event_id", "media_id", "order_index"]
          filter: {}
    insert_permissions:
      - role: therapist
        permission:
          columns: ["event_id", "media_id", "order_index"]
          check: { event_id: { _in: { _select: { columns: ["id"], table: { name: "events", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["order_index"]
          filter: { event_id: { _in: { _select: { columns: ["id"], table: { name: "events", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { event_id: { _in: { _select: { columns: ["id"], table: { name: "events", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }

  # Local Experience Media: ローカル体験関連メディア
  - table:
      name: local_experience_media
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Realtime Messages: リアルタイムチャットメッセージ
  - table:
      name: realtime_messages
      schema: public
    configuration:
      realtime: true
    select_permissions:
      - role: therapist
        permission:
          columns: ["id", "sender_id", "receiver_id", "content", "translated_content", "is_read", "sent_at", "read_at", "created_at", "updated_at"]
          filter: { _or: [{ sender_id: { _eq: "X-Hasura-User-Id" } }, { receiver_id: { _eq: "X-Hasura-User-Id" } }] }
          allow_aggregations: true
      - role: tourist
        permission:
          columns: ["id", "sender_id", "receiver_id", "content", "translated_content", "is_read", "sent_at", "read_at", "created_at", "updated_at"]
          filter: { _or: [{ sender_id: { _eq: "X-Hasura-User-Id" } }, { receiver_id: { _eq: "X-Hasura-User-Id" } }] }
          allow_aggregations: true
    insert_permissions:
      - role: therapist
        permission:
          columns: ["sender_id", "receiver_id", "content", "translated_content"]
          check: { sender_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["sender_id", "receiver_id", "content", "translated_content"]
          check: { sender_id: { _eq: "X-Hasura-User-Id" } }
    update_permissions:
      - role: therapist
        permission:
          columns: ["is_read", "read_at"]
          filter: { receiver_id: { _eq: "X-Hasura-User-Id" } }
      - role: tourist
        permission:
          columns: ["is_read", "read_at"]
          filter: { receiver_id: { _eq: "X-Hasura-User-Id" } }

  # Storage Objects: Supabaseストレージオブジェクト
  - table:
      name: storage_objects
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: { media_id: { _in: { _select: { columns: ["id"], table: { name: "media", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
      - role: tourist
        permission:
          columns: ["id", "bucket_id", "object_path", "media_id", "mime_type", "size", "created_at", "updated_at"]
          filter: { media_id: { _in: { _select: { columns: ["id"], table: { name: "media", schema: "public" }, where: { access_level: { _eq: "public" } } } } } }
    insert_permissions:
      - role: therapist
        permission:
          columns: ["bucket_id", "object_path", "media_id", "mime_type", "size"]
          check: { media_id: { _in: { _select: { columns: ["id"], table: { name: "media", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }
    delete_permissions:
      - role: therapist
        permission:
          filter: { media_id: { _in: { _select: { columns: ["id"], table: { name: "media", schema: "public" }, where: { therapist_id: { _eq: "X-Hasura-User-Id" } } } } } }

  # Storage Buckets: Supabaseストレージバケット
  - table:
      name: storage_buckets
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}

  # Application Settings: アプリケーション設定
  - table:
      name: application_settings
      schema: public
    select_permissions:
      - role: therapist
        permission:
          columns: ["*"]
          filter: {}
      - role: tourist
        permission:
          columns: ["*"]
          filter: {}
