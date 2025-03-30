// src/app/lib/graphql/queries/service.ts
import { gql } from "@apollo/client";

export const GET_THERAPIST_SERVICES = gql`
  query GetTherapistServices($therapistId: uuid!) {
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
      category
      created_at
      updated_at
      is_active
      service_media {
        id
        media {
          id
          url
          caption
          media_type
        }
        order_index
      }
    }
  }
`;

export const GET_SERVICE_DETAIL = gql`
  query GetServiceDetail($serviceId: uuid!) {
    therapist_services_by_pk(id: $serviceId) {  // Removed 'api_' prefix for consistency
      id
      therapist_id
      service_name
      description
      duration
      price
      currency
      category
      is_active
      created_at
      updated_at
      service_media {
        id
        media {
          id
          url
          caption
          media_type
        }
        order_index
      }
      therapist: user {
        id
        name
        profile_picture
        therapist_profile {
          id
          bio
          experience_years
          languages
          status
        }
      }
    }
  }
`;

export const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    service_categories(order_by: { name: asc }) {  // Removed 'api_' prefix
      id
      name
      description
      image_url
      parent_category_id
      parent_category {
        id
        name
      }
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService(
    $therapist_id: uuid!
    $service_name: String!
    $description: String
    $duration: Int
    $price: numeric!
    $currency: String!
    $category: String
    $is_active: Boolean
  ) {
    insert_therapist_services(objects: {  // Removed 'api_' prefix
      therapist_id: $therapist_id,
      service_name: $service_name,
      description: $description,
      duration: $duration,
      price: $price,
      currency: $currency,
      category: $category,
      is_active: $is_active
    }) {
      returning {
        id
        therapist_id
        service_name
        description
        duration
        price
        currency
        category
        is_active
        created_at
      }
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $id: uuid!
    $service_name: String
    $description: String
    $duration: Int
    $price: numeric
    $currency: String
    $category: String
    $is_active: Boolean
  ) {
    update_therapist_services_by_pk(  // Removed 'api_' prefix
      pk_columns: { id: $id }
      _set: {
        service_name: $service_name,
        description: $description,
        duration: $duration,
        price: $price,
        currency: $currency,
        category: $category,
        is_active: $is_active
      }
    ) {
      id
      service_name
      description
      duration
      price
      currency
      category
      is_active
      updated_at
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_therapist_services_by_pk(id: $id) {  // Removed 'api_' prefix
      id
    }
  }
`;

export const ADD_SERVICE_MEDIA = gql`
  mutation AddServiceMedia(
    $service_id: uuid!
    $media_id: uuid!
    $order_index: Int
  ) {
    insert_service_media(objects: {  // Removed 'api_' prefix
      service_id: $service_id,
      media_id: $media_id,
      order_index: $order_index
    }) {
      returning {
        id
        service_id
        media_id
        order_index
      }
    }
  }
`;

export const UPDATE_SERVICE_MEDIA_ORDER = gql`
  mutation UpdateServiceMediaOrder($id: uuid!, $order_index: Int!) {
    update_service_media_by_pk(  // Removed 'api_' prefix
      pk_columns: { id: $id }
      _set: { order_index: $order_index }
    ) {
      id
      order_index
    }
  }
`;

export const REMOVE_SERVICE_MEDIA = gql`
  mutation RemoveServiceMedia($id: uuid!) {
    delete_service_media_by_pk(id: $id) {  // Removed 'api_' prefix
      id
    }
  }
`;

export const GET_SERVICES_BY_CATEGORY = gql`
  query GetServicesByCategory($category: String!) {
    therapist_services(  // Removed 'api_' prefix
      where: { category: { _eq: $category }, is_active: { _eq: true } }
      order_by: { created_at: desc }
    ) {
      id
      therapist_id
      service_name
      description
      duration
      price
      currency
      category
      therapist: user {
        id
        name
        profile_picture
        therapist_profile {
          id
          status
          location
        }
      }
    }
  }
`;

export const GET_SERVICES_BY_PRICE_RANGE = gql`
  query GetServicesByPriceRange($min_price: numeric!, $max_price: numeric!) {
    therapist_services(  // Removed 'api_' prefix
      where: { 
        price: { _gte: $min_price, _lte: $max_price },
        is_active: { _eq: true }
      }
      order_by: { price: asc }
    ) {
      id
      therapist_id
      service_name
      description
      duration
      price
      currency
      category
      therapist: user {
        id
        name
        profile_picture
      }
    }
  }
`;

export const SUBSCRIBE_TO_THERAPIST_SERVICES = gql`
  subscription SubscribeToTherapistServices($therapistId: uuid!) {
    therapist_services(  // Removed 'api_' prefix
      where: { therapist_id: { _eq: $therapistId }, is_active: { _eq: true } }
      order_by: { created_at: desc }
    ) {
      id
      service_name
      description
      duration
      price
      currency
      category
      is_active
      updated_at
    }
  }
`;