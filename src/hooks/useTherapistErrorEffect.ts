// src/hooks/useTherapistErrorEffect.ts
import { useEffect } from "react";
import { toast } from "react-toastify";

/**
 * セラピストデータのエラー状態と取得データのログ出力を行うカスタムフック
 *
 * @param therapistError - セラピストデータ取得時に発生したエラー（存在しない場合は null）
 * @param therapistData - 取得済みのセラピストデータ
 * @param t - 国際化用の翻訳関数（例: next-i18next の useTranslation から取得）
 */
export function useTherapistErrorEffect(
  therapistError: Error | null,
  therapistData: unknown,
  t: (key: string) => string
): void {
  useEffect(() => {
    if (therapistError) {
      console.error("Therapist Data Error:", therapistError);
      toast.error(t("therapist.fetchError") || "Failed to load therapist data");
    }
    if (therapistData) {
      console.log("Therapist Data Loaded:", therapistData);
    }
  }, [therapistData, therapistError, t]);
}
