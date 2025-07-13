import React, { useState, useEffect, act } from "react";
import { Form, useNavigate } from "react-router-dom";
import AsyncSelect from 'react-select/async';

import {
  Trash2,
  Eye,
  Ban,
  Image,
  UploadCloud,
  PlusCircle,
  Save,
  X,
  Edit,
  ExternalLink,
  Check,
  SquarePen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdGroup, Ad } from "@/types/ads";
import { v4 as uuidv4 } from "uuid";
import { format, set } from "date-fns";
import adService from "@/services/adService";
import DeleteConfirmationModal from "../shared/DeleteConfirmationModal";
import { api } from "@/lib/axois";
import { formatCategory } from "@/lib/format";
import { loadCityOptions } from "@/hooks/load-city-options";
import CitySelectorWithDetails from "../CitySelectorWithDetails";

// Page options for assigning ad groups
const PAGE_OPTIONS = [
  { id: "HOME", label: "HOME" },
  { id: "MARKETPLACE", label: "MARKETPLACE" },
  { id: "RIDES", label: "RIDES" },
  { id: "ACCOMMODATIONS", label: "ACCOMMODATIONS" },
  { id: "JOBS", label: "JOBS" },
];

const cityOptions = [
  { value: "New York", label: "New York" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "London", label: "London" },
  { value: "Paris", label: "Paris" },
  { value: "Dhaka", label: "Dhaka" },
];

// Initial mock data for ad groups
// const initialAdGroups: AdGroup[] = [
//   {
//     id: "1",
//     name: "Featured Services",
//     pages: ["home", "marketplace"],
//     rotationMode: "sequential",
//     frequency: 15,
//     active: true,
//     createdAt: new Date("2023-08-15"),
//     ads: [
//       {
//         id: "1",
//         name: "Summer Discounts",
//         image_url: "https://via.placeholder.com/600x400?text=Summer+Sale",
//         t: "https://example.com/summer-sale",
//         order: 1,
//         createdAt: new Date("2023-08-15"),
//         views: 245,
//         clicks: 32,
//         active: true,
//       },
//       {
//         id: "2",
//         name: "Student Services",
//         imageUrl: "https://via.placeholder.com/600x400?text=Student+Services",
//         targetUrl: "https://example.com/student-services",
//         order: 2,
//         createdAt: new Date("2023-08-16"),
//         views: 189,
//         clicks: 27,
//         active: true,
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "Local Businesses",
//     pages: ["marketplace", "jobs"],
//     rotationMode: "random",
//     frequency: 10,
//     active: false,
//     createdAt: new Date("2023-09-05"),
//     ads: [
//       {
//         id: "3",
//         name: "Joe's Coffee Shop",
//         imageUrl: "https://via.placeholder.com/600x400?text=Joes+Coffee",
//         targetUrl: "https://example.com/joes-coffee",
//         order: 1,
//         createdAt: new Date("2023-09-05"),
//         views: 120,
//         clicks: 18,
//         active: true,
//       },
//     ],
//   },
// ];

interface sidebarAd {
  image_url: string
  target_url: string
  active: boolean
  views: number
  clicks: number
}

