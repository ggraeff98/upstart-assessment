export default function ForecastSkeleton() {
  const placeholders = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {placeholders.map((_, i) => (
        <div
          key={i}
          className="bg-white border border-brand-200 rounded-2xl shadow-lg p-5 animate-pulse"
          aria-hidden="true"
        >
          <div className="h-6 w-24 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 w-20 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
