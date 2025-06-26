// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Info, Upload, X } from "lucide-react";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "./ui/checkbox";
// import LocationWithRadius from "./LocationWithRedius";

// const categoriesConfig = {
//     Marketplace: ["Item", "Service"],
//     Rides: ["Available", "Looking"],
//     Accommodations: ["Available", "Looking"],
//     Jobs: ["Hiring", "Looking"],
// };

// const categories = Object.keys(categoriesConfig);

// // Zod schema for validation
// const formSchema = z.object({
//     category: z.enum(categories as [string, ...string[]], {
//         errorMap: () => ({ message: "Category is required" }) // Custom error message for category
//     }),
//     subCategory: z.string(),
//     title: z.string().trim().min(5, "Title must be at least 5 characters").max(55, "Title must be less than 55 characters"),
//     description: z.string().optional(),
//     image: z
//         .any()
//         .refine((file) => !file || (file instanceof File), {
//             message: "Must be a valid file",
//         })
//         .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
//             message: "File size must be less than 5MB"
//         })
//         .optional(),
//     isUSA: z.boolean().optional(),
// });

// function PostListingForm() {
//     const [imagePreview, setImagePreview] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [cities, setCities] = useState<string[]>([]);
//     const [radius, setRadius] = useState(0);

//     const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             category: "",
//             subCategory: "",
//             title: "",
//             description: "",
//             image: null,
//             isUSA: false
//         }
//     });

//     const selectedCategory = watch("category");
//     const selectedSubCategory = watch("subCategory");
//     const titleLength = watch("title")?.length || 0;

//     const showPhotoUpload = selectedCategory === "Marketplace" || selectedCategory === "Accommodations";
//     const availableSubCategories = categoriesConfig[selectedCategory]

//     const onSubmit = async (data) => {
//         try {
//             const formData = new FormData();
//             if (data.image) {
//                 formData.append('image', data.image);
//             }
//             formData.append('category', data.category);
//             formData.append('subCategory', data.subCategory);
//             formData.append('title', data.title);
//             formData.append('description', data.description || '');
//             // if(data.subCategory === 'Service')
//             formData.append('post_to_usa', data.isUSA ? 'true' : 'false');

//             console.log("Form Data:", data);
//             console.log("Form citis", cities)
//             console.log("Form radius", radius)

//             // or submit to your API
//         } catch (error) {
//             console.error("Error submitting form:", error);

//         } finally {
//             setIsSubmitting(false);
//             // Reset form or show success message
//             setValue("category", "");
//             setValue("subCategory", "");
//             setValue("title", "");
//             setValue("description", "");
//             setValue("image", null);
//             setValue("isUSA", false);
//             setImagePreview(null);
//         }
//     };


