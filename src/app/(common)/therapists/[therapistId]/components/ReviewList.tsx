// src/app/(common)/therapists/[therapistId]/components/ReviewList.tsx
import useRealTimeReviews from '@/app/hooks/realtime/useRealtimeReviews';

// レビューの型定義
interface Review {
  id: string;
  rating: number;
  comment: string;
}

// コンポーネントの props 型定義
interface ReviewListProps {
  readonly therapistId: string;
}

// ※ フックの戻り値の型（必要に応じて実装に合わせて拡張してください）
interface RealTimeReviewsReturn {
  realtimeReviews: Review[];
  // loading や error があれば追加する
}

export default function ReviewList({ therapistId }: ReviewListProps) {
  // カスタムフックからデータを取得
  const { realtimeReviews } = useRealTimeReviews(therapistId);
  
  // ※ 実装に合わせて loading や error 状態をハンドリング
  const loading = false; // フックが提供する場合はそちらを利用
  const error = null;    // フックが提供する場合はそちらを利用

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews.</div>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Reviews</h3>
      {realtimeReviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        realtimeReviews.map((review: Review) => (
          <div key={review.id} className="border-b py-4">
            <p className="font-medium">Rating: {review.rating} / 5</p>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
