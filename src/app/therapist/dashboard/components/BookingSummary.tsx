// src/app/therapist/dashboard/components/BookingSummary.tsx
interface BookingSummaryProps {
  bookings: any[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookings }) => {
  const today = new Date().toDateString();
  const todayBookings = bookings?.filter(
    (b) => new Date(b.start_time).toDateString() === today,
  );
  const upcoming =
    todayBookings?.filter((b) => b.status === "confirmed").length ?? 0;
  const completed =
    todayBookings?.filter((b) => b.status === "completed").length ?? 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700">Today’s Bookings</h3>
      <p className="text-2xl text-gray-800">{todayBookings?.length || 0}</p>
      <p className="text-sm text-gray-600">Upcoming: {upcoming}</p>
      <p className="text-sm text-gray-600">Completed: {completed}</p>
    </div>
  );
};

export default BookingSummary;
