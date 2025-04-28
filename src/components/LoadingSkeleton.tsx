const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-lg border border-gray-200 min-h-[126px]"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
