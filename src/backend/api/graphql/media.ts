// src/api/media.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/app/lib/hasura-client';

// メディアアップロードAPIエンドポイント
export const uploadMedia = async (
  therapistId: string,
  mediaType: 'photo' | 'video',
  url: string,
  caption: string
) => {
  const UPLOAD_MEDIA = gql`
    mutation UploadMedia(
      $therapistId: uuid!
      $mediaType: media_type_enum!
      $url: String!
      $caption: String
    ) {
      insert_media(
        objects: {
          therapist_id: $therapistId
          media_type: $mediaType
          url: $url
          caption: $caption
        }
      ) {
        returning {
          id
          media_type
          url
          caption
          created_at
        }
      }
    }
  `;

  const result = await hasuraClient.mutate({
    mutation: UPLOAD_MEDIA,
    variables: { therapistId, mediaType, url, caption },
  });

  return result.data.insert_media.returning[0];
};

// セラピストのメディア一覧を取得
export const getMediaList = async (therapistId: string) => {
  const GET_MEDIA_LIST = gql`
    query GetMediaList($therapistId: uuid!) {
      media(where: { therapist_id: { _eq: $therapistId } }) {
        id
        media_type
        url
        caption
        created_at
      }
    }
  `;

  const result = await hasuraClient.query({
    query: GET_MEDIA_LIST,
    variables: { therapistId },
  });

  return result.data.media;
};