const AdManagement = () => {
  const [adGroups, setAdGroups] = useState<AdGroup[]>();
  const [createMode, setCreateMode] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [adPreview, setAdPreview] = useState<string | null>(null);
  const [showAdPreview, setShowAdPreview] = useState(false);
  const [previewAdData, setPreviewAdData] = useState<{
    name: string;
    imageUrl: string;
    targetUrl: string;
    compact?: boolean;
  } | null>(null);

  const [selectedCities, setSelectedCities] = useState([]);
  const [cityData, setCityData] = useState<any[]>([]);

  const handleSelect = (options) => {
    console.log("options => ", options)
    setSelectedCities(prev => [...prev, ...options]);
  };

  const handleRemove = (cityToRemove) => {
    setSelectedCities((prev) =>
      prev.filter((city) => city.value !== cityToRemove.value)
    );
  };

  // State for sidebar ads
  const [sidebarTopFile, setSidebarTopFile] = useState<File | null>(null);
  const [sidebarBottomFile, setSidebarBottomFile] = useState<File | null>(null);
  const [sidebarTopPreview, setSidebarTopPreview] = useState<string | null>(
    null
  );
  const [sidebarBottomPreview, setSidebarBottomPreview] = useState<
    string | null
  >(null);
  const [sidebarTopUrl, setSidebarTopUrl] = useState<string>(
    "https://example.com"
  );
  const [sidebarBottomUrl, setSidebarBottomUrl] = useState<string>(
    "https://example.com"
  );

  const [sidebarTopAds, setSidebarTopAds] = useState<sidebarAd>()
  const [sidebarBottomAds, setSidebarBottomAds] = useState<sidebarAd>()



  const navigate = useNavigate();

  // Form state for new/editing ad group
  const [formState, setFormState] = useState<{
    name: string;
    display_pages: string[];
    frequency: number;
    start_date?: string;
    end_date?: string;
  }>({
    name: "",
    display_pages: [],
    frequency: 5,
    start_date: "",
    end_date: "",
  });

  // Form state for new ad
  const [newAdForm, setNewAdForm] = useState<{
    name: string;
    targetUrl: string;
    groupId: string | null;
    isAddingToExistingGroup: boolean;
  }>({
    name: "",
    targetUrl: "",
    groupId: null,
    isAddingToExistingGroup: false,
  });

  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [deleteAdInfo, setDeleteAdInfo] = useState<{
    groupId: string;
    adId: string;
  } | null>(null);


  const fetchSidebarTopAds = async () => {
    try {
      const { data: topAds } = await api.get('/admin/ads/sidebar-top')
      console.log("topAds => ", topAds.data)
      if (topAds?.success) {
        setSidebarTopAds({
          image_url: topAds.data.image_url,
          target_url: topAds.data.target_url,
          active: topAds.data.active,
          clicks: topAds.data.clicks,
          views: topAds.data.views
        })
      }
    } catch (error) {
      toast.error("Error fetching sidebar top ads");
    }
  };

  const fetchSidebarBottomAds = async () => {
    try {
      const { data: bottomAds } = await api.get('/admin/ads/sidebar-bottom')
      if (bottomAds?.success) {
        setSidebarBottomAds({
          image_url: bottomAds.data.image_url,
          target_url: bottomAds.data.target_url,
          active: bottomAds.data.active,
          clicks: bottomAds.data.clicks,
          views: bottomAds.data.views
        })
      }
    } catch (error) {
      toast.error("Error fetching sidebar bottom ads");
    }
  };

  const fetchAddGroups = async () => {
    try {
      const { data: groups } = await api.get('/admin/ads-group')
      if (groups?.success) {
        setAdGroups(groups.data)
      }
    console.log("groups => ", groups)
    } catch (error) {
      console.log("error => ", error)
      toast.error("Error fetching ad groups");
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    // const savedAdGroups = localStorage.getItem("adGroups");
    // if (savedAdGroups) {
    //   try {
    //     const parsedGroups = JSON.parse(savedAdGroups, (key, value) => {
    //       if (key === "createdAt" || key === "startDate" || key === "endDate") {
    //         return value ? new Date(value) : null;
    //       }
    //       return value;
    //     });
    //     setAdGroups(parsedGroups);
    //   } catch (error) {
    //     console.error("Error parsing ad groups from localStorage:", error);
    //   }
    // }

    // Initialize sidebar ad states from service
    // const topAd = adService.getSidebarAd("top");
    // const bottomAd = adService.getSidebarAd("bottom");
    const topAd = sidebarTopAds
    const bottomAd = sidebarBottomAds
    if (topAd) {
      setSidebarTopUrl(topAd.target_url);
      setSidebarTopPreview(topAd.image_url);
    }

    if (bottomAd) {
      setSidebarBottomUrl(bottomAd.target_url);
      setSidebarBottomPreview(bottomAd.image_url);
    }

    // Fetch sidebar top and bottom ads from service
    fetchSidebarTopAds();
    fetchSidebarBottomAds();
    fetchAddGroups();

  }, []);

  // Save data to localStorage when it changes
  // useEffect(() => {
  //   localStorage.setItem("adGroups", JSON.stringify(adGroups));
  // }, [adGroups]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSidebarTopFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSidebarTopFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSidebarTopPreview(reader.result as string);

      };
      reader.readAsDataURL(file);
    }
  };

  const handleSidebarBottomFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSidebarBottomFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSidebarBottomPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormState({
      name: "",
      display_pages: [],
      frequency: 15,
      start_date: "",
      end_date: "",
    });
    setNewAdForm({
      name: "",
      targetUrl: "",
      groupId: null,
      isAddingToExistingGroup: false,
    });
    setSelectedFile(null);
    setAdPreview(null);
    setCreateMode(false);
    setEditingGroupId(null);
  };

  const updateFormField = (
    field: string,
    value: string | number | string[] | "sequential" | "random"
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // const togglePageSelection = (pageId: string) => {
  //   setFormState((prev) => {
  //     const isSelected = prev.display_pages.includes(pageId);
  //     if (isSelected) {
  //       return { ...prev, pages: prev.display_pages.filter((id) => id !== pageId) };
  //     } else {
  //       return { ...prev, pages: [...prev.display_pages, pageId] };
  //     }
  //   });
  // };

  const togglePageSelection = (pageId: string) => {
    setFormState((prev) => {
      const isSelected = prev.display_pages.includes(pageId);
      return {
        ...prev,
        display_pages: isSelected
          ? prev.display_pages.filter((id) => id !== pageId)
          : [...prev.display_pages, pageId],
      };
    });
  };


  const previewAd = () => {
    if (newAdForm.isAddingToExistingGroup) {
      const imageUrl =
        adPreview ||
        `https://via.placeholder.com/600x400?text=${encodeURIComponent(
          newAdForm.name
        )}`;
      setPreviewAdData({
        name: newAdForm.name,
        imageUrl,
        targetUrl: newAdForm.targetUrl,
      });
      setShowAdPreview(true);
    } else {
      const imageUrl =
        adPreview ||
        `https://via.placeholder.com/600x400?text=${encodeURIComponent(
          newAdForm.name
        )}`;
      setPreviewAdData({
        name: newAdForm.name,
        imageUrl,
        targetUrl: newAdForm.targetUrl,
      });
      setShowAdPreview(true);
    }
  };

  const previewSidebarTopAd = () => {
    const imageUrl =
      sidebarTopAds.image_url ||
      `https://via.placeholder.com/300x600?text=Top+Sidebar`;
    setPreviewAdData({
      name: "Sidebar Top Ad",
      imageUrl,
      targetUrl: sidebarTopAds.target_url,
    });
    setShowAdPreview(true);
  };

  const previewSidebarBottomAd = () => {
    const imageUrl =
      sidebarBottomAds?.image_url ||
      `https://via.placeholder.com/300x600?text=Bottom+Sidebar`;
    setPreviewAdData({
      name: "Sidebar Bottom Ad",
      imageUrl,
      targetUrl: sidebarBottomAds?.target_url,
    });
    setShowAdPreview(true);
  };

  // const handleSaveAdGroup = () => {
  //   if (!formState.name.trim()) {
  //     toast.error("Please enter a group name");
  //     return;
  //   }

  //   if (formState.display_pages.length === 0) {
  //     toast.error("Please select at least one page");
  //     return;
  //   }

  //   if (formState.frequency <= 0) {
  //     toast.error("Frequency must be greater than 0");
  //     return;
  //   }

  //   console.log("formState => ", formState)



  //   // if (editingGroupId) {
  //   //   setAdGroups((groups) =>
  //   //     groups.map((group) =>
  //   //       group.id === editingGroupId
  //   //         ? {
  //   //           ...group,
  //   //           name: formState.name,
  //   //           pages: formState.display_pages,
  //   //           frequency: formState.frequency,
  //   //           start_date: formState.start_date
  //   //             ? new Date(formState.start_date)
  //   //             : undefined,
  //   //           end_date: formState.end_date
  //   //             ? new Date(formState.end_date)
  //   //             : undefined,
  //   //         }
  //   //         : group
  //   //     )
  //   //   );
  //   //   toast.success("Ad group updated successfully");
  //   // } else {
  //   //   const newGroup: AdGroup = {
  //   //     id: uuidv4(),
  //   //     name: formState.name,
  //   //     display_pages: formState.display_pages,
  //   //     frequency: formState.frequency,
  //   //     start_date: formState.start_date
  //   //       ? new Date(formState.start_date)
  //   //       : undefined,
  //   //     end_date: formState.end_date ? new Date(formState.end_date) : undefined,
  //   //     active: true,
  //   //     createdAt: new Date(),
  //   //     ads: [],
  //   //   };

  //   //   if (
  //   //     newAdForm.name &&
  //   //     newAdForm.targetUrl &&
  //   //     (selectedFile || adPreview)
  //   //   ) {
  //   //     const imageUrl =
  //   //       adPreview ||
  //   //       `https://via.placeholder.com/600x400?text=${encodeURIComponent(
  //   //         newAdForm.name
  //   //       )}`;

  //   //     const newAd: Ad = {
  //   //       id: uuidv4(),
  //   //       name: newAdForm.name,
  //   //       image_url,
  //   //       target_url: newAdForm.targetUrl,
  //   //       order: 1,
  //   //       createdAt: new Date(),
  //   //       views: 0,
  //   //       clicks: 0,
  //   //       active: true,
  //   //     };

  //   //     newGroup.ads.push(newAd);
  //   //   }

  //   //   setAdGroups((prev) => [...prev, newGroup]);
  //   //   toast.success("Ad group created successfully");
  //   // }

  //   // resetForm();
  // };


  // const handleSaveAdGroup = async () => {
  //   if (!formState.name.trim()) {
  //     toast.error("Please enter a group name");
  //     return;
  //   }

  //   if (formState.display_pages.length === 0) {
  //     toast.error("Please select at least one page");
  //     return;
  //   }

  //   if (formState.frequency <= 0) {
  //     toast.error("Frequency must be greater than 0");
  //     return;
  //   }



  //   try {
  //     const formData = new FormData();
  //     formData.append("name", formState.name.trim());
  //     formData.append("frequency", String(formState.frequency));
  //     formData.append("display_pages", JSON.stringify(formState.display_pages.map(p => p.toUpperCase())));

  //     if (formState.start_date) formData.append("start_date", formState.start_date);
  //     if (formState.end_date) formData.append("end_date", formState.end_date);
  //     console.log("Form Data => ", formState)
  //     const hasAd =
  //       newAdForm.name.trim() &&
  //       newAdForm.targetUrl.trim() &&
  //       selectedFile; // Only accept actual File

  //     if (hasAd) {
  //       console.log("selected => ", selectedFile)
  //       formData.append("ad_name", newAdForm.name.trim());
  //       formData.append("target_url", newAdForm.targetUrl.trim());
  //       formData.append("image", selectedFile); // ✅ NOT adPreview
  //       console.log("form data inside function => ", formData)
  //     }

  //     console.log("formData => ", formData)

  //     for (let pair of formData.entries()) {
  //       console.log(`${pair[0]}:`, pair[1]);
  //     }

  //     const { data } = await api.post("/admin/ads-group", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (data.success) {
  //       toast.success("Ad group created successfully");

  //       // 🔄 Refetch ad groups since response doesn't include the new one
  //       fetchAddGroups();
  //       resetForm();
  //     } else {
  //       toast.error("Failed to create ad group");
  //     }
  //   } catch (error) {
  //     console.error("Error creating ad group:", error);
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleSaveAdGroup = async () => {
    if (!formState.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (formState.display_pages.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    if (formState.frequency <= 0) {
      toast.error("Frequency must be greater than 0");
      return;
    }

    const hasAd = selectedFile;

    try {
      const formData = new FormData();
      formData.append("name", formState.name.trim());
      formData.append("frequency", String(formState.frequency));
      formData.append("display_pages", JSON.stringify(formState.display_pages.map(p => p.toUpperCase())));

      // if (formState.start_date?.trim()) formData.append("start_date", formState.start_date);
      // if (formState.end_date?.trim()) formData.append("end_date", formState.end_date);

      // console.log("start date => ", formState.start_date || null)
      // console.log("end date => ", formState.end_date || null)

      formData.append("start_date", formState.start_date || null);
      formData.append("end_date", formState.end_date || null);
      // format the cities
      const fornatedCities = cityData.map(city => {
        return {
          address: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
        }
      })
      formData.append("cities", JSON.stringify(fornatedCities))

      // If editing existing group
      if (editingGroupId) {
        // if (formState.start_date?.trim()) { 
        //   formData.append("start_date", formState.start_date)
        //  }else {
        //   formData.append("start_date", null)
        // }

        // if (formState.end_date?.trim()) {
        //   formData.append("end_date", formState.end_date)
        // }else {
        //   formData.append("end_date", null)
        // }
        const { data: updatedGroup } = await api.patch(`/admin/ads-group/${editingGroupId}`, formData);
        console.log("updatedGroup => ", updatedGroup)
        if (!updatedGroup.success) throw new Error("Failed to update ad group");

        if (hasAd) {
          const adForm = new FormData();
          adForm.append("name", newAdForm.name.trim());
          adForm.append("target_url", newAdForm.targetUrl.trim());
          adForm.append("image", selectedFile);
          adForm.append("ad_group_id", editingGroupId);

          const { data: newAd } = await api.post("/admin/ads", adForm);
          if (!newAd.success) throw new Error("Failed to save new ad");

          setAdGroups(prev =>
            prev.map(group =>
              group.id === editingGroupId
                ? { ...group, ...updatedGroup.data, ads: [...group.ads, newAd.data] }
                : group
            )
          );

          toast.success("Ad group and new ad updated");
        } else {
          setAdGroups(prev =>
            prev.map(group =>
              group.id === editingGroupId
                ? { ...group, ...updatedGroup.data }
                : group
            )
          );
          toast.success("Ad group updated");
        }
      } else {
        // Create new group with optional first ad
        if (hasAd) {
          formData.append("ad_name", newAdForm.name.trim());
          if (newAdForm.targetUrl.trim()) {
            formData.append("target_url", newAdForm.targetUrl.trim());
          }
          formData.append("image", selectedFile);
        }

        const { data: created } = await api.post("/admin/ads-group", formData);
        if (!created.success) throw new Error("Failed to create ad group");
        setCityData([])

        fetchAddGroups(); // optionally replace this with push to `setAdGroups`
        toast.success("Ad group created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error creating/updating ad group:", error);
      toast.error("Something went wrong");
    }
  };




  // const handleSaveAdToExistingGroup = async () => {

  //   try {
  //     if (!newAdForm.name.trim()) {
  //       toast.error("Please enter an ad name");
  //       return;
  //     }

  //     if (!newAdForm.targetUrl.trim()) {
  //       toast.error("Please enter a target URL");
  //       return;
  //     }

  //     if (!newAdForm.groupId) {
  //       toast.error("Please select an ad group");
  //       return;
  //     }

  //     if (!selectedFile && !adPreview) {
  //       toast.error("Please select an image");
  //       return;
  //     }


  //     const formData = new FormData();
  //     formData.append("name", newAdForm.name);
  //     formData.append("image", selectedFile || adPreview);
  //     formData.append("target_url", newAdForm.targetUrl);
  //     formData.append("ad_group_id", newAdForm.groupId);

  //     const { data: ad } = await api.post('/admin/ads', formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     if (ad.success) {
  //       toast.success("Ad saved successfully");
  //       resetForm();
  //       setAdGroups((prev) =>
  //         prev.map((group) =>
  //           group.id === newAdForm.groupId
  //             ? {
  //                 ...group,
  //                 ads: [...group.ads, ad.data],
  //               }
  //             : group
  //         )
  //       );
  //       console.log("ad => ", ad)
  //     } else {
  //       toast.error("Error saving ad");
  //     }
  //   } catch (error) {
  //     console.error("Error saving ad:", error);
  //     toast.error("Error saving ad");
  //   }



  //   // const imageUrl =
  //   //   adPreview ||
  //   //   `https://via.placeholder.com/600x400?text=${encodeURIComponent(
  //   //     newAdForm.name
  //   //   )}`;

  //   // const newAd: Ad = {
  //   //   id: uuidv4(),
  //   //   name: newAdForm.name,
  //   //   image_url: imageUrl,
  //   //   image: newAdForm.targetUrl,
  //   //   order: 0,
  //   //   createdAt: new Date(),
  //   //   views: 0,
  //   //   clicks: 0,
  //   //   active: true,
  //   // };

  //   // setAdGroups((groups) =>
  //   //   groups.map((group) => {
  //   //     if (group.id === newAdForm.groupId) {
  //   //       newAd.order = group.ads.length + 1;
  //   //       return {
  //   //         ...group,
  //   //         ads: [...group.ads, newAd],
  //   //       };
  //   //     }
  //   //     return group;
  //   //   })
  //   // );

  //   // toast.success("Ad added successfully");

  //   // setNewAdForm({
  //   //   name: "",
  //   //   targetUrl: "",
  //   //   groupId: null,
  //   //   isAddingToExistingGroup: false,
  //   // });
  //   // setSelectedFile(null);
  //   // setAdPreview(null);
  // };

  // const handleSaveAdToExistingGroup = async () => {
  //   try {
  //     if (!newAdForm.name.trim()) {
  //       toast.error("Please enter an ad name");
  //       return;
  //     }

  //     if (!newAdForm.targetUrl.trim()) {
  //       toast.error("Please enter a target URL");
  //       return;
  //     }

  //     if (!newAdForm.groupId) {
  //       toast.error("Please select an ad group");
  //       return;
  //     }

  //     if (!selectedFile) {
  //       toast.error("Please select an image file");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("name", newAdForm.name.trim());
  //     formData.append("image", selectedFile); // ✅ Only File allowed
  //     formData.append("target_url", newAdForm.targetUrl.trim());
  //     formData.append("ad_group_id", newAdForm.groupId);

  //     // if (selectedCities.length > 0) {
  //     //   // get the values from the selectedCities array
  //     //   // const cities = selectedCities.map((city) => {
  //     //   //   return city.value;
  //     //   // });
  //     //   // formData.append("cities", JSON.stringify(cities));
  //     //   selectedCities.forEach((city) => {
  //     //     formData.append("cities[]", city.value);
  //     //   });
  //     // }



  //     // const { data: ad } = await api.post("/admin/ads", formData);

  //     // if (ad.success) {
  //     //   toast.success("Ad saved successfully");
  //     //   resetForm();
  //     //   setAdGroups((prev) =>
  //     //     prev.map((group) =>
  //     //       group.id === newAdForm.groupId
  //     //         ? {
  //     //           ...group,
  //     //           ads: [...group.ads, ad.data],
  //     //         }
  //     //         : group
  //     //     )
  //     //   );
  //     // } else {
  //     //   toast.error("Error saving ad");
  //     // }
  //   } catch (error) {
  //     console.error("Error saving ad:", error);
  //     toast.error("Error saving ad");
  //   }
  // };

  const handleSaveAdToExistingGroup = async () => {
    try {
      // if (!newAdForm.name.trim()) return toast.error("Please enter an ad name");
      // if (!newAdForm.targetUrl.trim()) return toast.error("Please enter a target URL");
      if (!newAdForm.groupId) return toast.error("Please select an ad group");
      if (!selectedFile) return toast.error("Please select an image file");

      const formData = new FormData();
      formData.append("name", newAdForm.name.trim());
      formData.append("image", selectedFile);
      formData.append("target_url", newAdForm.targetUrl.trim());
      formData.append("ad_group_id", newAdForm.groupId);

      // 👇 Append city metadata
      if (cityData.length > 0) {
        const formattedCities = cityData.map(city => ({
          address: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
        }));
        formData.append("cities", JSON.stringify(formattedCities));
      }

      const { data: ad } = await api.post("/admin/ads", formData);

      if (ad.success) {
        toast.success("Ad saved successfully");
        resetForm();
        setAdGroups((prev) =>
          prev.map((group) =>
            group.id === newAdForm.groupId
              ? { ...group, ads: [...group.ads, ad.data] }
              : group
          )
        );
      } else {
        toast.error("Error saving ad");
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      toast.error("Error saving ad");
    }
  };


  const handleSaveSidebarTopAd = async () => {
    try {
      // if (!sidebarTopFile && !sidebarTopAds?.target_url) {
      //   toast.error("Please select an image and provide a target URL");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", sidebarTopFile); // file input
      formData.append("target_url", sidebarTopAds.target_url); // string input
      

      const { data } = await api.post("/admin/ads/sidebar-top", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success) {
        toast.success("Top sidebar ad updated successfully");
        fetchSidebarTopAds(); // reload updated ad
      } else {
        toast.error("Failed to update top sidebar ad");
      }
    } catch (error) {
      toast.error("Error uploading top sidebar ad");
    }
  };


  const handleSaveSidebarBottomAd = async () => {
    try {
      // if (!sidebarBottomFile && !sidebarBottomAds?.target_url) {
      //   toast.error("Please select an image and enter a target URL");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", sidebarBottomFile); // the actual file
      formData.append("target_url", sidebarBottomAds.target_url); // user-entered URL


      const { data } = await api.post("/admin/ads/sidebar-bottom", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success) {
        toast.success("Bottom sidebar ad updated successfully");
        fetchSidebarBottomAds(); // optional: refresh the ad preview
      } else {
        toast.error("Failed to update bottom sidebar ad");
      }
    } catch (error) {
      toast.error("Error uploading bottom sidebar ad");
    }
  };


  const handleToggleGroupActive = (groupId: string) => {
    setAdGroups((groups) =>
      groups.map((group) =>
        group.id === groupId ? { ...group, active: !group.active } : group
      )
    );

    const group = adGroups.find((g) => g.id === groupId);
    if (group) {
      toast.success(
        `Ad group "${group.name}" ${group.active ? "deactivated" : "activated"}`
      );
    }
  };

  const handleToggleAdActive = async (active: boolean, groupId: string, adId: string) => {
    try {

      const { data } = await api.patch(`/admin/ads/${adId}`, {
        active: !active,
      })
      if (data.success) {
        setAdGroups((groups) =>
          groups.map((group) =>
            group.id === groupId
              ? {
                ...group,
                ads: group.ads.map((ad) =>
                  ad.id === adId ? { ...ad, active: !ad.active } : ad
                ),
              }
              : group
          )
        );

        const group = adGroups.find((g) => g.id === groupId);
        const ad = group?.ads.find((a) => a.id === adId);
        if (ad) {
          if (!ad.active) {
            toast.success(`Ad "${ad.name}" activated`);
          } else {
            toast.warning(`Ad "${ad.name}" deactivated`);
          }
          // toast.success(
          //   `Ad "${ad.name}" ${ad.active ? "deactivated" : "activated"}`
          // );
        }
      } else {
        toast.error("Error toggling ad active state");
      }
    } catch (error) {
      toast.error("Error toggling ad active state");
    }
  };

  const handleToggleSidebarAdActive = async (position: "top" | "bottom") => {
    try {
      if (position === "top") {
        await api.post("/admin/ads/sidebar-top", {
          active: !sidebarTopAds.active,
        })
        setSidebarTopAds((prev) => ({ ...prev, active: !prev.active }));
        if (!sidebarTopAds.active) {
          toast.success("Top sidebar ad activated");
        } else {
          toast.warning("Top sidebar ad deactivated");
        }
      } else {
        await api.post("/admin/ads/sidebar-bottom", {
          active: !sidebarBottomAds.active,
        })
        setSidebarBottomAds((prev) => ({ ...prev, active: !prev.active }));
        if (!sidebarBottomAds.active) {
          toast.success("Bottom sidebar ad activated");
        } else {
          toast.warning("Bottom sidebar ad deactivated");
        }
      }
    } catch (error) {
      toast.error("Error toggling sidebar ad status");
    }
  };

  const handleDeleteAdGroup = async (groupId: string) => {
    try {
      const { data } = await api.delete(`/admin/ads-group/${groupId}`);
      if (!data.success) {
        toast.error("Error deleting ad group")
        return;
      }
      setAdGroups((groups) => groups.filter((group) => group.id !== groupId));
      toast.success("Ad group deleted successfully");
      setDeleteGroupId(null); // Close the modal after deletion
    } catch (error) {
      toast.error("Error deleting ad group")
    }
  };

  const handleDeleteAd = async (groupId: string, adId: string) => {
    try {
      await api.delete(`/admin/ads/${adId}`);
      setAdGroups((groups) =>
        groups.map((group) =>
          group.id === groupId
            ? {
              ...group,
              ads: group.ads.filter((ad) => ad.id !== adId),
            }
            : group
        )
      );
      toast.success("Ad deleted successfully");
      setDeleteAdInfo(null); // Close the modal after deletion
    } catch (error) {
      toast.error("Error deleting ad");
    }
  };

  const handleEditAdGroup = (group: AdGroup) => {
    setFormState({
      name: group.name,
      display_pages: [...group.display_pages],
      frequency: group.frequency,
      start_date: group.start_date ? format(group.start_date, "yyyy-MM-dd") : "",
      end_date: group.end_date ? format(group.end_date, "yyyy-MM-dd") : "",
    });
    setEditingGroupId(group.id);
    setCreateMode(true);
  };

  const handleAddAdToGroup = (groupId: string) => {
    setNewAdForm({
      name: "",
      targetUrl: "",
      groupId: groupId,
      isAddingToExistingGroup: true,
    });
    setSelectedCities([]);
  };


  return (
    <div className="space-y-6">
      {!createMode && !newAdForm.isAddingToExistingGroup ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ad Management</h2>
          </div>

          <Tabs defaultValue="groups">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="groups" className="flex-1">
                Ad Groups
              </TabsTrigger>
              <TabsTrigger value="sidebar" className="flex-1">
                Sidebar Ads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups">
              <div className="flex justify-end mb-4">
                <Button
                  className="rounded-full"
                  onClick={() => setCreateMode(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Ad Group
                </Button>
              </div>

              {adGroups?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No ad groups created yet</p>
                  <Button
                    variant="outline"
                    onClick={() => setCreateMode(true)}
                    className="mt-4"
                  >
                    Create your first ad group
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {adGroups?.map((group) => (
                    <Card key={group.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {group.name}
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${group.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {group.active ? "Active" : "Inactive"}
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {group.display_pages.map((pageId) => {
                                const page = PAGE_OPTIONS.find(
                                  (p) => p.id === pageId
                                );
                                return page ? (
                                  <span
                                    key={pageId}
                                    className="mr-2 mb-2 inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                                  >
                                    {formatCategory(page.label)}
                                  </span>
                                ) : null;
                              })}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAdGroup(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#bc0117] hover:text-red-800 hover:bg-red-50"
                              onClick={() => setDeleteGroupId(group.id)} // Open the modal
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-500 grid grid-cols-2 gap-2 mb-3">
                          {/* <div>
                            <span className="font-medium text-gray-700">
                              Rotation:
                            </span>{" "}
                            {group.rotationMode}
                          </div> */}
                          <div>
                            <span className="font-medium text-gray-700">
                              Frequency:
                            </span>{" "}
                            Every {group.frequency} listings
                          </div>
                          {group.start_date && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Start:
                              </span>{" "}
                              {format(group.start_date, "MMM d, yyyy")}
                            </div>
                          )}
                          {group.end_date && (
                            <div>
                              <span className="font-medium text-gray-700">
                                End:
                              </span>{" "}
                              {format(group.end_date, "MMM d, yyyy")}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">
                              Ads in this group ({group.ads.length})
                            </h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddAdToGroup(group.id)}
                            >
                              <PlusCircle className="h-3.5 w-3.5 mr-1" />
                              Add Ad
                            </Button>
                          </div>

                          {group?.ads?.length === 0 ? (
                            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded text-center">
                              No ads in this group yet
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {group?.ads?.map((ad) => (
                                <div
                                  key={ad.id}
                                  className="border rounded-md overflow-hidden"
                                >
                                  <div className="flex items-start">
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <img
                                        src={ad.image_url}
                                        alt={ad.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-2 flex-grow">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium text-sm flex items-center">
                                          {ad.name}
                                          {/* <span
                                            className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${ad.active
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                              }`}
                                          > */}
                                            {/* {ad.active ? "Active" : "Inactive"} */}
                                            <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() =>
                                              handleToggleAdActive(
                                                ad.active,
                                                group.id,
                                                ad.id
                                              )
                                            }
                                          >
                                            {ad.active ? (
                                              <Ban className="h-3.5 w-3.5 text-gray-600" />
                                            ) : (
                                              <Check className="h-3.5 w-3.5 text-green-600" />
                                            )}
                                          </Button>
                                          {/* </span> */}
                                        </h4>
                                        <div className="flex space-x-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => console.log('hit')}
                                          >
                                            <SquarePen className="h-3 w-3" />
                                          </Button>


                                          
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-[#bc0117] hover:text-red-800 hover:bg-red-50"
                                            onClick={
                                              () =>
                                                setDeleteAdInfo({

                                                  groupId: group.id,
                                                  adId: ad.id,
                                                }) // Open the modal for ad deletion
                                            }
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 break-all">
                                        {ad.target_url}
                                      </p>
                                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>👁️ {ad.views}</span>
                                        <span>👆 {ad.clicks}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sidebar">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Top Sidebar Ad */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar Top Ad</CardTitle>
                    <CardDescription>
                      This ad appears at the top of the sidebar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topAdUrl">Target URL</Label>
                      <Input
                        value={sidebarTopAds?.target_url || ""}
                        onChange={(e) => {
                          setSidebarTopAds((prev) => ({
                            ...prev,
                            target_url: e.target.value,
                          }));

                        }}
                        placeholder="https://example.com"
                      />

                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topAdImage">Ad Image</Label>
                      <div className="flex items-center gap-4">
                        <div className="border rounded p-2 cursor-pointer bg-[#e5ebee] hover:bg-gray-50 flex-grow">
                          <Input
                            id="topAdImage"
                            type="file"
                            accept="image/*"
                            onChange={handleSidebarTopFileChange}
                            className="hidden"
                          />
                          <Label
                            htmlFor="topAdImage"
                            className="flex items-center justify-center cursor-pointer"
                          >
                            <UploadCloud className="h-5 w-5 mr-2 text-gray-400" />
                            <span>Select Image</span>
                          </Label>
                        </div>
                      </div>

                      {(sidebarTopPreview || sidebarTopAds?.image_url) && (
                        <div className="mt-2 rounded p-2">
                          <img
                            src={sidebarTopPreview || sidebarTopAds?.image_url}
                            alt="Top Sidebar Ad"
                            className="h-[250px] w-[230px] mx-auto rounded-lg object-cover"
                          />

                          {/* {image && (
          <div className="my-4 overflow-hidden rounded-[100px]">
            <img
              src={image}
              alt={title}
              className="w-full rounded-lg overflow-hidden"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )} */}
                        </div>
                      )}

                      {/* {!sidebarTopPreview && (
                        <Button
                          variant="outline"
                          onClick={previewAd}
                          disabled={
                            !newAdForm.name.trim() ||
                            !newAdForm.targetUrl.trim()
                          }
                          className="h-[250px] w-[230px] mx-auto rounded-lg object-cover"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Ad
                        </Button>
                      )} */}
                    </div>

                    <div className="flex justify-between">
                      <span>👁️ {sidebarTopAds?.views || 0}</span>
                      <span>👆 {sidebarTopAds?.clicks || 0}</span>
                    </div>

                    <div className="grid gap-2 grid-cols-3">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleSidebarAdActive('top')}
                      >
                        {sidebarTopAds?.active ? (
                          <>
                            <Ban className="h-4 w-4" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" /> Activate
                          </>
                        )}
                      </Button>

                      <Button variant="outline" onClick={previewSidebarTopAd}>
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>

                      <Button onClick={handleSaveSidebarTopAd}>
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Sidebar Ad */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar Bottom Ad</CardTitle>
                    <CardDescription>
                      This ad appears at the bottom of the sidebar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bottomAdUrl">Target URL</Label>
                      <Input
                        value={sidebarBottomAds?.target_url || ""}
                        onChange={(e) => {
                          setSidebarBottomAds((prev) => ({
                            ...prev,
                            target_url: e.target.value,
                          }));
                        }}
                        placeholder="https://example.com"
                      />

                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bottomAdImage">Ad Image</Label>
                      <div className="flex items-center gap-4">
                        <div className="border rounded bg-[#e5ebee] p-2 cursor-pointer hover:bg-gray-50 flex-grow">
                          <Input
                            id="bottomAdImage"
                            type="file"
                            accept="image/*"
                            onChange={handleSidebarBottomFileChange}
                            className="hidden"
                          />
                          <Label
                            htmlFor="bottomAdImage"
                            className="flex items-center justify-center cursor-pointer"
                          >
                            <UploadCloud className="h-5 w-5 mr-2 text-gray-400" />
                            <span>Select Image</span>
                          </Label>
                        </div>
                      </div>

                      {(sidebarBottomPreview || sidebarBottomAds?.image_url) && (
                        <div className="mt-2 rounded p-2">
                          <img
                            src={sidebarBottomPreview || sidebarBottomAds?.image_url}
                            alt="Bottom Sidebar Ad"
                            className="h-[250px] w-[230px] mx-auto rounded-lg object-cover"
                          />
                        </div>
                      )}

                      {/* {!sidebarBottomPreview && (
                        <Button
                          variant="outline"
                          onClick={previewAd}
                          disabled={
                            !newAdForm.name.trim() ||
                            !newAdForm.targetUrl.trim()
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Ad
                        </Button>
                      )} */}
                    </div>


                    <div className="flex justify-between">
                      <span>👁️ {sidebarBottomAds?.views || 0}</span>
                      <span>👆 {sidebarBottomAds?.clicks || 0}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleSidebarAdActive('bottom')}
                      >
                        {sidebarBottomAds?.active ? (
                          <>
                            <Ban className="h-4 w-4" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" /> Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={previewSidebarBottomAd}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button onClick={handleSaveSidebarBottomAd}>
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : newAdForm.isAddingToExistingGroup ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add New Ad</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewAdForm({
                  ...newAdForm,
                  isAddingToExistingGroup: false,
                  groupId: null,
                });
                setSelectedFile(null);
                setAdPreview(null);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="adName">Ad Name</Label>
                  <Input
                    id="adName"
                    value={newAdForm.name}
                    onChange={(e) =>
                      setNewAdForm({ ...newAdForm, name: e.target.value })
                    }
                    placeholder="E.g., Summer Sale"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    value={newAdForm.targetUrl}
                    type="url"
                    onChange={(e) =>
                      setNewAdForm({
                        ...newAdForm,
                        targetUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/promotion"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="adImage">Ad Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded p-2 cursor-pointer bg-[#e5ebee] hover:bg-gray-50 flex-grow">
                      <Input
                        id="adImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="adImage"
                        className="flex items-center justify-center cursor-pointer"
                      >
                        <UploadCloud className="h-5 w-5 mr-2 text-gray-400" />
                        <span>Select Image</span>
                      </Label>
                    </div>
                    {/* {selectedFile && (
                      <div className="text-sm text-gray-500">
                        {selectedFile.name}
                      </div>
                    )} */}
                  </div>

                  {adPreview && (
                    // <div className="rounded-lg">
                    //   <img
                    //     src={adPreview}
                    //     alt="Ad Preview"
                    //     className="h-[124px] object-cover w-full lg:w-[574px] mx-auto rounded-lg mt-4"
                    //   />
                    // </div>
                    <div className="flex justify-center items-center mt-5">
                           <div
                            className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer "
                            style={{ aspectRatio: "574/300", maxWidth: "574px" }}
                          >
                            <img
                              src={adPreview}
                              alt={"Ad Preview"}
                              className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            />
                          </div>
                         </div>
                  )}
                </div>

                <CitySelectorWithDetails onSubmit={(cityDataArray) => {
                  // console.log("Selected cities with boundaries:", cityDataArray);
                  setCityData(cityDataArray);
                  // You can store this in state and use it in formData.append("cities", JSON.stringify(cityDataArray))
                }} />

              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={previewAd}
                disabled={!newAdForm.name.trim() || !newAdForm.targetUrl.trim()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveAdToExistingGroup}>
                <Save className="h-4 w-4 mr-2" />
                Add Ad
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingGroupId ? "Edit Ad Group" : "Create Ad Group"}
            </h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={formState.name}
                    onChange={(e) => updateFormField("name", e.target.value)}
                    placeholder="E.g., Featured Services"
                    className="bg-[#e5ebee]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Display on Pages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAGE_OPTIONS.map((page) => (
                      <div
                        key={page.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`page-${page.id}`}
                          checked={formState.display_pages.includes(page.id)}
                          onCheckedChange={() => togglePageSelection(page.id)}
                        />
                        <Label
                          htmlFor={`page-${page.id}`}
                          className="cursor-pointer"
                        >
                          {page.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="grid gap-4 md:grid-cols-2"> */}
                {/* <div className="grid gap-2">
                    <Label htmlFor="rotationMode">Rotation Mode</Label>
                    <Select
                      value={formState.rotationMode}
                      onValueChange={(value: "sequential" | "random") =>
                        updateFormField("rotationMode", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rotation mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequential">Sequential</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="frequency">
                    Frequency (show every X listings)
                  </Label>
                  <Input
                    className="bg-[#e5ebee]"
                    id="frequency"
                    type="number"
                    min="1"
                    value={formState.frequency}
                    onChange={(e) =>
                      updateFormField(
                        "frequency",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
                {/* </div> */}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      className="bg-[#e5ebee]"
                      id="startDate"
                      type="date"
                      value={formState.start_date}
                      onChange={(e) =>
                        updateFormField("start_date", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      className="bg-[#e5ebee]"
                      id="endDate"
                      type="date"
                      value={formState.end_date}
                      onChange={(e) =>
                        updateFormField("end_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                {!editingGroupId && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">
                      Create First Ad (Optional)
                    </h3>
                    <div className="space-y-4 ">
                      <div className="grid gap-2">
                        <Label htmlFor="firstAdName">Ad Name</Label>
                        <Input
                          className="bg-[#e5ebee]"
                          id="firstAdName"
                          value={newAdForm.name}
                          onChange={(e) =>
                            setNewAdForm({
                              ...newAdForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="E.g., Summer Sale"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="firstAdTargetUrl">Target URL</Label>
                        <Input
                          className="bg-[#e5ebee]"
                          id="firstAdTargetUrl"
                          value={newAdForm.targetUrl}
                          onChange={(e) =>
                            setNewAdForm({
                              ...newAdForm,
                              targetUrl: e.target.value,
                            })
                          }
                          placeholder="https://example.com/promotion"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="firstAdImage">Ad Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="border rounded p-2 bg-[#e5ebee] cursor-pointer hover:bg-gray-50 flex-grow">
                            <Input
                              id="firstAdImage"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Label
                              htmlFor="firstAdImage"
                              className="flex items-center  justify-center cursor-pointer"
                            >
                              <UploadCloud className="h-5 w-5 mr-2 text-gray-400" />
                              <span>Select Image</span>
                            </Label>
                          </div>
                          {/* {selectedFile && (
                            <div className="text-sm text-gray-500">
                              {selectedFile.name}
                            </div>
                          )} */}
                        </div>

                        {adPreview && (
                          // <div className="rounded-lg">
                          //   <img
                          //     src={adPreview}
                          //     alt="Ad Preview"
                          //     className="object-cover w-full lg:w-[574px] mx-auto rounded-lg mt-4"
                          //   />
                          // </div>

                         <div className="flex justify-center items-center mt-5">
                           <div
                            className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer "
                            style={{ aspectRatio: "574/300", maxWidth: "574px" }}
                          >
                            <img
                              src={adPreview}
                              alt={"Ad Preview"}
                              className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            />
                          </div>
                         </div>
                        )}
                      </div>

                      <div className="flex justify-center ">
                        {!adPreview && (
                          <Button
                            variant="outline"
                            onClick={previewAd}
                            disabled={
                              !newAdForm.name.trim() ||
                              !newAdForm.targetUrl.trim()
                            }
                            className="w-full lg:w-[574px] z-50 h-[124px]"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Ad
                          </Button>
                        )}
                      </div>

                      <CitySelectorWithDetails onSubmit={(cityDataArray) => {
                        // console.log("Selected cities with boundaries:", cityDataArray);
                        setCityData(cityDataArray);
                        // You can store this in state and use it in formData.append("cities", JSON.stringify(cityDataArray))
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={handleSaveAdGroup}>
                <Save className="h-4 w-4 mr-2" />
                {editingGroupId ? "Update Group" : "Create Group"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Ad Preview Dialog */}
      <Dialog open={showAdPreview} onOpenChange={setShowAdPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ad Preview</DialogTitle>
            <DialogDescription>
              This is how your ad will appear to users.
            </DialogDescription>
          </DialogHeader>
          {previewAdData && (
            <div className="flex flex-col items-center space-y-4">
              <div className="border rounded overflow-hidden">
                <img
                  src={previewAdData.imageUrl}
                  alt={previewAdData.name}
                  className="max-h-[300px] max-w-full object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium">{previewAdData.name}</h3>
                <p className="text-sm text-gray-500 break-all mt-1">
                  {previewAdData.targetUrl}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(previewAdData.targetUrl, "_blank")}
                className="mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Target URL
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteGroupId}
        onClose={() => setDeleteGroupId(null)}
        onConfirm={() => deleteGroupId && handleDeleteAdGroup(deleteGroupId)}
        title="Delete Ad Group"
        description="Are you sure you want to delete this ad group? This action cannot be undone."
      />

      <DeleteConfirmationModal
        isOpen={!!deleteAdInfo}
        onClose={() => setDeleteAdInfo(null)}
        onConfirm={() =>
          deleteAdInfo &&
          handleDeleteAd(deleteAdInfo.groupId, deleteAdInfo.adId)
        }
        title="Delete Ad"
        description="Are you sure you want to delete this ad? This action cannot be undone."
      />
    </div>
  );
};

export default AdManagement;
