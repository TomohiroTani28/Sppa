// src/app/(common)/treatment/[id]/page.tsx
import { gql } from "@apollo/client";
import TherapistProfile from "@/app/(common)/therapists/[therapistId]/components/TherapistProfile";
import ServiceDetails from "@/app/(common)/therapists/[therapistId]/components/ServiceDetails";
import BookingButton from "@/components/BookingButton";
import graphqlClient from "@/lib/hasura-client";

// 動的レンダリングを強制して静的生成をスキップ
export const dynamic = "force-dynamic";

// GraphQLクエリ
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

// Next.js 15 の PageProps に合わせる
export interface PageProps {
  params: { therapistId: string };
}

export default async function TherapistDetailPage({ params }: PageProps) {
  const { therapistId } = params; // Promise を `await` しない

  const { data: profileData, error: profileError } = await graphqlClient.query({
    query: GET_THERAPIST_PROFILE,
    variables: { id: therapistId },
  });

  const { data: servicesData, error: servicesError } = await graphqlClient.query({
    query: GET_THERAPIST_SERVICES,
    variables: { therapistId },
  });

  if (profileError || !profileData?.therapist_profiles_by_pk) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">Error loading therapist profile or not found.</p>
      </div>
    );
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

// generateStaticParams を削除またはコメントアウト
// export async function generateStaticParams() { ... }