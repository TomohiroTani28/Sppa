// src/hooks/api/useFetchServiceCategories.ts
import { useQuery, gql } from "@apollo/client";

// カテゴリ取得用GraphQLクエリ
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

// 階層構造を含むカテゴリを取得するクエリ
const GET_SERVICE_CATEGORIES_WITH_HIERARCHY = gql`
  query GetServiceCategoriesWithHierarchy {
    service_categories(where: { parent_category_id: { _is_null: true } }) {
      id
      name
      description
      image_url
      children: service_categories(
        where: { parent_category_id: { _eq: "parent.id" } }
      ) {
        id
        name
        description
        image_url
      }
    }
  }
`;

// カテゴリの型定義
interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: string;
  children?: ServiceCategory[];
}

interface FetchServiceCategoriesResult {
  categories: ServiceCategory[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * サービスカテゴリ一覧を取得するカスタムフック
 * @param includeHierarchy 階層構造を含むかどうか
 */
export const useFetchServiceCategories = (
  includeHierarchy: boolean = false,
): FetchServiceCategoriesResult => {
  const query = includeHierarchy
    ? GET_SERVICE_CATEGORIES_WITH_HIERARCHY
    : GET_SERVICE_CATEGORIES;

  const { data, loading, error, refetch } = useQuery(query, {
    fetchPolicy: "cache-and-network",
  });

  // データの変換処理
  const transformData = (rawData: any): ServiceCategory[] => {
    if (!rawData) return [];

    if (includeHierarchy) {
      // 階層構造を含む場合の変換
      return rawData.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description || "",
        imageUrl: category.image_url || "",
        children:
          category.children?.map((child: any) => ({
            id: child.id,
            name: child.name,
            description: child.description || "",
            imageUrl: child.image_url || "",
            parentCategoryId: category.id,
          })) || [],
      }));
    } else {
      // フラットな構造の場合の変換
      return rawData.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description || "",
        imageUrl: category.image_url || "",
        parentCategoryId: category.parent_category_id || null,
      }));
    }
  };

  const categories = includeHierarchy
    ? transformData(data?.service_categories || [])
    : transformData(data?.service_categories || []);

  return {
    categories,
    loading,
    error,
    refetch,
  };
};
