// src/hooks/api/useFetchMedia.ts
import { gql, useQuery } from "@apollo/client";

// セラピストのメディアを取得するクエリ
const GET_THERAPIST_MEDIA = gql`
  query GetTherapistMedia($therapistId: ID!, $limit: Int, $offset: Int, $filter: MediaFilter) {
    media(
      filter: { 
        therapistId: $therapistId,
        ...($filter || {})
      },
      limit: $limit,
      offset: $offset,
      orderBy: { createdAt: DESC }
    ) {
      id
      therapistId
      mediaType
      url
      caption
      isProfileImage
      isServiceImage
      isReviewImage
      accessLevel
      createdAt
    }
    mediaCount(filter: { 
      therapistId: $therapistId,
      ...($filter || {})
    })
  }
`;

// サービスに関連するメディアを取得するクエリ
const GET_SERVICE_MEDIA = gql`
  query GetServiceMedia($serviceId: ID!, $limit: Int, $offset: Int) {
    serviceMedia(
      filter: { serviceId: $serviceId }
      limit: $limit
      offset: $offset
      orderBy: { orderIndex: ASC }
    ) {
      id
      serviceId
      media {
        id
        therapistId
        mediaType
        url
        caption
        isServiceImage
        accessLevel
        createdAt
      }
      orderIndex
    }
  }
`;

interface MediaFilter {
  mediaType: string | string[] | undefined;
  isProfileImage: boolean | undefined;
  isServiceImage: boolean | undefined;
  isReviewImage: boolean | undefined;
  accessLevel: string | undefined;
}

interface FetchMediaOptions {
  limit: number | undefined;
  offset: number | undefined;
  filter: MediaFilter | undefined;
}

/**
 * セラピストのメディアを取得するカスタムフック
 */
export const useFetchMedia = (
  therapistId: string,
  options: FetchMediaOptions = {
    limit: undefined,
    offset: undefined,
    filter: undefined
  },
) => {
  const { limit = 20, offset = 0, filter } = options;

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_THERAPIST_MEDIA,
    {
      variables: {
        therapistId,
        limit,
        offset,
        filter,
      },
      skip: !therapistId,
      fetchPolicy: "cache-and-network",
    },
  );

  const media = data?.media || [];
  const totalCount = data?.mediaCount || 0;

  const loadMore = (newOffset: number) => {
    fetchMore({
      variables: {
        therapistId,
        limit,
        offset: newOffset,
        filter: filter ?? undefined,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...fetchMoreResult,
          media: [...prev.media, ...fetchMoreResult.media],
        };
      },
    });
  };

  return {
    media,
    loading,
    error,
    totalCount,
    loadMore,
    refetch,
  };
};

/**
 * サービスに関連するメディアを取得するカスタムフック
 */
export const useFetchServiceMedia = (
  serviceId: string,
  limit: number = 10,
  offset: number = 0,
) => {
  const { data, loading, error } = useQuery(GET_SERVICE_MEDIA, {
    variables: { serviceId, limit, offset },
    skip: !serviceId,
    fetchPolicy: "cache-and-network",
  });

  const serviceMedia = data?.serviceMedia || [];

  return {
    serviceMedia,
    loading,
    error,
  };
};
