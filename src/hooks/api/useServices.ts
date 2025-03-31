// src/hooks/api/useServices.ts
import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

// GraphQLクエリの定義
const GET_THERAPIST_SERVICES = gql`
  query GetTherapistServices($therapistId: UUID!) {
    therapist_services(
      where: { therapist_id: { _eq: $therapistId }, is_active: { _eq: true } }
      order_by: { created_at: desc }
    ) {
      id
      service_name
      description
      duration
      price
      currency
      category_id
      is_active
      created_at
      updated_at
    }
  }
`;

const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    service_categories {
      id
      name
      description
      image_url
      parent_category_id
    }
  }
`;

export interface UseServicesOptions {
  therapistId?: UUID;
  initialLoad?: boolean;
}

// UUIDはPostgreSQLのUUID型を表す文字列です
export type UUID = string;

export interface TherapistService {
  id: UUID;
  service_name: string;
  description?: string;
  duration?: number;
  price: number;
  currency: string;
  category_id?: UUID;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: UUID;
  name: string;
  description?: string;
  image_url?: string;
  parent_category_id?: UUID;
}

export interface UseServicesResult {
  services: TherapistService[];
  categories: ServiceCategory[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * セラピストが提供するサービスを取得するカスタムフック
 * @param therapistId セラピストのUUID
 * @param initialLoad 初期ロード時にデータを取得するかどうか
 */
export const useServices = ({
  therapistId,
  initialLoad = true,
}: UseServicesOptions = {}): UseServicesResult => {
  const [services, setServices] = useState<TherapistService[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // セラピストのサービス情報を取得
  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useQuery(GET_THERAPIST_SERVICES, {
    variables: { therapistId },
    skip: !therapistId || !initialLoad,
    fetchPolicy: "network-only",
  });

  // サービスカテゴリ情報を取得
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery(GET_SERVICE_CATEGORIES, {
    skip: !initialLoad,
    fetchPolicy: "cache-first",
  });

  // サービスデータが更新されたら状態を更新
  useEffect(() => {
    if (servicesData?.therapist_services) {
      setServices(servicesData.therapist_services);
    }
  }, [servicesData]);

  // カテゴリデータが更新されたら状態を更新
  useEffect(() => {
    if (categoriesData?.service_categories) {
      setCategories(categoriesData.service_categories);
    }
  }, [categoriesData]);

  // 再取得用関数
  const refetch = () => {
    refetchServices();
    refetchCategories();
  };

  return {
    services,
    categories,
    loading: servicesLoading || categoriesLoading,
    error: servicesError || categoriesError,
    refetch,
  };
};

export default useServices;
