// src/app/(common)/treatment/[id]/page.tsx
import ServiceDetails from "@/app/(common)/therapists/[therapistId]/components/ServiceDetails";
import TherapistProfile from "@/app/(common)/therapists/[therapistId]/components/TherapistProfile";
import BookingButton from "@/components/BookingButton";
import graphqlClient from "@/lib/hasura-client";
import { gql } from "@apollo/client";

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

// Next.js 15.2.4 に合わせた型定義
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TherapistDetailPage({ params }: PageProps) {
  // params を await して id を取得
  const { id } = await params;

  // Apollo Client インスタンスを取得
  const client = await graphqlClient();

  // プロフィールデータの取得
  const { data: profileData, error: profileError } = await client.query({
    query: GET_THERAPIST_PROFILE,
    variables: { id },
  });

  // サービスデータの取得
  const { data: servicesData, error: servicesError } = await client.query({
    query: GET_THERAPIST_SERVICES,
    variables: { therapistId: id },
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
      <TherapistProfile therapistId={id} />
      {services.length > 0 ? (
        services.map((service: { id: string; service_name: string }) => (
          <ServiceDetails key={service.id} serviceId={service.id} />
        ))
      ) : (
        <p>No active services available.</p>
      )}
      <BookingButton therapistId={id} />
    </div>
  );
}