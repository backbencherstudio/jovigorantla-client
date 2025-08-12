const ListingSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 mt-5 px-4 md:px-0">
      {/* Skeleton for a single listing */}
      {/* <div className="w-full max-w-lg h-24 bg-gray-200 animate-pulse rounded-lg shadow-md"> */}
      {/* <div className="h-24 bg-gray-300 rounded-t-lg"></div> */}
      {/* <div className="p-4">
                    <div className="h-4 bg-gray-300 w-2/3 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                    <div className="h-4 bg-gray-300 w-1/2 mt-2 rounded"></div>
                </div> */}
      {/* </div> */}
      {/* Repeat Skeleton for multiple items */}
      {/* <div className="w-full max-w-lg h-32 bg-gray-200 animate-pulse rounded-lg shadow-md"> */}
      {/* <div className="h-24 bg-gray-300 rounded-t-lg"></div> */}
      {/* <div className="p-4">
                    <div className="h-4 bg-gray-300 w-2/3 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                    <div className="h-4 bg-gray-300 w-1/2 mt-2 rounded"></div>
                </div> */}
      {/* </div> */}

      {/*  ml-4 mr-4 */}
      <div className="space-y-2  rounded-lg shadow-md p-4">
        <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
        <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
      </div>

      {/* ml-4 mr-4 */}
      <div className="space-y-2  rounded-lg shadow-md p-4">
        <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
        <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
      </div>
    </div>
  );
};
export default ListingSkeleton;
