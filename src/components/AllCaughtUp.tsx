import { CircleCheck, Plus } from "lucide-react";
import { Button } from "./ui/button";
import useRedirectNav from "@/hooks/useRedirectNav";

const AllCaughtUp = () => {
  const { redirectNavLink } = useRedirectNav();

  const handlePostAd = () => {
    redirectNavLink("/create-listing");
  };

  return (
    <div className="text-center py-8 rounded-lg">
      <div className="text-4xl mb-2 flex justify-center items-center font-bold">
        <CircleCheck className="text-[#ff7417] text-center font-bold" />
      </div>
      <h3 className="text-lg font-medium">You're all caught up</h3>
      <p className="text-gray-500">
        Try new keywords, cities, or a wider radius
      </p>

      <div className="flex items-center justify-center mt-4 mb-1">
        <Button
          onClick={handlePostAd}
          className="ml-1 bg-brand gap-0 text-white flex items-center justify-center rounded-full px-3 py-1.5 h-8 md:h-8 text-xs md:text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Post</span>
        </Button>
      </div>
    </div>
  );
};

export default AllCaughtUp;
