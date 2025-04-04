// src/app/(common)/treatment/[id]/page.tsx
import { gql } from "@apollo/client";
import TherapistProfile from "@/app/(common)/therapists/[therapistId]/components/TherapistProfile";
import ServiceDetails from "@/app/(common)/therapists/[therapistId]/components/ServiceDetails";
import BookingButton from "@/components/BookingButton";
import graphqlClient from "@/lib/hasura-client";

// 動的レンダリングを強制して静的生成をスキップ
export const dynamic = "force-dynamic";

// GraphQL クエリ
const GET_THERAPIST_PROFILE = gql`
  query GetTherapistProfile($id: UUID!) {
    therapist_profiles_by_pk(id: $id) {
      id
      user_id
      bio
      languages
      working_hours
      status
    }
  }
`;

const GET_THERAPIST_SERVICES = gql`
  query GetTherapistServices($therapistId: UUID!) {
    therapist_services(
      where: { therapist_id: { _eq: $therapistId }, is_active: { _eq: true } }
    ) {
      id
      service_name
    }
  }
`;

// Next.js 15 の PageProps に合わせた型定義
export interface PageProps {
  params: { therapistId: string };
}

export default async function TherapistDetailPage({ params }: PageProps) {
  const { therapistId } = params;

  // Apollo Client インスタンスを取得
  const client = await graphqlClient();

  // プロフィールデータの取得
  const { data: profileData, error: profileError } = await client.query({
    query: GET_THERAPIST_PROFILE,
    variables: { id: therapistId },
  });

  // サービスデータの取得
  const { data: servicesData, error: servicesError } = await client.query({
    query: GET_THERAPIST_SERVICES,
    variables: { therapistId },
  });

  // プロフィールデータのエラーハンドリング
  if (profileError || !profileData?.therapist_profiles_by_pk) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">Error loading therapist profile or not found.</p>
      </div>
    );
  }

  // サービスデータのエラーハンドリング
  if (servicesError) {
    console.error("Error loading services:", servicesError);
  }

  const services = servicesData?.therapist_services || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <TherapistProfile therapistId={therapistId} />
      {services.length > 0 ? (
        services.map((service: { id: string; service_name: string }) => (
          <ServiceDetails key={service.id} serviceId={service.id} />
        ))
      ) : (
        <p>No active services available.</p>
      )}
      <BookingButton therapistId={therapistId} />
    </div>
  );
}