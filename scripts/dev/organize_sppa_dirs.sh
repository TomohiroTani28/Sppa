#!/bin/bash

# プロジェクトルートディレクトリ (必要に応じて修正)
PROJECT_ROOT="$PWD/src/app"

# ディレクトリ作成
mkdir -p "${PROJECT_ROOT}/components/common"
mkdir -p "${PROJECT_ROOT}/components/layouts"
mkdir -p "${PROJECT_ROOT}/components/ui"
mkdir -p "${PROJECT_ROOT}/components/realtime"
mkdir -p "${PROJECT_ROOT}/hooks/api"
mkdir -p "${PROJECT_ROOT}/hooks/realtime"
mkdir -p "${PROJECT_ROOT}/hooks/ui"

# ファイル移動 (components)
mv "${PROJECT_ROOT}/components/common/Avatar.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/EventCard.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/MediaDisplay.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/NotificationItem.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/PriceDisplay.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/RatingStars.tsx" "${PROJECT_ROOT}/components/common/"
mv "${PROJECT_ROOT}/components/common/ServiceBadge.tsx" "${PROJECT_ROOT}/components/common/"

mv "${PROJECT_ROOT}/components/realtime/RealtimeBookingList.tsx" "${PROJECT_ROOT}/components/realtime/"
mv "${PROJECT_ROOT}/components/realtime/RealtimeChat.tsx" "${PROJECT_ROOT}/components/realtime/"
mv "${PROJECT_ROOT}/components/realtime/RealtimeReviewList.tsx" "${PROJECT_ROOT}/components/realtime/"
mv "${PROJECT_ROOT}/components/realtime/TherapistAvailabilityStatus.tsx" "${PROJECT_ROOT}/components/realtime/"

mv "${PROJECT_ROOT}/components/ui/Button.tsx" "${PROJECT_ROOT}/components/ui/"
mv "${PROJECT_ROOT}/components/ui/Card.tsx" "${PROJECT_ROOT}/components/ui/"

# ファイル移動 (hooks)
mv "${PROJECT_ROOT}/hooks/api/useCreateBooking.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useFetchEvents.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useFetchLocalExperiences.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useFetchReviews.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useFetchTherapists.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useLikeTherapist.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useMedia.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useNotificationsApi.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useServices.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useTherapistAvailabilityApi.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useTransactions.ts" "${PROJECT_ROOT}/hooks/api/"
mv "${PROJECT_ROOT}/hooks/api/useUser.ts" "${PROJECT_ROOT}/hooks/api/"

mv "${PROJECT_ROOT}/hooks/realtime/useNotifications.ts" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useRealtimeBookings.ts" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useRealtimeChat.ts" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useRealtimeReviews.ts" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useTherapistAvailability.ts" "${PROJECT_ROOT}/hooks/realtime/"

mv "${PROJECT_ROOT}/hooks/ui/useBottomSheet.ts" "${PROJECT_ROOT}/hooks/ui/"

# layouts ディレクトリへ移動 (app/components から app/components/layouts へ)
mkdir -p "${PROJECT_ROOT}/components/layouts"
mv "${PROJECT_ROOT}/components/TouristLayout.tsx" "${PROJECT_ROOT}/components/layouts/"
mv "${PROJECT_ROOT}/components/TherapistLayout.tsx" "${PROJECT_ROOT}/components/layouts/"

# components/realtime 以下の RealtimeMatchList.tsx を components/realtime へ移動
mkdir -p "${PROJECT_ROOT}/components/realtime"
mv "${PROJECT_ROOT}/components/realtime/RealtimeMatchList.tsx" "${PROJECT_ROOT}/components/realtime/"

# hooks/realtime 以下の RealtimeMatchList.tsx, TherapistAvailabilityStatus.tsx, useRealtimeMatchList.ts, useTherapistAvailability.ts を hooks/realtime へ移動
mkdir -p "${PROJECT_ROOT}/hooks/realtime"
mv "${PROJECT_ROOT}/hooks/realtime/RealtimeMatchList.tsx" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/TherapistAvailabilityStatus.tsx" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useRealtimeMatchList.ts" "${PROJECT_ROOT}/hooks/realtime/"
mv "${PROJECT_ROOT}/hooks/realtime/useTherapistAvailability.ts" "${PROJECT_ROOT}/hooks/realtime/"


echo "ディレクトリ構造を整理しました。"