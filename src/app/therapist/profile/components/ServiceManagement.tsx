"use client";
// src/app/therapist/profile/components/ServiceManagement.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { useServices, TherapistService } from "@/hooks/api/useServices";
import { Checkbox } from "@/components/ui/Checkbox";

/**
 * ServiceManagement component for therapists to manage their services
 * @returns JSX.Element
 */
export function ServiceManagement() {
  const t = useTranslations("TherapistProfile");
  const { addToast } = useToast();

  // ヘルパー関数: Toast に variant を付与して表示する
  const showToast = (message: string, variant: "success" | "destructive" | "info") => {
    // 型定義に variant が含まれていないため、any としてキャスト
    addToast({ message, variant } as any);
  };

  const [isAdding, setIsAdding] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // useServices フックの型定義に create/update/delete を含めるために型アサーションを利用
  const {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
  } = useServices() as unknown as {
    services: TherapistService[];
    loading: boolean;
    error: Error | null;
    createService: (data: Partial<TherapistService>) => Promise<any>;
    updateService: (params: { id: string; set: Partial<TherapistService> }) => Promise<any>;
    deleteService: (params: { id: string }) => Promise<any>;
  };

  // フォームの初期状態
  const [formData, setFormData] = useState<Partial<TherapistService>>({
    service_name: "",
    description: "",
    duration: 0,
    price: 0,
    currency: "USD",
    is_active: true,
  });

  // 入力値を処理するヘルパー関数
  const processValue = (name: string, type: string, value: string, checked: boolean) => {
    if (type === "checkbox") {
      return checked;
    } else if (name === "duration" || name === "price") {
      return value === "" ? undefined : Number(value);
    }
    return value;
  };

  // 入力変更ハンドラ
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const processedValue = processValue(name, type, value, checked);

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Select コンポーネントの変更ハンドラ
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォームのリセット処理
  const resetForm = () => {
    setFormData({
      service_name: "",
      description: "",
      duration: 0,
      price: 0,
      currency: "USD",
      is_active: true,
    });
    setIsAdding(false);
    setEditingServiceId(null);
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 基本的なバリデーション
    if (!formData.service_name || formData.duration === undefined || formData.price === undefined) {
      showToast(t("fillRequiredFields"), "destructive");
      return;
    }

    if (!createService || !updateService) {
      console.error("Mutation functions (create/updateService) are not available.");
      showToast(t("serviceError"), "destructive");
      return;
    }

    try {
      if (editingServiceId) {
        const updateData: Partial<TherapistService> = { ...formData };
        // 更新不可のフィールドを削除（必要に応じて）
        delete (updateData as any).id;
        delete (updateData as any).created_at;
        delete (updateData as any).updated_at;

        await updateService({
          id: editingServiceId,
          set: updateData,
        });
        showToast(t("serviceUpdated"), "success");
      } else {
        const createData: Partial<TherapistService> = { ...formData };
        await createService(createData);
        showToast(t("serviceCreated"), "success");
      }
      resetForm();
    } catch (err) {
      console.error("Service operation failed:", err);
      showToast(t("serviceError"), "destructive");
    }
  };

  // 編集用ハンドラ
  const handleEdit = (service: TherapistService) => {
    setEditingServiceId(service.id);
    setFormData({
      service_name: service.service_name,
      description: service.description ?? "",
      duration: service.duration ?? 0,
      price: service.price ?? 0,
      currency: service.currency ?? "USD",
      is_active: service.is_active ?? true,
    });
    setIsAdding(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // 削除用ハンドラ
  const handleDelete = async (id: string) => {
    if (!deleteService) {
      console.error("Mutation function (deleteService) is not available.");
      showToast(t("deleteError"), "destructive");
      return;
    }
    if (window.confirm(t("confirmDelete"))) {
      try {
        await deleteService({ id });
        showToast(t("serviceDeleted"), "success");
      } catch (err) {
        console.error("Delete operation failed:", err);
        showToast(t("deleteError"), "destructive");
      }
    }
  };

  if (loading && !services) return <Spinner className="mx-auto mt-8" />;
  if (error)
    return (
      <div className="text-red-500 p-4">
        {t("fetchError")}: {(error as Error).message || "Unknown error"}
      </div>
    );

  return (
    <Card className="p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("serviceManagement")}</h2>
        {!isAdding && (
          <Button
            onClick={() => {
              setIsAdding(true);
              setEditingServiceId(null);
              resetForm();
            }}
          >
            {t("addService")}
          </Button>
        )}
      </div>

      {/* サービス一覧 */}
      {!isAdding && (
        <div className="space-y-4 mb-6">
          {services?.map((service) => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-grow mb-3 sm:mb-0">
                <h3 className="font-semibold text-lg">{service.service_name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
                <p className="text-sm mt-1">
                  {t("duration")}: {service.duration ?? "N/A"} min | {t("price")}: {service.price}{" "}
                  {service.currency}
                </p>
                <p className="text-sm mt-1">
                  {t("status")}:{" "}
                  <span
                    className={cn(
                      "font-medium px-2 py-0.5 rounded-full text-xs",
                      service.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {service.is_active ? t("active") : t("inactive")}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  disabled={loading}
                >
                  {loading ? <Spinner className="h-4 w-4" /> : t("delete")}
                </Button>
              </div>
            </div>
          ))}
          {services?.length === 0 && (
            <p className="text-gray-500 text-center py-4">{t("noServices")}</p>
          )}
        </div>
      )}

      {/* 追加／編集フォーム */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingServiceId ? t("editService") : t("addNewService")}
          </h3>
          <div>
            <Label htmlFor="service_name">
              {t("serviceName")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="service_name"
              name="service_name"
              value={formData.service_name ?? ""}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Input
              id="description"
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">
                {t("duration")} (min) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration ?? ""}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="price">
                {t("price")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price ?? ""}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">{t("currency")}</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
                name="currency"
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_active"
              name="is_active"
              checked={formData.is_active ?? true}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: !!checked }))
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              {t("isActive")}
            </Label>
          </div>

          <div className="flex space-x-2 pt-4 border-t mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {editingServiceId ? t("updateService") : t("createService")}
            </Button>
            <Button variant="outline" type="button" onClick={resetForm} disabled={loading}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
