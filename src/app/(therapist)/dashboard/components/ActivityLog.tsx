// src/app/therapist/dashboard/components/ActivityLog.tsx
import React from "react";
import { useActivityLogs } from "../../hooks/useActivityLogs";

interface ActivityLogProps {
  therapistId: string | number;
}

// If you know for sure your therapistId is always a string,
// feel free to change the above to `therapistId: string` only.

const ActivityLog: React.FC<ActivityLogProps> = ({ therapistId }) => {
  const { data, loading, error } = useActivityLogs(String(therapistId));

  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <p>Error loading activity logs: {error.message}</p>;

  return (
    <div className="activity-log p-4">
      <h2 className="text-xl font-bold">Activity Log</h2>
      <ul className="mt-4 space-y-2">
        {data.map((log: any) => (
          <li key={log.id} className="border-b py-2">
            <p className="font-medium">{log.action}</p>
            <p className="text-sm text-gray-500">{log.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
