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

ディレクトリ構造が長いため、以下に折りたたみ可能な形で表示します。「クリックして展開」をクリックすると全体を確認できます。展開しても、以下の「技術スタック」や「セットアップ手順」などのコンテンツは表示されたままです。

<details>
<summary>クリックして展開</summary>

flowchart TB
    %% sppa 全体を一つのサブグラフにまとめる
    subgraph sppa
        %% トップレベルのファイル・フォルダ
        t1[%]
        t2[Dockerfile]
        t3[Sppa概要]
        t4[api-template.hbs]
        t5[config.yaml]
        t6[docker-compose.dev.yml]
        t7[docker-compose.prod.yml]
        
        %% hasura ディレクトリ
        subgraph t8[hasura]
            t8a[config.yaml]
            subgraph t8b[metadata]
                t8b1[actions.graphql]
                t8b2[actions.yaml]
                t8b3[allow_list.yaml]
                t8b4[api_limits.yaml]
                t8b5[backend_configs.yaml]
                t8b6[cron_triggers.yaml]

                subgraph t8b7[databases]
                    t8b7a[databases.yaml]

                    subgraph t8b7b[default]
                        subgraph t8b7c[tables]
                            t8b7c1[public_activity_logs.yaml]
                            t8b7c2[public_application_settings.yaml]
                            t8b7c3[public_bookings.yaml]
                            t8b7c4[public_error_logs.yaml]
                            t8b7c5[public_event_media.yaml]
                            t8b7c6[public_events.yaml]
                            t8b7c7[public_geography_columns.yaml]
                            t8b7c8[public_geometry_columns.yaml]
                            t8b7c9[public_likes.yaml]
                            t8b7c10[public_local_experience_categories.yaml]
                            t8b7c11[public_local_experience_media.yaml]
                            t8b7c12[public_local_experiences.yaml]
                            t8b7c13[public_matches.yaml]
                            t8b7c14[public_media.yaml]
                            t8b7c15[public_notifications.yaml]
                            t8b7c16[public_posts.yaml]
                            t8b7c17[public_realtime_messages.yaml]
                            t8b7c18[public_regions.yaml]
                            t8b7c19[public_reviews.yaml]
                            t8b7c20[public_service_categories.yaml]
                            t8b7c21[public_service_media.yaml]
                            t8b7c22[public_spatial_ref_sys.yaml]
                            t8b7c23[public_storage_buckets.yaml]
                            t8b7c24[public_storage_objects.yaml]
                            t8b7c25[public_therapist_availability.yaml]
                            t8b7c26[public_therapist_profiles.yaml]
                            t8b7c27[public_therapist_services.yaml]
                            t8b7c28[public_tourist_profiles.yaml]
                            t8b7c29[public_transactions.yaml]
                            t8b7c30[public_unavailable_dates.yaml]
                            t8b7c31[public_user_preferences.yaml]
                            t8b7c32[public_users.yaml]
                            t8b7c33[tables.yaml]
                        end
                    end
                end

                t8b8[graphql_schema_introspection.yaml]
                t8b9[inherited_roles.yaml]
                t8b10[metrics_config.yaml]
                t8b11[network.yaml]
                t8b12[opentelemetry.yaml]
                t8b13[permission.yaml]
                t8b14[query_collections.yaml]
                t8b15[remote_schemas.yaml]
                t8b16[rest_endpoints.yaml]
                t8b17[version.yaml]
            end

            subgraph t8c[migrations]
                subgraph t8c1[default]
                    subgraph t8c11[1742053444159_init]
                        t8c11a[up.sql]
                    end
                    subgraph t8c12[1742054367761_init]
                        t8c12a[up.sql]
                    end
                    t8c13[20250226120000_create_tables.sql]
                end
            end

            t8d[output.txt]
            t8e[payload:{headers:Authorization:Bearer <your-token>}]
            t8f[payload:{headers:Authorization:Bearer eyJhbGci...}]
            t8g[payload:{headers:x-hasura-role:tourist}]

            subgraph t8h[seeds]
                subgraph t8h1[default]
                    t8h1a[1741574725086_initial_data.sql]
                end
            end

            t8i[type:connection_init]
        end

        %% metadata ディレクトリ
        subgraph t9[metadata]
            t9a[actions.graphql]
            t9b[actions.yaml]
            t9c[allow_list.yaml]
            t9d[api_limits.yaml]
            t9e[backend_configs.yaml]
            t9f[cron_triggers.yaml]

            subgraph t9g[databases]
                t9g1[databases.yaml]

                subgraph t9g2[default]
                    subgraph t9g3[tables]
                        t9g3a[public_geography_columns.yaml]
                        t9g3b[public_geometry_columns.yaml]
                        t9g3c[public_spatial_ref_sys.yaml]
                        t9g3d[tables.yaml]
                    end
                end

                subgraph t9g4[sppa]
                    subgraph t9g5[tables]
                        t9g5a[pgsodium_decrypted_key.yaml]
                        t9g5b[pgsodium_key.yaml]
                        t9g5c[pgsodium_mask_columns.yaml]
                        t9g5d[pgsodium_masking_rule.yaml]
                        t9g5e[pgsodium_valid_key.yaml]
                        t9g5f[public_activity_logs.yaml]
                        t9g5g[public_application_settings.yaml]
                        t9g5h[public_bookings.yaml]
                        t9g5i[public_error_logs.yaml]
                        t9g5j[public_event_media.yaml]
                        t9g5k[public_events.yaml]
                        t9g5l[public_likes.yaml]
                        t9g5m[public_local_experience_categories.yaml]
                        t9g5n[public_local_experience_media.yaml]
                        t9g5o[public_local_experiences.yaml]
                        t9g5p[public_matches.yaml]
                        t9g5q[public_media.yaml]
                        t9g5r[public_notifications.yaml]
                        t9g5s[public_posts.yaml]
                        t9g5t[public_regions.yaml]
                        t9g5u[public_reviews.yaml]
                        t9g5v[public_service_categories.yaml]
                        t9g5w[public_service_media.yaml]
                        t9g5x[public_therapist_availability.yaml]
                        t9g5y[public_therapist_profiles.yaml]
                        t9g5z[public_therapist_services.yaml]
                        t9g5aa[public_tourist_profiles.yaml]
                        t9g5ab[public_transactions.yaml]
                        t9g5ac[public_unavailable_dates.yaml]
                        t9g5ad[public_user_preferences.yaml]
                        t9g5ae[public_users.yaml]
                        t9g5af[realtime_messages.yaml]
                        t9g5ag[realtime_schema_migrations.yaml]
                        t9g5ah[realtime_subscription.yaml]
                        t9g5ai[storage_buckets.yaml]
                        t9g5aj[storage_migrations.yaml]
                        t9g5ak[storage_objects.yaml]
                        t9g5al[storage_s3_multipart_uploads.yaml]
                        t9g5am[storage_s3_multipart_uploads_parts.yaml]
                        t9g5an[supabase_migrations_schema_migrations.yaml]
                        t9g5ao[supabase_migrations_seed_files.yaml]
                        t9g5ap[tables.yaml]
                        t9g5aq[vault_decrypted_secrets.yaml]
                        t9g5ar[vault_secrets.yaml]
                    end
                end
            end

            t9h[graphql_schema_introspection.yaml]
            t9i[inherited_roles.yaml]
            t9j[metrics_config.yaml]
            t9k[network.yaml]
            t9l[opentelemetry.yaml]
            t9m[query_collections.yaml]
            t9n[remote_schemas.yaml]
            t9o[rest_endpoints.yaml]
            t9p[version.yaml]
        end

        t10[metadata.json]
        t11[middleware.ts]
        t12[migration_log.txt]

        %% migrations ディレクトリ
        subgraph t13[migrations]
            subgraph t13a[default]
            end
            subgraph t13b[sppa]
            end
        end

        t14[next-env.d.ts]
        t15[next-i18next.config.js]
        t16[next.config.js]
        t17[output.txt]
        t18[package.json]
        t19[pg_hba.conf]
        t20[postcss.config.js]

        %% public ディレクトリ
        subgraph t21[public]
            subgraph t21a[images]
                t21a1[event1.jpg]
                t21a2[event2.jpg]
                t21a3[event3.jpg]
                t21a4[favicon.ico]
                t21a5[user1.jpg]
                t21a6[user2.jpg]
            end
        end

        t22[script.sql]

        %% scripts ディレクトリ
        subgraph t23[scripts]
            t23a[organize_sppa_dirs.sh]
        end

        %% seeds ディレクトリ
        subgraph t24[seeds]
        end

        t25[server.js]

        %% src ディレクトリ
        subgraph t26[src]

            %% src/@types
            subgraph t26a[@types]
                t26a1[shadcn__ui.d.ts]
            end

            %% src/api
            subgraph t26b[api]
                t26b1[generate-api-from-permissions.js]
                t26b2[generated-api.ts]
                subgraph t26b3[notifications]
                    subgraph t26b3a[unread]
                        t26b3a1[route.ts]
                    end
                end
            end

            %% src/app
            subgraph t26c[app]

                %% src/app/(common)
                subgraph t26c1[(common)]
                    %% chat
                    subgraph t26c1a[chat]
                        subgraph t26c1a1[[userId]]
                            t26c1a1a[page.tsx]
                        end
                        subgraph t26c1a2[components]
                            t26c1a2a[AutoTranslateToggle.tsx]
                            t26c1a2b[ChatWindow.tsx]
                            t26c1a2c[MessageBubble.tsx]
                            t26c1a2d[MessageInput.tsx]
                        end
                        subgraph t26c1a3[hooks]
                            t26c1a3a[useAutoTranslation.ts]
                            t26c1a3b[useOnlineUsers.ts]
                            t26c1a3c[useRealtimeChat.ts]
                            t26c1a3d[useRecentChats.ts]
                            t26c1a3e[useSearchUsers.ts]
                        end
                        t26c1a4[page.tsx]
                    end

                    %% home
                    subgraph t26c1b[home]
                        subgraph t26c1b1[components]
                            t26c1b1a[FeedList.tsx]
                            t26c1b1b[MasonryFeed.tsx]
                            t26c1b1c[PostCard.tsx]
                            t26c1b1d[RealTimeAvailabilityBadge.tsx]
                            t26c1b1e[TabSelector.tsx]
                            t26c1b1f[TranslationToggle.tsx]
                        end
                        subgraph t26c1b2[hooks]
                            t26c1b2a[useFeedData.ts]
                            t26c1b2b[useNotificationState.ts]
                            t26c1b2c[useTherapistErrorEffect.ts]
                        end
                        t26c1b3[page.tsx]
                    end

                    %% search
                    subgraph t26c1c[search]
                        subgraph t26c1c1[components]
                            t26c1c1a[FilterPanel.tsx]
                            t26c1c1b[RealTimeAvailabilityIndicator.tsx]
                            t26c1c1c[ResultCard.tsx]
                            t26c1c1d[SearchBar.tsx]
                        end
                        subgraph t26c1c2[hooks]
                            t26c1c2a[useRealTimeAvailability.ts]
                            t26c1c2b[useSearchResults.ts]
                        end
                        t26c1c3[page.tsx]
                    end

                    %% therapists
                    subgraph t26c1d[therapists]
                        subgraph t26c1d1[[therapistId]]
                            subgraph t26c1d1a[components]
                                t26c1d1a1[BookingButton.tsx]
                                t26c1d1a2[RealTimeStatus.tsx]
                                t26c1d1a3[ReviewList.tsx]
                                t26c1d1a4[ServiceDetails.tsx]
                                t26c1d1a5[TherapistProfile.tsx]
                                t26c1d1a6[useRealTimeReviews.ts]
                                t26c1d1a7[useTherapistDetails.ts]
                            end
                            t26c1d1b[page.tsx]
                        end
                    end
                end

                t26c2[ApolloWrapper.tsx]

                %% src/app/api
                subgraph t26c3[api]
                    subgraph t26c3a[activity-logs]
                        t26c3a1[route.ts]
                    end

                    subgraph t26c3b[auth]
                        subgraph t26c3b1[[...nextauth]]
                            t26c3b1a[route.ts]
                        end
                    end

                    subgraph t26c3c[error-logs]
                        t26c3c1[route.ts]
                    end

                    t26c3d[events.ts]

                    subgraph t26c3e[experiences]
                        t26c3e1[route.ts]
                    end

                    subgraph t26c3f[graphql]
                        t26c3f1[route.ts]
                    end

                    subgraph t26c3g[graphql-fallback]
                        t26c3g1[route.ts]
                    end

                    subgraph t26c3h[therapists]
                        subgraph t26c3h1[[therapistId]]
                            subgraph t26c3h1a[availability]
                                t26c3h1a1[route.ts]
                            end
                            t26c3h1b[route.ts]
                        end
                        t26c3h2[route.ts]
                    end

                    subgraph t26c3i[translate]
                        t26c3i1[route.ts]
                    end

                    subgraph t26c3j[trends]
                        t26c3j1[route.ts]
                    end

                    subgraph t26c3k[users]
                        subgraph t26c3k1[[userId]]
                            t26c3k1a[route.ts]
                        end
                    end
                end

                %% src/app/components
                subgraph t26c4[components]
                    subgraph t26c4a[common]
                        t26c4a1[Avatar.tsx]
                        t26c4a2[BookingButton.tsx]
                        t26c4a3[BottomNavigation.tsx]
                        t26c4a4[ChatHeader.tsx]
                        t26c4a5[ErrorBoundary.tsx]
                        t26c4a6[EventCard.tsx]
                        t26c4a7[FeedFilters.tsx]
                        t26c4a8[HomeContent.tsx]
                        t26c4a9[HomeHeader.tsx]
                        t26c4a10[LanguageSwitcher.tsx]
                        t26c4a11[LoadingSpinner.tsx]
                        t26c4a12[LoginForm.tsx]
                        t26c4a13[MediaDisplay.tsx]
                        t26c4a14[MediaGallery.tsx]
                        t26c4a15[MultiLanguageSupport.tsx]
                        t26c4a16[NotificationItem.tsx]
                        t26c4a17[OfferCarousel.tsx]
                        t26c4a18[PriceDisplay.tsx]
                        t26c4a19[PushNotification.tsx]
                        t26c4a20[RatingStars.tsx]
                        t26c4a21[RecommendedExperiences.tsx]
                        t26c4a22[ReviewCard.tsx]
                        t26c4a23[ServiceBadge.tsx]
                        t26c4a24[ServiceDetails.tsx]
                        t26c4a25[TeaserCard.tsx]
                        t26c4a26[TherapistAvailabilityPanel.tsx]
                        t26c4a27[TherapistAvailabilityStatus.tsx]
                    end
                    subgraph t26c4b[ui]
                        t26c4b1[Alert.tsx]
                        t26c4b2[Badge.tsx]
                        t26c4b3[Button.tsx]
                        t26c4b4[Calendar.tsx]
                        t26c4b5[Card.tsx]
                        t26c4b6[Checkbox.tsx]
                        t26c4b7[DatePicker.tsx]
                        t26c4b8[Dialog.tsx]
                        t26c4b9[ErrorMessage.tsx]
                        t26c4b10[Form.tsx]
                        t26c4b11[Input.tsx]
                        t26c4b12[Label.tsx]
                        t26c4b13[Navbar.tsx]
                        t26c4b14[Select.tsx]
                        t26c4b15[Spinner.tsx]
                        t26c4b16[Switch.tsx]
                        t26c4b17[Text.tsx]
                        t26c4b18[Toast.tsx]
                    end
                end

                subgraph t26c5[contexts]
                    t26c5a[ChatContext.tsx]
                end

                t26c6[create-ws-client.ts]

                %% src/app/hooks
                subgraph t26c7[hooks]
                    subgraph t26c7a[api]
                        t26c7a1[availability.ts]
                        t26c7a2[index.ts]
                        t26c7a3[useActivityLogging.ts]
                        t26c7a4[useAuth.ts]
                        t26c7a5[useCreateBooking.ts]
                        t26c7a6[useCreateEvent.ts]
                        t26c7a7[useCreateReview.ts]
                        t26c7a8[useCreateTransaction.ts]
                        t26c7a9[useErrorLogApi.ts]
                        t26c7a10[useFetchEvents.ts]
                        t26c7a11[useFetchFilters.ts]
                        t26c7a12[useFetchLocalExperiences.ts]
                        t26c7a13[useFetchMedia.ts]
                        t26c7a14[useFetchReviews.ts]
                        t26c7a15[useFetchSearchResults.ts]
                        t26c7a16[useFetchServiceCategories.ts]
                        t26c7a17[useFetchServices.ts]
                        t26c7a18[useFetchTherapistLocations.ts]
                        t26c7a19[useFetchTherapists.ts]
                        t26c7a20[useFetchTrends.ts]
                        t26c7a21[useFetchUser.ts]
                        t26c7a22[useIsomorphicLayoutEffect.ts]
                        t26c7a23[useLikeTherapist.ts]
                        t26c7a24[useMatchList.ts]
                        t26c7a25[useMedia.ts]
                        t26c7a26[useNotificationsApi.ts]
                        t26c7a27[useRealtimeAvailability.ts]
                        t26c7a28[useServices.ts]
                        t26c7a29[useTherapistAvailabilityApi.ts]
                        t26c7a30[useTherapistData.tsx]
                        t26c7a31[useTherapistSearch.ts]
                        t26c7a32[useTransactions.ts]
                        t26c7a33[useTrends.ts]
                        t26c7a34[useUnreadNotifications.ts]
                        t26c7a35[useUpdateUser.ts]
                        t26c7a36[useUser.ts]
                        t26c7a37[users.ts]
                    end
                    subgraph t26c7b[realtime]
                        t26c7b1[RealtimeMatchList.tsx]
                        t26c7b2[TherapistAvailabilityPanel.tsx]
                        t26c7b3[TherapistAvailabilityStatus.tsx]
                        t26c7b4[index.ts]
                        t26c7b5[useNotifications.ts]
                        t26c7b6[useRealtimeAvailability.ts]
                        t26c7b7[useRealtimeBookings.ts]
                        t26c7b8[useRealtimeChat.ts]
                        t26c7b9[useRealtimeEvents.ts]
                        t26c7b10[useRealtimeFeedUpdates.ts]
                        t26c7b11[useRealtimeMatchList.ts]
                        t26c7b12[useRealtimeReviews.ts]
                        t26c7b13[useRealtimeTransactions.ts]
                        t26c7b14[useTherapistAvailability.ts]
                    end
                    subgraph t26c7c[ui]
                        t26c7c1[useBottomSheet.ts]
                    end
                    t26c7d[useFeedStore.ts]
                    t26c7e[usePosts.ts]
                    t26c7f[useTherapistAvailability.ts]
                    t26c7g[useWebSocketSubscription.ts]
                end

                %% src/app/i18n
                subgraph t26c8[i18n]
                    t26c8a[I18nProvider.tsx]
                    t26c8b[client.ts]
                    t26c8c[server.ts]
                    t26c8d[settings.ts]
                end

                t26c9[layout.tsx]

                %% src/app/lib
                subgraph t26c10[lib]
                    t26c10a[auth.client.ts]
                    t26c10b[auth.server.ts]
                    t26c10c[auth.ts]
                    t26c10d[authOptions.ts]
                    t26c10e[currency-utils.ts]
                    t26c10f[date-utils.ts]
                    t26c10g[enum-utils.ts]
                    subgraph t26c10h[graphql]
                        subgraph t26c10h1[queries]
                            t26c10h1a[post.ts]
                            t26c10h1b[service.ts]
                        end
                    end
                    t26c10i[hasura-client.ts]
                    t26c10j[i18n.ts]
                    subgraph t26c10k[queries]
                        t26c10k1[media.ts]
                        t26c10k2[therapistAvailability.ts]
                        t26c10k3[user.ts]
                    end
                    t26c10l[storage-utils.ts]
                    t26c10m[string-utils.ts]
                    t26c10n[supabase-client.ts]
                    t26c10o[utils.ts]
                end

                %% src/app/locales
                subgraph t26c11[locales]
                    t26c11a[en.json]
                    t26c11b[id.json]
                end

                %% src/app/login
                subgraph t26c12[login]
                    t26c12a[page.tsx]
                end

                t26c13[page.tsx]

                %% src/app/pages
                subgraph t26c14[pages]
                    t26c14a[UserIcon.tsx]
                end

                t26c15[providers.tsx]

                %% src/app/realtime
                subgraph t26c16[realtime]
                    t26c16a[RealtimeBookingList.tsx]
                    t26c16b[RealtimeEventList.tsx]
                    t26c16c[availability-listener.ts]
                    t26c16d[bookings-listener.ts]
                    t26c16e[chat-listener.ts]
                    t26c16f[likes-listener.ts]
                    t26c16g[notifications-push.tsx]
                    t26c16h[profile-listener.ts]
                end

                %% src/app/signup
                subgraph t26c17[signup]
                    t26c17a[page.tsx]
                end

                %% src/app/therapist
                subgraph t26c18[therapist]
                    subgraph t26c18a[bookings]
                        subgraph t26c18a1[components]
                            t26c18a1a[BookingCalendar.tsx]
                            t26c18a1b[BookingDetailModal.tsx]
                            t26c18a1c[BookingList.tsx]
                            t26c18a1d[TransactionList.tsx]
                        end
                        t26c18a2[page.tsx]
                    end
                    subgraph t26c18b[components]
                        t26c18b1[Sidebar.tsx]
                        t26c18b2[TherapistAvailabilityPanel.tsx]
                        t26c18b3[TherapistLayout.tsx]
                    end
                    subgraph t26c18c[dashboard]
                        subgraph t26c18c1[components]
                            t26c18c1a[ActivityLog.tsx]
                            t26c18c1b[BookingSummary.tsx]
                            t26c18c1c[DashboardSummary.tsx]
                            t26c18c1d[RevenueChart.tsx]
                        end
                        t26c18c2[page.tsx]
                    end
                    subgraph t26c18d[events]
                        subgraph t26c18d1[components]
                            t26c18d1a[EventCard.tsx]
                            t26c18d1b[EventForm.tsx]
                            t26c18d1c[EventList.tsx]
                        end
                        t26c18d2[page.tsx]
                    end
                    subgraph t26c18e[hooks]
                        t26c18e1[useActivityLogs.ts]
                        t26c18e2[useBookingData.ts]
                        t26c18e3[useEventData.ts]
                        t26c18e4[useReviewData.ts]
                    end
                    t26c18f[page.tsx]
                    subgraph t26c18g[profile]
                        subgraph t26c18g1[components]
                            t26c18g1a[AvailabilitySettings.tsx]
                            t26c18g1b[EventForm.tsx]
                            t26c18g1c[MediaUploadForm.tsx]
                            t26c18g1d[ProfileForm.tsx]
                            t26c18g1e[ProfileSettings.tsx]
                            t26c18g1f[ServiceForm.tsx]
                            t26c18g1g[ServiceManagement.tsx]
                            subgraph t26c18g1h[hooks]
                                t26c18g1h1[useProfileData.ts]
                                t26c18g1h2[useRealTimeProfileUpdates.ts]
                            end
                        end
                        t26c18g2[page.tsx]
                    end
                    subgraph t26c18h[reviews]
                        subgraph t26c18h1[components]
                            t26c18h1a[ReviewDetailModal.tsx]
                            t26c18h1b[ReviewList.tsx]
                            t26c18h1c[ReviewOverview.tsx]
                        end
                        t26c18h2[page.tsx]
                    end
                    subgraph t26c18i[settings]
                        t26c18i1[page.tsx]
                    end
                end

                %% src/app/tourist
                subgraph t26c19[tourist]
                    subgraph t26c19a[bookings]
                        subgraph t26c19a1[components]
                            t26c19a1a[AddOption.tsx]
                            t26c19a1b[BookingCalendar.tsx]
                            t26c19a1c[BookingCard.tsx]
                            t26c19a1d[BookingDetailModal.tsx]
                            t26c19a1e[BookingForm.tsx]
                            t26c19a1f[BookingList.tsx]
                            t26c19a1g[CancelPolicy.tsx]
                            t26c19a1h[MyBookingsList.tsx]
                            t26c19a1i[RealTimeAvailability.tsx]
                            t26c19a1j[ReminderNotification.tsx]
                            t26c19a1k[TransactionDetails.tsx]
                        end
                        subgraph t26c19a2[hooks]
                            t26c19a2a[useBookingNotifications.ts]
                            t26c19a2b[useMyBookings.ts]
                        end
                        t26c19a3[page.tsx]
                    end

                    subgraph t26c19b[chat]
                        subgraph t26c19b1[components]
                            t26c19b1a[AutoTranslate.tsx]
                            t26c19b1b[ChatWindow.tsx]
                            t26c19b1c[EmergencyContact.tsx]
                            t26c19b1d[MediaShare.tsx]
                            t26c19b1e[MessageInput.tsx]
                            t26c19b1f[MessageList.tsx]
                            t26c19b1g[OnlineTherapists.tsx]
                            t26c19b1h[PriorityMessage.tsx]
                            t26c19b1i[RecentConversations.tsx]
                            t26c19b1j[SearchBar.tsx]
                            t26c19b1k[TemplateMessage.tsx]
                        end
                        t26c19b2[page.tsx]
                    end

                    subgraph t26c19c[components]
                        t26c19c1[LocationService.ts]
                        t26c19c2[RecommendedExperiences.tsx]
                        t26c19c3[SearchBar.tsx]
                        t26c19c4[TherapistCard.tsx]
                        t26c19c5[TouristLayout.tsx]
                    end

                    subgraph t26c19d[home]
                        subgraph t26c19d1[components]
                            t26c19d1a[MultiLanguageSupport.tsx]
                            t26c19d1b[OfferCarousel.tsx]
                            t26c19d1c[RecommendedExperiences.tsx]
                            t26c19d1d[RecommendedTherapists.tsx]
                            t26c19d1e[WelcomeMessage.tsx]
                        end
                        subgraph t26c19d2[hooks]
                            t26c19d2a[useHomeData.ts]
                            t26c19d2b[useNotificationCount.ts]
                            t26c19d2c[usePageData.ts]
                        end
                        t26c19d3[page.tsx]
                    end

                    subgraph t26c19e[hooks]
                        t26c19e1[useLocalExperiences.ts]
                        t26c19e2[useLocationService.ts]
                        t26c19e3[useTherapistSearch.ts]
                        t26c19e4[useUserPreferences.ts]
                    end

                    subgraph t26c19f[likes]
                        subgraph t26c19f1[components]
                            t26c19f1a[LikeButton.tsx]
                            t26c19f1b[MatchList.tsx]
                        end
                    end

                    subgraph t26c19g[local-experiences]
                        subgraph t26c19g1[[experienceId]]
                            subgraph t26c19g1a[components]
                                t26c19g1a1[MediaGallery.tsx]
                            end
                            t26c19g1b[page.tsx]
                        end
                        subgraph t26c19g2[components]
                            t26c19g2a[ExperienceCard.tsx]
                            t26c19g2b[ExperienceList.tsx]
                        end
                        t26c19g3[page.tsx]
                    end

                    subgraph t26c19h[notifications]
                        subgraph t26c19h1[components]
                            t26c19h1a[NotificationList.tsx]
                            subgraph t26c19h1b[components]
                                t26c19h1b1[NotificationListStatic.tsx]
                            end
                        end
                        t26c19h2[page.tsx]
                    end

                    t26c19i[page.tsx]

                    subgraph t26c19j[preferences]
                        subgraph t26c19j1[components]
                            t26c19j1a[PreferenceForm.tsx]
                        end
                        t26c19j2[page.tsx]
                    end

                    subgraph t26c19k[profile]
                        subgraph t26c19k1[components]
                            t26c19k1a[DarkModeToggle.tsx]
                            t26c19k1b[PaymentMethod.tsx]
                            t26c19k1c[PreferencesForm.tsx]
                            t26c19k1d[ProfileEdit.tsx]
                            t26c19k1e[ProfileForm.tsx]
                            t26c19k1f[ProfileView.tsx]
                            t26c19k1g[ReviewHistory.tsx]
                            subgraph t26c19k1h[hooks]
                                t26c19k1h1[useUserProfile.ts]
                            end
                        end
                        t26c19k2[page.tsx]
                    end

                    subgraph t26c19l[search]
                        subgraph t26c19l1[components]
                            t26c19l1a[FilterModal.tsx]
                            t26c19l1b[MapView.tsx]
                            t26c19l1c[SearchBar.tsx]
                            t26c19l1d[SearchResults.tsx]
                            t26c19l1e[TrendDisplay.tsx]
                            t26c19l1f[TrendTags.tsx]
                            t26c19l1g[TrendingSearches.tsx]
                        end
                        t26c19l2[page.tsx]
                    end

                    subgraph t26c19m[therapists]
                        subgraph t26c19m1[[therapistId]]
                            subgraph t26c19m1a[components]
                                t26c19m1a1[MediaGallery.tsx]
                                t26c19m1a2[ReviewList.tsx]
                                t26c19m1a3[TherapistAvailability.tsx]
                                t26c19m1a4[TherapistDetail.tsx]
                            end
                            t26c19m1b[page.tsx]
                        end
                        subgraph t26c19m2[components]
                            t26c19m2a[FilterPanel.tsx]
                            t26c19m2b[TherapistCard.tsx]
                            t26c19m2c[TherapistFilter.tsx]
                            t26c19m2d[TherapistList.tsx]
                            t26c19m2e[TherapistMap.tsx]
                        end
                        t26c19m3[page.tsx]
                    end
                end
            end

            %% src/backend
            subgraph t26d[backend]
                subgraph t26d1[api]
                    subgraph t26d1a[graphql]
                        t26d1a1[availability.ts]
                        t26d1a2[bookings.ts]
                        t26d1a3[error-logs.ts]
                        t26d1a4[events.ts]
                        t26d1a5[index.ts]
                        t26d1a6[likes.ts]
                        t26d1a7[local-experiences.ts]
                        t26d1a8[media.ts]
                        t26d1a9[reviews.ts]
                        t26d1a10[services.ts]
                        t26d1a11[therapists.ts]
                        t26d1a12[transactions.ts]
                        t26d1a13[trends.ts]
                        t26d1a14[users.ts]
                    end
                end
            end

            %% src/realtime
            subgraph t26e[realtime]
                t26e1[availability-listener.ts]
                t26e2[bookings-listener.ts]
                t26e3[chat-listener.ts]
                t26e4[likes-listener.ts]
                t26e5[notifications-listener.ts]
                t26e6[profile-listener.ts]
            end

            %% src/styles
            subgraph t26f[styles]
                t26f1[globals.css]
                t26f2[theme.ts]
            end

            %% src/types
            subgraph t26g[types]
                t26g1[activity-log.ts]
                t26g2[auth.ts]
                t26g3[availability.ts]
                t26g4[booking.ts]
                t26g5[chat.ts]
                t26g6[enums.ts]
                t26g7[error-log.ts]
                t26g8[event.ts]
                t26g9[graphql.ts]
                t26g10[like.ts]
                t26g11[local-experience.ts]
                t26g12[lodash.d.ts]
                t26g13[match.ts]
                t26g14[media.ts]
                t26g15[next-auth.d.ts]
                t26g16[next-i18next.d.ts]
                t26g17[notification.ts]
                t26g18[post.ts]
                t26g19[preference.ts]
                t26g20[react-window.d.ts]
                t26g21[review.ts]
                t26g22[therapist.ts]
                t26g23[tourist.ts]
                t26g24[transaction.ts]
                t26g25[user.ts]
                t26g26[ws.d.ts]
                t26g27[zen-observable-ts.d.ts]
            end

            %% src/utils
            subgraph t26h[utils]
                t26h1[auth.ts]
                t26h2[hasura-client.ts]
                subgraph t26h3[supabase]
                    t26h3a[server.ts]
                end
            end
        end

        %% supabase ディレクトリ
        subgraph t27[supabase]
            t27a[config.toml]
        end

        t28[tailwind.config.js]
        t29[tsconfig.json]
    end
    
</details>

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
