// src/app/tourist/home/components/OfferCarousel.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetchEvents } from "@/app/hooks/api/useFetchEvents";

const OfferCarousel = () => {
  const { events, loading } = useFetchEvents();

  if (loading) return <div>Loading offers...</div>;
  if (!events?.length) return <div>No offers available.</div>;

  // You could filter active events here instead
  const activeEvents = events.filter((event: any) => event.is_active);

  if (!activeEvents.length) return <div>No offers available.</div>;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">
        Special Offers
      </h2>
      <Swiper spaceBetween={10} slidesPerView={1}>
        {activeEvents.map((event: any) => (
          <SwiperSlide key={event.id}>
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <span className="text-sm">{event.discount_percentage}% OFF</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OfferCarousel;
