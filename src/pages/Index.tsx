import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFilter } from "@/context/FilterContext";
import ListingsContainer from "@/components/ListingsContainer";
import SubCategoryMenu from "@/components/SubCategoryMenu";
import { updateSavedStatus } from "@/utils/listingUtils";

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { category, subCategory, searchQuery, listings, isLoading } = useFilter();

  return (
    <div className="w-full pb-0">
      {/* Show subcategory menu if a category is selected */}
      <SubCategoryMenu />

      {/* Main content with listings */}
      <div className="px-4 pt-2">
        <ListingsContainer
          listings={listings}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeFilter={subCategory || "All"}
          updateSavedStatus={(listings) => updateSavedStatus(listings, user?.id)}
          currentCategory={category}
        />
      </div>
    </div>
  );
};

export default Index;
