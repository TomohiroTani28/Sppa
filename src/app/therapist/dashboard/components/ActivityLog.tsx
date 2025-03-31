// src/app/(therapist)/dashboard/components/ActivityLog.tsx
import { useActivityLogs } from '@/hooks/api/useActivityLogs';
import type { ActivityLog as ActivityLogType } from '@/types/activity-log';

interface ActivityLogProps {
  userId: string; // セラピストのユーザーIDを必須プロパティとして受け取る
}

export const ActivityLog = ({ userId }: ActivityLogProps) => {
  // useActivityLogsフックを使用
  const { activityLogs, isLoading, error, refreshLogs } = useActivityLogs({
    userId, // オブジェクト形式で渡す
    limit: 5, // 必要に応じて調整
  });

  // ローディング中
  if (isLoading) {
    return <div>Loading activity logs...</div>;
  }

  // エラー時
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="activity-log">
      <h2>Recent Activity</h2>
      <button onClick={refreshLogs} disabled={isLoading}>
        Refresh Logs
      </button>
      {activityLogs.length === 0 ? (
        <p>No activity logs available.</p>
      ) : (
        <ul>
          {activityLogs.map((log: ActivityLogType) => (
            <li key={log.id}>
              <span>{log.action}</span> - <span>{log.details}</span>{' '}
              <span>({new Date(log.created_at).toLocaleString()})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};