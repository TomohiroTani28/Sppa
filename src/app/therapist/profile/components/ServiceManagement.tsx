"use client";
// src/app/(therapist)/profile/components/ServiceManagement.tsx
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/Toast"; // Updated toast import
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { 
  useFetchServices,
  useCreateService,
  useUpdateService,
  useDeleteService 
} from "@/hooks/api/useServices"; // Use individual hooks

// Define TherapistService type locally
interface TherapistService {
  id: string;
  therapist_id: string;
  service_name: string;
  description?: string;
  duration: number;
  price: number;
  currency: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * ServiceManagement component for therapists to manage their services
 * @returns JSX.Element
 */
export function ServiceManagement() {
  const t = useTranslations("TherapistProfile");
  const { toast } = useToast(); // Use toast hook
  const [isAdding, setIsAdding] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  
  // Fetch services
  const { 
    data: services, 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useFetchServices();

  // Mutations
  const { mutate: createService, isLoading: createLoading } = useCreateService();
  const { mutate: updateService, isLoading: updateLoading } = useUpdateService();
  const { mutate: deleteService, isLoading: deleteLoading } = useDeleteService();

  // Form state with explicit type
  const [formData, setFormData] = useState<Partial<TherapistService>>({
    service_name: "",
    description: "",
    duration: 0,
    price: 0,
    currency: "USD",
    category: "",
    is_active: true,
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<TherapistService>) => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: Partial<TherapistService>) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      service_name: "",
      description: "",
      duration: 0,
      price: 0,
      currency: "USD",
      category: "",
      is_active: true,
    });
    setIsAdding(false);
    setEditingServiceId(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await updateService({
          id: editingServiceId,
          set: formData,
        });
        toast({
          title: t("serviceUpdated"),
          variant: "success",
        });
      } else {
        await createService(formData);
        toast({
          title: t("serviceCreated"),
          variant: "success",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: t("serviceError"),
        variant: "destructive",
      });
    }
  };

  // Handle edit
  const handleEdit = (service: TherapistService) => {
    setEditingServiceId(service.id);
    setFormData(service);
    setIsAdding(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm(t("confirmDelete"))) {
      try {
        await deleteService({ id });
        toast({
          title: t("serviceDeleted"),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("deleteError"),
          variant: "destructive",
        });
      }
    }
  };

  // Loading and error states
  if (servicesLoading) return <Spinner className="mx-auto mt-8" />;
  if (servicesError) return <div className="text-red-500">{t("fetchError")}</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("serviceManagement")}</h2>

      {/* Service List */}
      <div className="space-y-4 mb-6">
        {services?.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold">{service.service_name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
              <p className="text-sm">
                {t("duration")}: {service.duration} min | {t("price")}: {service.price} {service.currency}
              </p>
              <p className="text-sm">
                {t("status")}:{" "}
                <span
                  className={cn(
                    "font-medium",
                    service.is_active ? "text-green-500" : "text-red-500"
                  )}
                >
                  {service.is_active ? t("active") : t("inactive")}
                </span>
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEdit(service)}>
                {t("edit")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(service.id)}
                disabled={deleteLoading}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
        {services?.length === 0 && (
          <p className="text-gray-500">{t("noServices")}</p>
        )}
      </div>

      {/* Add/Edit Form */}
      <Button onClick={() => setIsAdding(true)} className="mb-4">
        {t("addService")}
      </Button>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service_name">{t("serviceName")}</Label>
            <Input
              id="service_name"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="duration">{t("duration")} (min)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">{t("price")}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">{t("currency")}</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleSelectChange("currency", value)}
            >
              <SelectTrigger>
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

          <div>
            <Label htmlFor="category">{t("category")}</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev: Partial<TherapistService>) => ({ 
                  ...prev, 
                  is_active: e.target.checked 
                }))
              }
            />
            <Label htmlFor="is_active">{t("isActive")}</Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={createLoading || updateLoading}>
              {editingServiceId ? t("updateService") : t("createService")}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}