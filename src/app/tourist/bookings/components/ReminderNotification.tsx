// src/app/tourist/bookings/components/ReminderNotification.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import supabase from "@/app/lib/supabase-client";
import { Switch } from "@/app/components/ui/Switch";
import { Label } from "@/app/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { useNotificationsApi } from "@/app/hooks/api/useNotificationsApi";

const ReminderNotification = () => {
  const { t } = useTranslation("bookings");
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user's ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUserId(user?.id || null);
    };
    fetchUserId();
  }, []);

  const { updateReminderPreferences } = useNotificationsApi(userId || "");

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("24h");

  const handleReminderToggle = async (checked: boolean) => {
    setReminderEnabled(checked);
    if (!userId || !updateReminderPreferences) return;
    try {
      await updateReminderPreferences({
        enabled: checked,
        time: reminderTime,
      });
    } catch (error) {
      console.error("Failed to update reminder preferences", error);
    }
  };

  const handleReminderTimeChange = async (value: string) => {
    setReminderTime(value);
    if (!userId || !updateReminderPreferences) return;
    try {
      await updateReminderPreferences({
        enabled: reminderEnabled,
        time: value,
      });
    } catch (error) {
      console.error("Failed to update reminder time", error);
    }
  };

  if (!userId) return <div>{t("loading_user")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="reminder-switch">{t("booking_reminders")}</Label>
          <p className="text-sm text-muted-foreground">
            {t("reminder_description")}
          </p>
        </div>
        <Switch
          id="reminder-switch"
          checked={reminderEnabled}
          onCheckedChange={handleReminderToggle}
        />
      </div>

      {reminderEnabled && (
        <div className="space-y-2">
          <Label>{t("reminder_timing")}</Label>
          <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("select_reminder_time")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">{t("one_hour_before")}</SelectItem>
              <SelectItem value="24h">{t("one_day_before")}</SelectItem>
              <SelectItem value="48h">{t("two_days_before")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-sm text-muted-foreground space-y-2">
        <p>{t("reminder_methods")}</p>
        <ul className="list-disc list-inside">
          <li>{t("push_notification")}</li>
          <li>{t("email_notification")}</li>
        </ul>
      </div>
    </div>
  );
};

export default ReminderNotification;