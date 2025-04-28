import { Search } from "lucide-react";

const NoListingsFound = () => {
  return (
    <div className="text-center py-8 rounded-lg">
      <div className="text-4xl mb-4 text-center flex justify-center items-center font-bold">
        <Search className="text-[#ff7417] text-center font-bold" />
      </div>
      <h3 className="text-lg font-medium">No listings found</h3>
      <p className="text-gray-500">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
};

export default NoListingsFound;
