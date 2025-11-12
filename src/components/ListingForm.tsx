import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import LocationSelector from "@/components/LocationSelector";
import { Upload, X, ImageIcon, Info, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomModal from "./shared/CustomModal";
import loadingImg from "@/assets/Loading.svg";
import successImg from "@/assets/success.svg";
import errorImg from "@/assets/error.svg";
import { User } from "@supabase/supabase-js";
import { MdWarningAmber } from "react-icons/md";
import AutoExpandingInput from "./ui/AutoExpandingInput";
import { api } from "@/lib/axois";
import { useListing, Location } from "@/context/ListingContext";
import LocationWithRadius from "./LocationWithRedius";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_TITLE_LENGTH = 55;

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(MAX_TITLE_LENGTH, {
      message: `Title must not exceed ${MAX_TITLE_LENGTH} characters`,
    }),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" })
    .optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  subCategory: z.string().min(1, { message: "Please select a subcategory" }),
  address: z.string().optional(),
  postToUSA: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ListingFormProps {
  initialValues?: Partial<FormValues>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  user: { id: string };
  onSumbit: () => void;
}

// Define the main categories and their corresponding subcategories
const categoriesConfig = {
  Marketplace: ["Item", "Service"],
  Rides: ["Available", "Looking"],
  Accommodations: ["Available", "Looking"],
  Jobs: ["Hiring", "Looking"],
};

const categories = Object.keys(categoriesConfig);

const ListingForm = ({
  onSubmit,
  user,
  initialValues,
  isEditing = false,
  isSubmitting = false,
}: any) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialValues?.category || ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    initialValues?.subCategory || ""
  );
  const [availableSubCategories, setAvailableSubCategories] = useState<
    string[]
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showUSAOption, setShowUSAOption] = useState(false);
  const [titleLength, setTitleLength] = useState(
    initialValues?.title?.length || 0
  );
  const navigate = useNavigate();
  const { locationString } = useGeolocation();
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [isOpenPending, setIsOpenPending] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [radius, setRadius] = useState(0);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");

  const {
    createListing,
    updateListing,
    setSelectedLocation,
    selectedLocation,
  } = useListing();

  // console.log("Values => ",  initialValues)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      price: undefined,
      category: "",
      subCategory: "",
      address: locationString || "this addres",
      postToUSA: false,
    },
  });

  useEffect(() => {
    if (
      selectedCategory &&
      categoriesConfig[selectedCategory as keyof typeof categoriesConfig]
    ) {
      const subcats =
        categoriesConfig[selectedCategory as keyof typeof categoriesConfig] ||
        [];
      setAvailableSubCategories(subcats);

      const currentSubCat = form.getValues("subCategory");
      if (currentSubCat && !subcats.includes(currentSubCat)) {
        form.setValue("subCategory", subcats[0] || "");
        setSelectedSubCategory(subcats[0] || "");
      }
    } else {
      setAvailableSubCategories([]);
      form.setValue("subCategory", "");
      setSelectedSubCategory("");
    }

    form.setValue("postToUSA", false);
  }, [selectedCategory, form]);

  useEffect(() => {
    const shouldShowUSAOption =
      (selectedCategory === "Marketplace" &&
        selectedSubCategory === "Service") ||
      (selectedCategory === "Jobs" && selectedSubCategory === "Hiring");

    setShowUSAOption(shouldShowUSAOption);

    if (!shouldShowUSAOption) {
      form.setValue("postToUSA", false);
    }
  }, [selectedCategory, selectedSubCategory, form]);

  useEffect(() => {
    if (locationString && !form.getValues("address")) {
      form.setValue("address", locationString);
    }
  }, [locationString, form]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("category", value);
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value);
    form.setValue("subCategory", value);
  };

  const handleLocationChange = (location: Location) => {
    form.setValue("address", location.address);
    setSelectedLocation(location);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTitleLength(value.length);
    form.setValue("title", value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    setImages([file]);
    setImagePreviewUrls([URL.createObjectURL(file)]);
  };

  const removeImage = () => {
    if (imagePreviewUrls[0]) {
      URL.revokeObjectURL(imagePreviewUrls[0]);
    }
    setImages([]);
    setImagePreviewUrls([]);
  };

  // useEffect(()=>{
  //   if (selectedLocation) {
  //     form.setValue("address", selectedLocation.address);

  //   }
  // },[])

  const handleSubmit = async (values: FormValues) => {
    try {
      // if (!selectedLocation) {
      //   setIsOpenError(true);
      //   return;
      // }

      // Create FormData instance
      const formData = new FormData();

      // Append all form values
      formData.append("title", values.title);
      formData.append("description", values.description || ""); // Send empty string instead of null
      formData.append("category", values.category.toUpperCase());
      formData.append("sub_category", values.subCategory);
      formData.append("post_to_usa", String(values.postToUSA || false));
      console.log("While submitting => ", radius);
      formData.append("radius", String(radius));
      // Append images
      // if (images.length > 0) {
      //   formData.append('image', images[0]);
      // }

      // restructure the  cities array { address, lat, lng}
      const fomatedCities = cities?.map((location: any) => ({
        address: location.search,
        latitude: location.lat,
        longitude: location.lng,
      }));

      // console.log(cities)

      // Append the cities array as a JSON string
      formData.append(
        "cities",
        JSON.stringify([
          { latitude: 40.7831, longitude: -73.9712, address: "Manhattan" },
        ])
      );
      // formData.append('user_id', user.id);
      // formData.append('address', values.address);

      // Append coordinates with correct field names
      // formData.append('lat', String(selectedLocation.lat));
      // formData.append('lng', String(selectedLocation.lng));
      const { title, description, category, subCategory, postToUSA } = values;
      console.log({
        title,
        description,
        category,
        subCategory,
        postToUSA,
      });

      // console.log(cities)
      // console.log(radius)
      // console.log("formated cities: ", fomatedCities)

      // Handle image upload properly
      if (images[0]) {
        formData.append("image", images[0]);
      } else if (
        imagePreviewUrls[0] &&
        imagePreviewUrls[0].startsWith("http")
      ) {
        // If we have an existing image URL, send it back
        formData.append("image_url", imagePreviewUrls[0]);
      }

      await createListing(formData);
      setImages([]);
      setImagePreviewUrls([]);
      form.reset(); // Reset the form after successful submission
      setIsOpenSuccess(true);

      // if (id) {
      //   await updateListing(id, formData);
      // } else {
      //   await createListing(formData);
      // }

      // if (values.postToUSA) {
      //   setIsOpenPending(true);
      // } else {
      //   setIsOpenSuccess(true);
      // }

      // Navigate after a short delay to allow the user to see the success message
      // setTimeout(() => {
      //   navigate("/");
      // }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsOpenError(true);
    }
  };

  // Check if photo uploads should be hidden - Hide for both Rides and Jobs
  const showPhotoUpload =
    selectedCategory !== "Rides" && selectedCategory !== "Jobs";

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 bg-white rounded-lg p-4"
        >
          {/* Category & SubCategory Fields - placed in the same row */}
          <div className="grid  gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleCategoryChange}
                  >
                    <FormControl className="bg-[#e5ebee] rounded-xl focus-within:ring-0">
                      <SelectTrigger className="focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-normal -mt-[6.5px] text-[#b3261e]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategory"
              render={({ field }) => {
                console.log(field.value);
                return (
                  <FormItem>
                    <FormLabel className="text-black">Sub-Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleSubCategoryChange}
                    >
                      <FormControl className="bg-[#e5ebee] rounded-xl focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubCategories.map((subCategory) => (
                          <SelectItem key={subCategory} value={subCategory}>
                            {subCategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-normal -mt-[6.5px] text-[#b3261e]" />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-black">Title</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    <AutoExpandingInput
                      value={field.value}
                      onChange={(e) => {
                        handleTitleChange(e);
                      }}
                      placeholder="Enter a descriptive title"
                      maxLength={MAX_TITLE_LENGTH}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-400">
                        {titleLength}/{MAX_TITLE_LENGTH}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-normal absolute -bottom-1 text-[#b3261e]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Description (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your listing in detail"
                    className="min-h-[120px] resize-none overflow-hidden bg-[#e5ebee] focus-visible:outline-none focus-visible:ring-[0.75px] rounded-xl"
                    style={{ height: "auto" }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-normal -mt-[6.5px] text-[#b3261e]" />
              </FormItem>
            )}
          />

          {/* Image Upload - conditionally rendered based on category */}
          {showPhotoUpload && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel className="text-black">
                  Upload Photo (optional)
                </FormLabel>
                <p className="text-xs text-gray-500">1 Photo of Max 5MB</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-32 border rounded-md overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage()}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {imagePreviewUrls.length < 1 && (
                  <label className="h-32 border-2 border-dashed bg-[#e5ebee] border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                    <input
                      type="file"
                      accept="image/*"
                      multiple={false}
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload</span>
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="mt-2 flex justify-end bg-[#E5EBEE] rounded-md">
                    <div className="w-64">
                      <LocationWithRadius
                        className="bg-transparent outline-0 border-0 hover:bg-transparent justify-end"
                        setCities={setCities}
                        notSetDefault={true}
                        setNearByRadius={setRadius}
                      />
                    </div>
                    {/* <LocationSelector
                      onChange={handleLocationChange}
                      setCities={setCities}
                      compact
                      className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-[#e5ebee] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    /> */}
                  </div>
                  <FormMessage className="text-xs font-normal -mt-[6.5px] text-[#b3261e]" />
                </FormItem>
              )}
            />

            {/* USA Posting Option - only display for specific category/subcategory combinations */}
            {showUSAOption && (
              <FormField
                control={form.control}
                name="postToUSA"
                render={({ field }) => (
                  <FormItem className="flex justify-end space-x-3 space-y-0">
                    <div className="space-y-1 leading-none flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 mr-1 mt-1 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-sm">
                              Reviewed by Desieasy team, will go live if
                              approved.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <FormLabel className="font-medium">
                        Also post in USA Listings
                      </FormLabel>
                    </div>
                    <div className="flex flex-col justify-end">
                      <FormControl className="">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 pb-12">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mb-6 md:mb-0"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Listing"
                : "Post Listing"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Success Modal - shown when postToUSA is false */}
      <CustomModal
        type="success"
        open={isOpenSuccess}
        onOpenChange={setIsOpenSuccess}
        title={<div>Awesome! Your listing is successfully posted. </div>}
        icon={
          <img className="ml-10 h-40 w-40" src={successImg} alt="success" />
        }
      />

      {/* Pending Review Modal - shown when postToUSA is true */}
      <CustomModal
        open={isOpenPending}
        onOpenChange={setIsOpenPending}
        title="Your listing is under review and will be live if approved."
        icon={<img className="" src={loadingImg} alt="loading" />}
      />
      <CustomModal
        open={isOpenError}
        onOpenChange={setIsOpenError}
        type="error"
        title=" Oops! An Unexpected error has been occurred, Please refresh the page"
        icon={<img className="h-40 w-40" src={errorImg} alt="error" />}
      />
    </div>
  );
};

export default ListingForm;