//     const handleImageChange = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 alert("Image size must be less than 5MB");
//                 return;
//             }
//             setValue("image", file);
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     const handleCategoryChange = (value: string) => {
//         setValue('category', value)
//     }

//     const handleSubCategoryChange = (value: string) => {
//         setValue('subCategory', value)
//     }


//     const removeImage = () => {
//         setValue("image", null);
//         setImagePreview(null);
//         if (imagePreview) {
//             URL.revokeObjectURL(imagePreview);
//         }
//     };

//     useEffect(() => {
//         return () => {
//             if (imagePreview) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);



//     useEffect(() => {
//         // When the category changes, set the first sub-category as the default
//         if (selectedCategory) {
//             const firstSubCategory = categoriesConfig[selectedCategory]?.[0];
//             setValue("subCategory", firstSubCategory);
//         }
//     }, [selectedCategory, setValue]);


//     useEffect(()=> {
//         if(!(selectedSubCategory === 'Service' || selectedSubCategory === 'Hiring')){
//             setValue('isUSA', false)
//         }
//     }, [selectedSubCategory, setValue])





//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-lg  max-w-3xl mx-auto">
//             {/* Category Selection */}
//             {/* <div className="space-y-2">
//                 <label htmlFor="category" className="block font-medium">Category</label>
//                 <Controller
//                     name="category"
//                     control={control}
//                     render={({ field }) => (
//                         <select {...field} id="category" className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#e5ebee]">
//                             <option value="">Select a category</option>
//                             {categories.map((category) => (
//                                 <option key={category} value={category}>
//                                     {category}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 />
//                 {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
//             </div> */}

//             {/* Sub-category Selection */}
//             {/* <div className="space-y-2">
//                 <label htmlFor="subCategory" className="block font-medium">Sub Category</label>
//                 <Controller
//                     name="subCategory"
//                     control={control}
//                     render={({ field }) => (
//                         <select {...field} id="subCategory" className=" block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#e5ebee] ">
//                             {!selectedCategory && <option value="">Select a sub-category</option>}
//                             {categoriesConfig[selectedCategory]?.map((subCategory) => (
//                                 <option key={subCategory} value={subCategory}>
//                                     {subCategory}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 />
//                 {errors.subCategory && <p className="text-red-500 text-sm">{errors.subCategory.message}</p>}
//             </div>
//  */}



//   <div className="space-y-2">
//     <label htmlFor="category" className="block text-black font-medium text-sm">
//       Category
//     </label>
//     <Controller
//       name="category"
//       control={control}
//       render={({ field }) => (
//         <>
//           <Select 
//             value={field.value} 
//             onValueChange={(value) => {
//               field.onChange(value);
//               handleCategoryChange(value);
//             }}
//           >
//             <div className="relative">
//               <SelectTrigger 
//                 id="category"
//                 className="bg-[#e5ebee] rounded-xl focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 w-full p-3 border border-gray-300"
//               >
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//             </div>
//             <SelectContent>
//               {categories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.category && (
//             <p className="text-xs font-normal -mt-[6.5px] text-[#b3261e]">
//               {errors.category.message}
//             </p>
//           )}
//         </>
//       )}
//     />
//   </div>

//   {/* Sub-Category Select */}
//   <div className="space-y-2">
//     <label htmlFor="subCategory" className="block text-black font-medium text-sm">
//       Sub-Category
//     </label>
//     <Controller
//       name="subCategory"
//       control={control}
//       render={({ field }) => (
//         <>
//           <Select 
//             value={field.value} 
//             onValueChange={(value) => {
//               field.onChange(value);
//               handleSubCategoryChange(value);
//             }}
//           >
//             <div className="relative">
//               <SelectTrigger 
//                 id="subCategory"
//                 className="bg-[#e5ebee] rounded-xl focus:ring-[.75px] focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 w-full p-3 border border-gray-300"
//               >
//                 <SelectValue placeholder="Select a sub-category" />
//               </SelectTrigger>
//             </div>
//             <SelectContent>
//               {availableSubCategories?.map((subCategory) => (
//                 <SelectItem key={subCategory} value={subCategory}>
//                   {subCategory}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.subCategory && (
//             <p className="text-xs font-normal -mt-[6.5px] text-[#b3261e]">
//               {errors.subCategory.message}
//             </p>
//           )}
//         </>
//       )}
//     />
//   </div>


//             {/* Title Field */}
//             <div className="space-y-2">
//                 <label htmlFor="title" className="block text-black text-sm font-medium">
//       Title
//     </label>
//                 <Controller
//                     name="title"
//                     control={control}
//                     render={({ field }) => (
//                         <div className="relative">
//                             <input
//                                 {...field}
//                                 id="title"
//                                 placeholder="Enter a descriptive title"
//                                 className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#e5ebee]"
//                                 maxLength={55}
//                             />
//                             <div className="absolute bottom-[-20px] right-2 text-xs text-gray-500  px-1 rounded">
//                                 {titleLength}/55
//                             </div>
//                         </div>

//                     )}
//                 />

//                 {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//             </div>


//             {/* Description Field */}
//             <div className="space-y-2">
//                 <label htmlFor="description" className="block font-medium text-sm">Description (optional)</label>
//                 <Controller
//                     name="description"
//                     control={control}
//                     render={({ field }) => <textarea {...field}
//                         id="description"
//                         placeholder="Describe your listing in detail"
//                         className="min-h-[120px] resize-none overflow-hidden bg-[#e5ebee] focus-visible:outline-none  rounded-xl w-full p-2 ring-1 ring-transparent focus:ring-orange-500" />}
//                 />
//             </div>

//             {/* Images Field (conditionally visible for Marketplace and Accommodations) */}
//             {/* {(selectedCategory === "Marketplace" || selectedCategory === "Accommodations") && (
//                 <div className="space-y-2">
//                     <label htmlFor="image" className="block font-medium">Upload Photo (optional)</label>
//                     <Controller
//                         name="image"
//                         control={control}
//                         render={({ field: { onChange, value, ...rest } }) => (
//                             <input
//                                 id="image"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => onChange(e.target.files?.[0] || null)}
//                                 className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 {...rest}
//                             />
//                         )}
//                     />
//                     {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
//                 </div>
//             )}

//             {watch("image") && (
//                 <div className="mt-2">
//                     <img
//                         src={URL.createObjectURL(watch("image"))}
//                         alt="Preview"
//                         className="h-32 object-cover rounded"
//                     />
//                 </div>
//             )} */}

//             {/* Image Upload Section */}
//             {showPhotoUpload && (
//                 <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                         <label className="block text-black text-sm font-medium">
//       Upload Photo (optional)
//     </label>
//                         <p className="text-xs text-gray-500">1 Photo of Max 5MB</p>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 mb-4">
//                         {imagePreview ? (
//                             <div className="relative h-32 border rounded-md overflow-hidden">
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="h-full w-full object-cover"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={removeImage}
//                                     className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
//                                 >
//                                     <X size={16} />
//                                 </button>
//                             </div>
//                         ) : (
//                             <label className="h-32 border-2 border-dashed bg-[#e5ebee] border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                     disabled={isSubmitting}
//                                 />
//                                 <Upload size={24} className="text-gray-400 mb-2" />
//                                 <span className="text-sm text-gray-500">Upload</span>
//                             </label>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Location Field */}
//             <div className="space-y-2">
//                 <label htmlFor="location" className="block font-medium text-sm">Location</label>
//                 <div className="mt-2 flex justify-end bg-[#E5EBEE] rounded-md">
//                     <div className="w-64">
//                       <LocationWithRadius
//                         className="bg-transparent outline-0 border-0 hover:bg-transparent justify-end"
//                         setCities={setCities}
//                         notSetDefault={true}
//                         setNearByRadius={setRadius}
//                       />
//                     </div>
//                     </div>
//             </div>

//             {/* Is USA Checkbox */}
//             {(selectedCategory === "Marketplace" && selectedSubCategory === "Service") ||
//                 (selectedCategory === "Jobs" && selectedSubCategory === "Hiring") ? (
//                 <div className="space-y-2">
//                     <div className="flex justify-end items-center space-x-3">
//                         <div className="flex items-center space-x-1">
//                             <TooltipProvider>
//                                 <Tooltip>
//                                     <TooltipTrigger asChild>
//                                         <Info className="h-4 w-4 text-gray-500 cursor-help" />
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                         <p className="w-[200px] text-sm">
//                                             Reviewed by Desieasy team, will go live if approved.
//                                         </p>
//                                     </TooltipContent>
//                                 </Tooltip>
//                             </TooltipProvider>
//                             <label htmlFor="isUSA" className="text-sm font-medium">
//                                 Also post in USA Listings
//                             </label>
//                         </div>
//                         <Controller
//                             name="isUSA"
//                             control={control}
//                             render={({ field }) => (
//                                 <Checkbox
//                                     checked={field.value}
//                                     onCheckedChange={field.onChange}
//                                 />
//                             )}
//                         />
//                     </div>
//                 </div>
//             ) : null}

//             {/* Submit Button */}
//             <div className="flex justify-end items-center">

//                 <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-md">Post Listing</button>
//             </div>
//         </form>
//     );
// }

// export default PostListingForm;



import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Upload, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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

const categoriesConfig = {
  Marketplace: ["Item", "Service"],
  Rides: ["Available", "Looking"],
  Accommodations: ["Available", "Looking"],
  Jobs: ["Hiring", "Looking"],
};

const categories = Object.keys(categoriesConfig);

const formSchema = z.object({
  category: z.enum(categories as [string, ...string[]], {
    errorMap: () => ({ message: "Category is required" }),
  }),
  subCategory: z.string(),
  title: z.string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(75, "Title must be less than 55 characters"),
  // description: z.string().optional(),
  description: z.string().max(3000, "Description must be less than 3000 characters").optional(),
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
  zip: number | [number];
  lat: number;
  lng: number;
  city: string;
  state_id: string;
  state_name: string;
  search: string;
}

function PostListingForm() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const isEditMode = !!listingId;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [cities, setCities] = useState<string[]>([]);
  const [radius, setRadius] = useState(0);
  const [defaultLocation, setDefaultLocation] = useState<Location | null>(null)
  const [defaultRadius, setDefaultRadius] = useState(0)
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([])
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [isOpenPending, setIsOpenPending] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { setFormData, user } = useAuth()



  const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
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


  const showPhotoUpload = selectedCategory === "Marketplace" || selectedCategory === "Accommodations";
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
          category: listing.category?.charAt(0).toUpperCase() + listing.category.slice(1).toLowerCase(),
          subCategory: listing.sub_category?.charAt(0).toUpperCase() + listing.sub_category.slice(1).toLowerCase(),
          title: listing.title,
          description: listing.description || '',
          isUSA: listing.post_to_usa,
        };

        // Initialize available subcategories
        const initialSubCategories = categoriesConfig[initialData.category as keyof typeof categoriesConfig] || [];
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
          console.log("listing cities => ", listing.cities)

          setDefaultLocation({
            lat: Number(listing.latitude),
            lng: Number(listing.longitude),
            search: listing.address,
            zip: 123456,
            city: listing?.address?.split(',')?.[0],
            state_id: listing?.address?.split(',')?.[1],
            state_name: listing?.address?.split(',')?.[1],
          })
        }


        if (listing.radius) {
          setRadius(listing.radius);
          setDefaultRadius(listing.radius)
        }

      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId, isEditMode, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Common fields
      if (data.image) {
        formData.append('image', data.image);
      } else if (isEditMode && typeof imagePreview === 'string' && imagePreview.startsWith('http')) {
        // Preserve existing image URL if not changed
        formData.append('image_url', imagePreview);
      }

      formData.append('category', data.category.toUpperCase());
      formData.append('sub_category', data.subCategory.slice(0, 1).toUpperCase() + data.subCategory.slice(1).toLowerCase());
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('post_to_usa', data.isUSA ? 'true' : 'false');

      // Location fields
      formData.append('address', currentLocation?.search);
      formData.append('latitude', String(currentLocation?.lat));
      formData.append('longitude', String(currentLocation?.lng));

      const fomatedCities = cities?.map((location: any) => ({
        address: location.search,
        latitude: location.lat,
        longitude: location.lng,
      }));

      formData.append('cities', JSON.stringify(fomatedCities));

      // formData.append('address', String(cities?.[0]?.search));
      // formData.append('latitude', (cities?.[0] as any)?.lat?.toString() || '');
      // formData.append('longitude', (cities?.[0] as any)?.lng?.toString() || '');

      formData.append('radius', radius.toString());

      // console.log("form data => ", data)
      // console.log("cities => ", cities)
      // console.log("radius => ", radius)

      if (!user) {
        // setFormData(formData)
        openModal('login')
        return
      }

      if (isEditMode) {
        const response = await api.patch(`/listings/${listingId}`, formData);

        console.log(response.data)
        if (response.data.success) {
          if (data.isUSA) {
            setIsOpenPending(true);
          } else {
            setIsOpenSuccess(true);
          }
        } else {
          setIsOpenError(true);
        }
      } else {
        const response = await api.post('/listings', formData);
        // console.log("Listing created successfully");
        // Reset form for new listings
        console.log(response.data)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setValue("image", file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // const handleCategoryChange = (value: string) => {
  //   setValue('category', value);
  // };

  const handleCategoryChange = (value: string) => {
    const currentSubCategory = watch("subCategory");
    const newSubCategories = categoriesConfig[value as keyof typeof categoriesConfig] || [];

    setValue('category', value);

    // Only reset sub-category if current one isn't valid for new category
    if (!newSubCategories.includes(currentSubCategory)) {
      setValue('subCategory', newSubCategories[0] || "");
    }
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
    setValue('subCategory', value);
  };

  const removeImage = () => {
    setValue("image", null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (selectedCategory) {
      const firstSubCategory = categoriesConfig[selectedCategory as keyof typeof categoriesConfig]?.[0];
      if (firstSubCategory && !isEditMode) {
        setValue("subCategory", firstSubCategory);
      }
    }
  }, [selectedCategory, setValue, isEditMode]);

  useEffect(() => {
    if (!(selectedSubCategory === 'Service' || selectedSubCategory === 'Hiring')) {
      setValue('isUSA', false);
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
      const newSubCategories = categoriesConfig[selectedCategory as keyof typeof categoriesConfig] || [];
      setAvailableSubCategories(newSubCategories);

      // If the current sub-category is not valid for the new category, reset it to the first available option
      const currentSubCategory = watch("subCategory");
      if (!newSubCategories.includes(currentSubCategory)) {
        setValue("subCategory", newSubCategories[0] || "");
      }
    }
  }, [selectedCategory, setValue, watch]); // Watch for category changes

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [descriptionLength]); 


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
            {isEditMode ? "Fetching your data..." : "Getting everything ready..."}
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-lg max-w-3xl mx-auto">
        {/* <h2 className="text-xl font-bold">
        {isEditMode ? "Edit Listing" : "Create New Listing"}
      </h2> */}

        <div className="space-y-2">
          <label htmlFor="category" className="block text-black font-medium text-sm">
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
                        {category}
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
          <label htmlFor="subCategory" className="block text-black font-medium text-sm">
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
          <label htmlFor="title" className="block text-black text-sm font-medium">
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
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
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
                  ref={textareaRef}
                  maxLength={3000}
                  {...field}
                  id="description"
                  placeholder="Describe your listing in detail"
                  className=" min-h-[120px] resize-none overflow-hidden bg-[#e5ebee] focus-visible:outline-none rounded-xl w-full p-2 ring-1 ring-transparent focus:ring-orange-500"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
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
            <div className="w-64 ml-auto">
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

        {(selectedCategory === "Marketplace" && selectedSubCategory === "Service") ||
          (selectedCategory === "Jobs" && selectedSubCategory === "Hiring") ? (
          <div className="space-y-2">
            <div className="flex justify-end items-center space-x-3">
              <div className="flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        Reviewed by Desieasy team, will go live if approved.
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
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        ) : null}

        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md disabled:opacity-50"
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

      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      />

    </>


  );
}

export default PostListingForm;