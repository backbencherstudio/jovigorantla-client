import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Upload, X } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { api } from "@/lib/axois";

import loadingImg from "@/assets/Loading.svg";
import successImg from "@/assets/success.svg";
import errorImg from "@/assets/error.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import LocationWithRadius from "./LocationWithRedius";
import CustomModal from "./shared/CustomModal";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "./AuthModal";
import { afterEach } from "node:test";

const categoriesConfig = {
  Marketplace: ["Item", "Service"],
  Rides: ["Available", "Looking"],
  Accommodations: ["Available", "Looking"],
  Jobs: ["Hiring", "Looking"],
};

const normalizeCategory = (category) => {
  if (category === "Rides") {
    return "Ride";
  } else if (category === "Accommodations") {
    return "Accommodation";
  } else if (category === "Jobs") {
    return "Job";
  } else {
    return category;
  }
};

const categories = Object.keys(categoriesConfig);

const formSchema = z.object({
  category: z.enum(categories as [string, ...string[]], {
    errorMap: () => ({ message: "Category is required" }),
  }),
  subCategory: z.string().nonempty({
    message: "Sub-category is required",
  }),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(75, "Title must be less than 55 characters"),
  // description: z.string().optional(),
  description: z
    .string()
    .max(3000, "Description must be less than 3000 characters")
    .optional(),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, {
      message: "Must be a valid file",
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .optional(),
  isUSA: z.boolean().optional(),
});

interface Location {
  zips: [string];
  lat: number;
  lng: number;
  city: string;
  state_id: string;
  state_name: string;
  search: string;
}

function PostListingForm() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("id");
  const location = useLocation();
  const isEditMode = !!listingId;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [cities, setCities] = useState<string[]>([]);
  const [radius, setRadius] = useState(0);
  const [defaultLocation, setDefaultLocation] = useState<Location | null>(null);
  const [defaultRadius, setDefaultRadius] = useState(0);
  const [availableSubCategories, setAvailableSubCategories] = useState<
    string[]
  >([]);
  const {
    setFormData,
    user,
    isOpenErrorAfterLogin,
    isOpenPendingAfterLogin,
    isOpenSuccessAfterLogin,
    setIsOpenErrorAfterLogin,
    setIsOpenPendingAfterLogin,
    setIsOpenSuccessAfterLogin,
  } = useAuth();
  const [isOpenSuccess, setIsOpenSuccess] = useState(isOpenSuccessAfterLogin);
  const [isOpenPending, setIsOpenPending] = useState(isOpenPendingAfterLogin);
  const [isOpenError, setIsOpenError] = useState(isOpenErrorAfterLogin);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  interface FileRecord {
    id: number;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    file: File;
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      subCategory: "",
      title: "",
      description: "",
      image: null,
      isUSA: false,
    },
  });

  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");
  const titleLength = watch("title")?.length || 0;
  const descriptionLength = watch("description")?.length || 0;

  const showPhotoUpload =
    selectedCategory === "Marketplace" ||
    selectedCategory === "Accommodations" ||
    (selectedCategory === "Jobs" && selectedSubCategory === "Hiring");
  // let availableSubCategories = categoriesConfig[selectedCategory as keyof typeof categoriesConfig] || [];

  // console.log("availble sub categories => ", availableSubCategories)

  // Fetch listing data in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      try {
        const { data: response } = await api.get(`/listings/${listingId}`);
        const listing = response.data;

        // Transform data to match form structure
        const initialData = {
          category:
            listing.category?.charAt(0).toUpperCase() +
            listing.category.slice(1).toLowerCase(),
          subCategory:
            listing.sub_category?.charAt(0).toUpperCase() +
            listing.sub_category.slice(1).toLowerCase(),
          title: listing.title,
          description: listing.description || "",
          isUSA: listing.post_to_usa,
        };

        // Initialize available subcategories
        const initialSubCategories =
          categoriesConfig[
            initialData.category as keyof typeof categoriesConfig
          ] || [];
        setAvailableSubCategories(initialSubCategories);

        // Set form values
        reset(initialData);

        // find availble sub categories
        // availableSubCategories = categoriesConfig[(listing.category?.charAt(0).toUpperCase() + listing.category.slice(1).toLowerCase()) as keyof typeof categoriesConfig] || []
        // console.log(availableSubCategories)

        // Handle image
        if (listing.image_url) {
          setImagePreview(listing.image_url);
        }

        // Handle location data
        if (listing.cities) {
          setCities(listing.cities);
          // console.log("listing cities => ", listing.cities)

          setDefaultLocation({
            lat: Number(listing.latitude),
            lng: Number(listing.longitude),
            search: listing.address,
            zips: null,
            city: listing?.address?.split(",")?.[0],
            state_id: listing?.address?.split(",")?.[1],
            state_name: listing?.address?.split(",")?.[1],
          });
        }

        if (listing.radius) {
          setRadius(listing.radius);
          setDefaultRadius(listing.radius);
        }
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId, isEditMode, reset]);

  useEffect(() => {
    setIsOpenError(isOpenErrorAfterLogin);
    setIsOpenPending(isOpenPendingAfterLogin);
    setIsOpenSuccess(isOpenSuccessAfterLogin);
  }, [isOpenPendingAfterLogin, isOpenErrorAfterLogin, isOpenSuccessAfterLogin]);

  const resizeTextarea1 = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    const isEditMode = searchParams.has("id");

    if (!isEditMode) {
      // Full reset logic
      reset({
        category: "",
        subCategory: "",
        title: "",
        description: "",
        image: null,
        isUSA: false,
      });

      // Clear other related state
      setImagePreview(null);
      setCities([]);
      setRadius(0);
      setCurrentLocation(null);
      setAvailableSubCategories([]);
      //  console.log('Reset completed');

      // // If using default values from props
      //   reset({
      //     category: "",
      //     subCategory: "",
      //     title: "",
      //     description: "",
      //     image: null,
      //     isUSA: false,
      //   });

      setTimeout(resizeTextarea1, 0);
    }
  }, [location.key, reset, searchParams]);

  // useEffect(() => {
  //   resizeTextarea1();
  // }, [watch("description"), resizeTextarea1]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      const formDataAfterLogin = {};

      // Common fields
      if (data.image) {
        // console.log("image => ", data.image);
        // console.log("type => ", typeof data.image);
        // console.log("instanceof File => ", data.image instanceof File);
        formData.append("image", data.image, data.image.name);

        // localStorage.setItem('image', data.image)
      } else if (
        isEditMode &&
        typeof imagePreview === "string" &&
        imagePreview.startsWith("http")
      ) {
        // Preserve existing image URL if not changed
        formData.append("image_url", imagePreview);
      }

      formData.append("category", data.category.toUpperCase());
      formData.append(
        "sub_category",
        data.subCategory.slice(0, 1).toUpperCase() +
          data.subCategory.slice(1).toLowerCase()
      );
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("post_to_usa", data.isUSA ? "true" : "false");

      // after login
      formDataAfterLogin["category"] = data.category.toUpperCase();
      formDataAfterLogin["sub_category"] =
        data.subCategory.slice(0, 1).toUpperCase() +
        data.subCategory.slice(1).toLowerCase();
      formDataAfterLogin["title"] = data.title;
      formDataAfterLogin["description"] = data.description || "";
      formDataAfterLogin["post_to_usa"] = data.isUSA ? "true" : "false";

      // Location fields
      formData.append("address", currentLocation?.search);
      formData.append("latitude", String(currentLocation?.lat));
      formData.append("longitude", String(currentLocation?.lng));

      formDataAfterLogin["address"] = currentLocation?.search;
      formDataAfterLogin["latitude"] = String(currentLocation?.lat);
      formDataAfterLogin["longitude"] = String(currentLocation?.lng);

      // after login
      formDataAfterLogin["category"] = data.category.toUpperCase();
      formDataAfterLogin["sub_category"] =
        data.subCategory.slice(0, 1).toUpperCase() +
        data.subCategory.slice(1).toLowerCase();
      formDataAfterLogin["title"] = data.title;
      formDataAfterLogin["description"] = data.description || "";
      formDataAfterLogin["post_to_usa"] = data.isUSA ? "true" : "false";

      // Location fields
      // formData.append("address", currentLocation?.search);
      // formData.append("latitude", String(currentLocation?.lat));
      // formData.append("longitude", String(currentLocation?.lng));

      // // after login
      // formDataAfterLogin["address"] = currentLocation?.search;
      // formDataAfterLogin["latitude"] = String(currentLocation?.lat);
      // formDataAfterLogin["longitude"] = String(currentLocation?.lng);

      const fomatedCities = cities?.map((location: any) => ({
        address: location.search,
        latitude: location.lat,
        longitude: location.lng,
      }));

      formData.append("cities", JSON.stringify(fomatedCities));

      // after login
      formDataAfterLogin["cities"] = JSON.stringify(fomatedCities);

      // formData.append('address', String(cities?.[0]?.search));
      // formData.append('latitude', (cities?.[0] as any)?.lat?.toString() || '');
      // formData.append('longitude', (cities?.[0] as any)?.lng?.toString() || '');

      formData.append("radius", radius.toString());

      // after login
      formDataAfterLogin["radius"] = radius.toString();

      // console.log("form data => ", data)
      // console.log("cities => ", cities)
      // console.log("radius => ", radius)

      if (!user) {
        setFormData(formDataAfterLogin);
        localStorage.setItem("afterLogin", JSON.stringify(formDataAfterLogin));
        openModal("login");
        return;
      }

      if (isEditMode) {
        if (!imagePreview) {
          formData.append("image", null);
        }
        const response = await api.patch(`/listings/${listingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log(response.data)
        if (response.data.success) {
          if (data.isUSA) {
            setIsOpenPending(true);
          } else {
            setIsOpenSuccess(true);
          }
          await wipeDatabaseCompletely();
        } else {
          setIsOpenError(true);
        }
      } else {
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await api.post("/listings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log("Listing created successfully");
        // Reset form for new listings

        if (response.data.success) {
          reset();
          setImagePreview(null);
          if (data.isUSA) {
            setIsOpenPending(true);
          } else {
            setIsOpenSuccess(true);
          }
        } else {
          setIsOpenError(true);
        }
      }

      // Handle success (redirect, show toast, etc.)
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsOpenError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  let dbInstance: IDBDatabase | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        return resolve(dbInstance);
      }

      const request = indexedDB.open("MyFileStorage", 1);

      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        dbInstance = target.result;
        if (!dbInstance.objectStoreNames.contains("files")) {
          dbInstance.createObjectStore("files", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const wipeDatabaseCompletely = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Close existing connection if open
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }

      const request = indexedDB.deleteDatabase("MyFileStorage");

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);

      request.onblocked = () => {
        // If blocked, wait and try again
        setTimeout(() => {
          indexedDB.deleteDatabase("MyFileStorage").onsuccess = () => resolve();
        }, 200);
      };
    });
  };

  const storeFile = async (file: File): Promise<void> => {
    const db = await openDB();

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("files", "readwrite");
      const store = transaction.objectStore("files");

      const fileRecord: FileRecord = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        file: file,
      };

      const request = store.add(fileRecord);

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setValue("image", file);
    await storeFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // const handleCategoryChange = (value: string) => {
  //   setValue('category', value);
  // };

  const handleCategoryChange = (value: string) => {
    // const currentSubCategory = watch("subCategory");
    const newSubCategories =
      categoriesConfig[value as keyof typeof categoriesConfig] || [];
    setAvailableSubCategories(newSubCategories);
    setValue("subCategory", "");

    setValue("category", value);

    // Only reset sub-category if current one isn't valid for new category
    // if (!newSubCategories.includes(currentSubCategory)) {
    //   setValue('subCategory', newSubCategories[0] || "");
    // }
  };

  // useEffect(() => {
  //   if (selectedCategory) {
  //     setAvailableSubCategories(categoriesConfig[selectedCategory as keyof typeof categoriesConfig] || [])
  //   }
  // },[selectedCategory])

  // Update your handleCategoryChange function to preserve existing sub-category if valid
  // const handleCategoryChange = (value: string) => {
  //   const currentSubCategory = watch("subCategory");
  //   const newSubCategories = categoriesConfig[value as keyof typeof categoriesConfig] || [];

  //   // Keep current sub-category if it exists in the new category's options
  //   const shouldKeepSubCategory = newSubCategories.includes(currentSubCategory);

  //   setValue('category', value);

  //   if (!shouldKeepSubCategory && newSubCategories.length > 0) {
  //     // Only reset if current sub-category isn't valid for new category
  //     setValue('subCategory', newSubCategories[0]);
  //   }
  // };

  const handleSubCategoryChange = (value: string) => {
    setValue("subCategory", value);
  };

  const removeImage = async () => {
    setValue("image", null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    await wipeDatabaseCompletely();
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     const firstSubCategory = categoriesConfig[selectedCategory as keyof typeof categoriesConfig]?.[0];
  //     if (firstSubCategory && !isEditMode) {
  //       setValue("subCategory", firstSubCategory);
  //     }
  //   }
  // }, [selectedCategory, setValue, isEditMode]);

  useEffect(() => {
    if (
      !(selectedSubCategory === "Service" || selectedSubCategory === "Hiring")
    ) {
      setValue("isUSA", false);
    }
  }, [selectedSubCategory, setValue]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     const newSubCategories = categoriesConfig[selectedCategory as keyof typeof categoriesConfig] || [];
  //     setAvailableSubCategories(newSubCategories);

  //     // Only reset sub-category if the current one isn't in the new list
  //     const currentSubCategory = watch("subCategory");
  //     if (!newSubCategories.includes(currentSubCategory)) {
  //       setValue("subCategory", newSubCategories[0] || "");
  //     }
  //   }
  // }, [selectedCategory, setValue, watch]);

  useEffect(() => {
    if (selectedCategory) {
      // Get the available subcategories for the selected category
      const newSubCategories =
        categoriesConfig[selectedCategory as keyof typeof categoriesConfig] ||
        [];
      setAvailableSubCategories(newSubCategories);

      // If the current sub-category is not valid for the new category, reset it to the first available option
      // const currentSubCategory = watch("subCategory");
      // if (!newSubCategories.includes(currentSubCategory)) {
      //   setValue("subCategory", newSubCategories[0] || "");
      // }
    }
  }, [selectedCategory, setValue, watch]); // Watch for category changes

  // const resizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
  //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   textarea.style.height = 'auto';
  //   textarea.style.height = `${textarea.scrollHeight}px`;
  //   window.scrollTo(0, scrollTop);
  // }, []);

  // const resizeTextarea = useCallback(() => {
  //   if (!textareaRef.current) return;

  //   // Store current scroll position
  //   const { scrollTop } = document.documentElement || document.body;

  //   // Reset and set height
  //   textareaRef.current.style.height = 'auto';
  //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

  //   // Restore scroll position (prevents jump)
  //   window.requestAnimationFrame(() => {
  //     window.scrollTo(0, scrollTop);
  //   });
  // }, []);

  //   // Trigger resize when description changes (including initial load)
  //   useEffect(() => {
  //     resizeTextarea();
  //   }, [watch("description"), resizeTextarea]);

  // Working resize function
  const resizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    window.scrollTo(0, scrollTop);
  }, []);

  // Trigger resize on initial load and updates
  useEffect(() => {
    if (textareaRef.current && watch("description")) {
      resizeTextarea(textareaRef.current);
    }
  }, [watch("description"), resizeTextarea]);

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const activeElement = e.target as HTMLElement;
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT"
      ) {
        setTimeout(() => {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-lg p-6 max-w-3xl mx-auto">
        {/* Animated logo or icon */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-75"></div>
          <div className="absolute inset-2 rounded-full bg-orange-500 flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Progress text */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-medium text-gray-800">
            {isEditMode ? "Loading your listing" : "Preparing the form"}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Fetching your data..."
              : "Getting everything ready..."}
          </p>
        </div>

        {/* Optional progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 max-w-xs">
          <div className="bg-orange-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 py-4 bg-white min-h-[calc(100vh-110px)]">
        {/*  min-h-[calc(100vh-160px)] */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white px-4 rounded-lg max-w-3xl mx-auto"
        >
          {/* <h2 className="text-xl font-bold">
        {isEditMode ? "Edit Listing" : "Create New Listing"}
      </h2> */}

          <div className="space-y-2 pt-2">
            <label
              htmlFor="category"
              className="block text-black font-medium text-sm  "
            >
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                    disabled={isEditMode}
                  >
                    <div className="relative">
                      <SelectTrigger
                        id="category"
                        className="bg-[#e5ebee] rounded-xl focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 w-full p-3 border border-gray-300"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {normalizeCategory(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs font-normal -mt-[6.5px] text-[#b3261e]">
                      {errors.category.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="subCategory"
              className="block text-black font-medium text-sm"
            >
              Sub-Category
            </label>
            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSubCategoryChange(value);
                    }}
                    disabled={isEditMode}
                  >
                    <div className="relative">
                      <SelectTrigger
                        id="subCategory"
                        className="bg-[#e5ebee] rounded-xl focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 w-full p-3 border border-gray-300"
                      >
                        <SelectValue placeholder="Select a sub-category" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      {availableSubCategories.map((subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subCategory && (
                    <p className="text-xs font-normal -mt-[6.5px] text-[#b3261e]">
                      {errors.subCategory.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-black text-sm font-medium"
            >
              Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    id="title"
                    placeholder="Enter a descriptive title"
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#e5ebee]"
                    maxLength={75}
                  />
                  <div className="absolute bottom-[-20px] right-2 text-xs text-gray-500 px-1 rounded">
                    {titleLength}/75
                  </div>
                </div>
              )}
            />
            {errors.title && (
              <p className="text-[#b3261e] text-xs font-normal">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium text-sm">
              Description (optional)
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <textarea
                    maxLength={3000}
                    {...field}
                    ref={textareaRef}
                    id="description"
                    placeholder="Describe your listing in detail"
                    className=" min-h-[120px] resize-none overflow-hidden bg-[#e5ebee] focus-visible:outline-none rounded-xl w-full p-2 ring-1 ring-transparent focus:ring-orange-500"
                    // onInput={(e) => {
                    //   const target = e.target as HTMLTextAreaElement;
                    //   target.style.height = "auto";
                    //   target.style.height = `${target.scrollHeight}px`;
                    // }}
                    // onInput={(e) => {
                    //   const target = e.target as HTMLTextAreaElement;
                    //   // Store current scroll position
                    //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    //   target.style.height = "auto";
                    //   target.style.height = `${target.scrollHeight}px`;

                    //   // Restore scroll position
                    //   window.scrollTo(0, scrollTop);
                    // }}

                    // onInput={(e) => resizeTextarea(e.target as HTMLTextAreaElement)}

                    onInput={(e) => {
                      field.onChange(e); // Ensure react-hook-form gets the change
                      resizeTextarea(e.target as HTMLTextAreaElement);
                    }}
                  />
                  <div className="absolute bottom-[-20px] right-2 text-xs text-gray-500 px-1 rounded">
                    {descriptionLength}/3000
                  </div>
                </div>
              )}
            />
          </div>

          {showPhotoUpload && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-black text-sm font-medium">
                  Upload Photo (optional)
                </label>
                <p className="text-xs text-gray-500">1 Photo of Max 5MB</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreview ? (
                  <div className="relative h-32 border rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="h-32 border-2 border-dashed bg-[#e5ebee] border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                    <input
                      type="file"
                      accept="image/*"
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

          <div className="space-y-2">
            <label htmlFor="location" className="block font-medium text-sm">
              Location
            </label>
            <div className="mt-2 bg-[#E5EBEE] rounded-md border border-gray-300 flex justify">
              <div className="w-full  ml-auto">
                <LocationWithRadius
                  // setCities={setCities}
                  // notSetDefault={true}
                  // setNearByRadius={setRadius}
                  setCities={setCities}
                  notSetDefault={true}
                  setNearByRadius={setRadius}
                  setCurrentLocation={setCurrentLocation}
                  initialLocation={defaultLocation}
                  initialRadius={defaultRadius}
                  className="w-full bg-transparent outline-0 border-0 hover:bg-transparent"
                />
              </div>
            </div>
          </div>

          {(selectedCategory === "Marketplace" &&
            selectedSubCategory === "Service") ||
          (selectedCategory === "Jobs" && selectedSubCategory === "Hiring") ? (
            <div className="space-y-2">
              <div className="flex justify-end items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip
                      open={isTooltipOpen}
                      onOpenChange={setIsTooltipOpen}
                    >
                      <TooltipTrigger asChild>
                        {/* <Info className="h-4 w-4 text-gray-500 cursor-help" 
                        onClick={(e) => {
                            // Only handle click on touch devices
                            if ('ontouchstart' in window) {
                              setIsTooltipOpen(prev => !prev);
                            }
                          }}
                      /> */}

                        <button
                          type="button"
                          onClick={() => {
                            if ("ontouchstart" in window) {
                              setIsTooltipOpen((prev) => !prev);
                            }
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-500" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          Reviewed by Desieasy team
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <label htmlFor="isUSA" className="text-sm font-medium">
                    Also post in USA Listings
                  </label>
                </div>

                <Controller
                  name="isUSA"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isUSA"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          ) : null}

          <div className="flex justify-end items-center pb-8">
            <button
              type="submit"
              className="px-6 py-2 bg-brand text-white rounded-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                ? "Update Listing"
                : "Post Listing"}
            </button>
          </div>
        </form>
      </div>

      <CustomModal
        type="success"
        open={isOpenSuccess}
        onOpenChange={(_) => {
          setIsOpenSuccessAfterLogin(false);
          setIsOpenSuccess(false);
        }}
        title={<div>Awesome! Your listing is successfully posted. </div>}
        icon={
          <img className="ml-10 h-40 w-40" src={successImg} alt="success" />
        }
      />

      {/* Pending Review Modal - shown when postToUSA is true */}
      <CustomModal
        open={isOpenPending}
        onOpenChange={(_) => {
          setIsOpenPendingAfterLogin(false);
          setIsOpenPending(false);
        }}
        title="Your listing is under review and will be live if approved."
        icon={<img className="" src={loadingImg} alt="loading" />}
      />
      <CustomModal
        open={isOpenError}
        onOpenChange={(_) => {
          setIsOpenErrorAfterLogin(false);
          setIsOpenError(false);
        }}
        type="error"
        title=" Oops! An Unexpected error has been occurred, Please refresh the page"
        icon={<img className="h-40 w-40" src={errorImg} alt="error" />}
      />

      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      />
    </>
  );
}

export default PostListingForm;
