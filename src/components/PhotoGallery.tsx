import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface PhotoGalleryProps {
  images: string[];
  listingId: string;
}

const PhotoGallery = ({ images, listingId }: PhotoGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // If there are no images, don't render anything
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-none shadow-none">
      <CardContent className="p-0">
        <h2 className="text-xl font-bold mb-2">Photo</h2>

        <div className="relative rounded-lg overflow-hidden">
          {images.length === 1 ? (
            // Single image display
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[0]}
                alt={`Listing ${listingId}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // Multiple images carousel
            <Carousel
              className="w-full"
              setApi={setApi}
              onSelect={() => {
                if (api) {
                  setActiveIndex(api.selectedScrollSnap());
                }
              }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Listing ${listingId} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
                </>
              )}
            </Carousel>
          )}
        </div>

        {/* Image counter for multiple images */}
        {images.length > 1 && (
          <div className="mt-2 text-center text-sm text-gray-500">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
