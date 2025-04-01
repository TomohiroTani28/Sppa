/**
 * src/app/tourist/profile/components/PreferencesForm.tsx
 * 観光客向けプロフィールページ内で使用されるプリファレンス設定フォームコンポーネント。
 * 言語、通知設定、通貨、サービスカテゴリなどのユーザー設定を管理します。
 * Hasura GraphQLを利用してデータを取得・更新し、Shadcn/UIコンポーネントでUIを構築。
 *
 * @module PreferencesForm
 */

import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useForm, Controller, Control } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useUser } from "@/hooks/api/useUser";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Label } from "@/components/ui/Label";

// GraphQLクエリとミューテーションの定義
const GET_USER_PREFERENCES = gql`
  query GetUserPreferences($userId: UUID!) {
    user_preferences_by_pk(user_id: $userId) {
      language
      notifications
      currency
      serviceCategories
    }
  }
`;

const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    service_categories {
      id
      name
    }
  }
`;

const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($userId: UUID!, $preferences: user_preferences_set_input!) {
    update_user_preferences_by_pk(pk_columns: { user_id: $userId }, _set: $preferences) {
      user_id
    }
  }
`;

// 静的リスト（仮定）
const LANGUAGES = ["en", "id"];
const CURRENCIES = ["USD", "IDR"];

/**
 * ユーザー設定の型定義
 */
interface UserPreferences {
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  currency: string;
  serviceCategories: string[];
}

/**
 * サブコンポーネント: 言語選択
 */
interface LanguageSelectorProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
}
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ control, t }) => (
  <div className="space-y-2">
    <Label htmlFor="language">{t("preferences.language")}</Label>
    <Controller
      name="language"
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger id="language">
            <SelectValue placeholder={t("preferences.select_language")} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </div>
);

/**
 * サブコンポーネント: 通知設定
 */
interface NotificationSettingsProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
}
const NotificationSettings: React.FC<NotificationSettingsProps> = ({ control, t }) => (
  <div className="space-y-2">
    <Label>{t("preferences.notifications")}</Label>
    <div className="flex items-center space-x-2">
      <Controller
        name="notifications.email"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="email"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Label htmlFor="email">{t("preferences.email")}</Label>
    </div>
    <div className="flex items-center space-x-2">
      <Controller
        name="notifications.push"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="push"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Label htmlFor="push">{t("preferences.push")}</Label>
    </div>
  </div>
);

/**
 * サブコンポーネント: 通貨選択
 */
interface CurrencySelectorProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
}
const CurrencySelector: React.FC<CurrencySelectorProps> = ({ control, t }) => (
  <div className="space-y-2">
    <Label htmlFor="currency">{t("preferences.currency")}</Label>
    <Controller
      name="currency"
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger id="currency">
            <SelectValue placeholder={t("preferences.select_currency")} />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </div>
);

/**
 * サブコンポーネント: サービスカテゴリ選択
 * ※ 現状はシングルセレクト実装。複数選択が必要な場合はマルチセレクトコンポーネントに差し替えてください。
 */
interface ServiceCategorySelectorProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
  serviceCategories: { id: string; name: string }[];
}
const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({ control, t, serviceCategories }) => (
  <div className="space-y-2">
    <Label htmlFor="serviceCategories">{t("preferences.serviceCategories")}</Label>
    <Controller
      name="serviceCategories"
      control={control}
      render={({ field }) => (
        <Select
          onValueChange={(value) => field.onChange([value])} // 現状はシングル選択。マルチ選択の場合は別コンポーネントへ変更。
          value={field.value.length > 0 ? field.value[0] : undefined}
        >
          <SelectTrigger id="serviceCategories">
            <SelectValue placeholder={t("preferences.select_service_categories")} />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {/* TODO: マルチセレクト対応が必要な場合、別コンポーネントを検討 */}
  </div>
);

/**
 * PreferencesFormコンポーネント
 * @returns JSX.Element
 */
export function PreferencesForm() {
  const { t } = useTranslation("common");

  // 現在のユーザーIDを取得（仮実装：実際は認証コンテキスト等から取得）
  const CURRENT_USER_ID = "123";
  const { user } = useUser(CURRENT_USER_ID);

  // ユーザー設定の取得
  const {
    data: preferencesData,
    loading: preferencesLoading,
    error: preferencesError,
  } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  // サービスカテゴリの取得
  const {
    data: serviceCategoriesData,
    loading: serviceCategoriesLoading,
    error: serviceCategoriesError,
  } = useQuery(GET_SERVICE_CATEGORIES);

  // ユーザー設定更新用ミューテーション
  const [updatePreferences, { loading: updateLoading }] = useMutation(
    UPDATE_USER_PREFERENCES
  );

  // フォーム管理
  const { control, handleSubmit, reset } = useForm<UserPreferences>({
    defaultValues: preferencesData?.user_preferences_by_pk || {
      language: "",
      notifications: { email: false, push: false },
      currency: "",
      serviceCategories: [],
    },
  });

  // データ取得後にフォームをリセット
  React.useEffect(() => {
    if (preferencesData?.user_preferences_by_pk) {
      reset(preferencesData.user_preferences_by_pk);
    }
  }, [preferencesData, reset]);

  /**
   * フォーム送信時のハンドラー
   * @param data フォームデータ
   */
  const onSubmit = async (data: UserPreferences) => {
    try {
      await updatePreferences({
        variables: {
          userId: user?.id,
          preferences: data,
        },
      });
      // TODO: Toastコンポーネント等を使用して成功メッセージを表示
      console.log("Preferences updated successfully.");
    } catch (error) {
      // TODO: Toastコンポーネント等を使用してエラーメッセージを表示
      console.error("Failed to update preferences:", error);
    }
  };

  // ローディング状態
  if (preferencesLoading || serviceCategoriesLoading) {
    return <Spinner className="mx-auto mt-4" />;
  }

  // エラー状態
  if (preferencesError || serviceCategoriesError) {
    return (
      <div className="text-red-500 text-center">
        {t("preferences.error_loading")}
      </div>
    );
  }

  const serviceCategories = serviceCategoriesData?.service_categories || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t("preferences.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSelector control={control} t={t} />
          <NotificationSettings control={control} t={t} />
          <CurrencySelector control={control} t={t} />
          <ServiceCategorySelector control={control} t={t} serviceCategories={serviceCategories} />
        </CardContent>
      </Card>
      <Button
        type="submit"
        disabled={updateLoading}
        className="w-full bg-[#007aff] hover:bg-[#005bb5] text-white"
      >
        {updateLoading ? <Spinner className="mr-2" /> : null}
        {t("preferences.save")}
      </Button>
    </form>
  );
}
