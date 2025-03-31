// src/app/tourist/bookings/components/CancelPolicy.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";

const CancelPolicy = () => {
  const { t } = useTranslation("bookings");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  return (
    <div className="space-y-4 mt-6">
      <Alert variant="info">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("cancellation_policy")}</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("cancel_before_24_hours")}</li>
            <li>{t("full_refund_conditions")}</li>
            <li>{t("late_cancellation_fee")}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="cancel-policy-agreement"
          checked={agreedToPolicy}
          onCheckedChange={(checked) => setAgreedToPolicy(!!checked)}
        />
        <Label
          htmlFor="cancel-policy-agreement"
          className="text-sm font-normal"
        >
          {t("i_agree_to_cancellation_policy")}
        </Label>
      </div>

      {!agreedToPolicy && (
        <p className="text-sm text-destructive">
          {t("must_agree_to_continue")}
        </p>
      )}
    </div>
  );
};

export default CancelPolicy;
