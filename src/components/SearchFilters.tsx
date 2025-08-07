import { useState } from "react";
import { Filter, ArrowDownUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/utils/mockData";
import RadiusSelector from "./RadiusSelector";

interface SearchFiltersProps {
  onCategoryChange: (category: string) => void;
  onRadiusChange: (radius: number) => void;
}

const SearchFilters = ({
  onCategoryChange,
  onRadiusChange,
}: SearchFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-hide bg-transparent">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 border-gray-200 text-xs md:h-6 md:text-xs md:px-2"
          >
            <Filter className="h-3 w-3 text-brand" />
            <span className="text-xs">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-8 text-xs ${
                      selectedCategory === category
                        ? "bg-brand/20 text-brand font-medium"
                        : ""
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {selectedCategory === category && (
                      <Check className="h-3 w-3 mr-1 text-brand" />
                    )}
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <RadiusSelector onChange={onRadiusChange} />
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 border-gray-200 text-xs md:h-6 md:text-xs md:px-2"
      >
        <ArrowDownUp className="h-3 w-3 text-brand" />
        <span className="text-xs">Sort</span>
      </Button>

      <div className="flex gap-1">
        {categories.slice(0, 5).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs whitespace-nowrap px-3 md:h-6 md:text-xs md:px-2.5 md:py-0.5 font-medium ${
              selectedCategory === category
                ? "bg-brand hover:bg-brand/90"
                : "border-gray-200"
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
