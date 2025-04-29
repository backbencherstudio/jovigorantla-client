import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/dialog";
import { AdGroup, Ad } from "@/types/ads";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import adService from "@/services/adService";

// Page options for assigning ad groups
const PAGE_OPTIONS = [
  { id: "home", label: "Home" },
  { id: "marketplace", label: "Marketplace" },
  { id: "rides", label: "Rides" },
  { id: "accommodations", label: "Accommodations" },
  { id: "jobs", label: "Jobs" },
];

// Initial mock data for ad groups
const initialAdGroups: AdGroup[] = [
  {
    id: "1",
    name: "Featured Services",
    pages: ["home", "marketplace"],
    rotationMode: "sequential",
    frequency: 15,
    active: true,
    createdAt: new Date("2023-08-15"),
    ads: [
      {
        id: "1",
        name: "Summer Discounts",
        imageUrl: "https://via.placeholder.com/600x400?text=Summer+Sale",
        targetUrl: "https://example.com/summer-sale",
        order: 1,
        createdAt: new Date("2023-08-15"),
        views: 245,
        clicks: 32,
        active: true,
      },
      {
        id: "2",
        name: "Student Services",
        imageUrl: "https://via.placeholder.com/600x400?text=Student+Services",
        targetUrl: "https://example.com/student-services",
        order: 2,
        createdAt: new Date("2023-08-16"),
        views: 189,
        clicks: 27,
        active: true,
      },
    ],
  },
  {
    id: "2",
    name: "Local Businesses",
    pages: ["marketplace", "jobs"],
    rotationMode: "random",
    frequency: 10,
    active: false,
    createdAt: new Date("2023-09-05"),
    ads: [
      {
        id: "3",
        name: "Joe's Coffee Shop",
        imageUrl: "https://via.placeholder.com/600x400?text=Joes+Coffee",
        targetUrl: "https://example.com/joes-coffee",
        order: 1,
        createdAt: new Date("2023-09-05"),
        views: 120,
        clicks: 18,
        active: true,
      },
    ],
  },
];

const AdManagement = () => {
  const [adGroups, setAdGroups] = useState<AdGroup[]>(initialAdGroups);
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

  const navigate = useNavigate();

  // Form state for new/editing ad group
  const [formState, setFormState] = useState<{
    name: string;
    pages: string[];
    rotationMode: "sequential" | "random";
    frequency: number;
    startDate?: string;
    endDate?: string;
  }>({
    name: "",
    pages: [],
    rotationMode: "sequential",
    frequency: 15,
    startDate: "",
    endDate: "",
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAdGroups = localStorage.getItem("adGroups");
    if (savedAdGroups) {
      try {
        const parsedGroups = JSON.parse(savedAdGroups, (key, value) => {
          if (key === "createdAt" || key === "startDate" || key === "endDate") {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setAdGroups(parsedGroups);
      } catch (error) {
        console.error("Error parsing ad groups from localStorage:", error);
      }
    }

    // Initialize sidebar ad states from service
    const topAd = adService.getSidebarAd("top");
    const bottomAd = adService.getSidebarAd("bottom");

    if (topAd) {
      setSidebarTopUrl(topAd.targetUrl);
      setSidebarTopPreview(topAd.imageUrl);
    }

    if (bottomAd) {
      setSidebarBottomUrl(bottomAd.targetUrl);
      setSidebarBottomPreview(bottomAd.imageUrl);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("adGroups", JSON.stringify(adGroups));
  }, [adGroups]);

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
      pages: [],
      rotationMode: "sequential",
      frequency: 15,
      startDate: "",
      endDate: "",
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

  const togglePageSelection = (pageId: string) => {
    setFormState((prev) => {
      const isSelected = prev.pages.includes(pageId);
      if (isSelected) {
        return { ...prev, pages: prev.pages.filter((id) => id !== pageId) };
      } else {
        return { ...prev, pages: [...prev.pages, pageId] };
      }
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
      sidebarTopPreview ||
      `https://via.placeholder.com/300x600?text=Top+Sidebar`;
    setPreviewAdData({
      name: "Sidebar Top Ad",
      imageUrl,
      targetUrl: sidebarTopUrl,
    });
    setShowAdPreview(true);
  };

  const previewSidebarBottomAd = () => {
    const imageUrl =
      sidebarBottomPreview ||
      `https://via.placeholder.com/300x600?text=Bottom+Sidebar`;
    setPreviewAdData({
      name: "Sidebar Bottom Ad",
      imageUrl,
      targetUrl: sidebarBottomUrl,
    });
    setShowAdPreview(true);
  };

  const handleSaveAdGroup = () => {
    if (!formState.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (formState.pages.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    if (editingGroupId) {
      setAdGroups((groups) =>
        groups.map((group) =>
          group.id === editingGroupId
            ? {
                ...group,
                name: formState.name,
                pages: formState.pages,
                rotationMode: formState.rotationMode,
                frequency: formState.frequency,
                startDate: formState.startDate
                  ? new Date(formState.startDate)
                  : undefined,
                endDate: formState.endDate
                  ? new Date(formState.endDate)
                  : undefined,
              }
            : group
        )
      );
      toast.success("Ad group updated successfully");
    } else {
      const newGroup: AdGroup = {
        id: uuidv4(),
        name: formState.name,
        pages: formState.pages,
        rotationMode: formState.rotationMode,
        frequency: formState.frequency,
        startDate: formState.startDate
          ? new Date(formState.startDate)
          : undefined,
        endDate: formState.endDate ? new Date(formState.endDate) : undefined,
        active: true,
        createdAt: new Date(),
        ads: [],
      };

      if (
        newAdForm.name &&
        newAdForm.targetUrl &&
        (selectedFile || adPreview)
      ) {
        const imageUrl =
          adPreview ||
          `https://via.placeholder.com/600x400?text=${encodeURIComponent(
            newAdForm.name
          )}`;

        const newAd: Ad = {
          id: uuidv4(),
          name: newAdForm.name,
          imageUrl,
          targetUrl: newAdForm.targetUrl,
          order: 1,
          createdAt: new Date(),
          views: 0,
          clicks: 0,
          active: true,
        };

        newGroup.ads.push(newAd);
      }

      setAdGroups((prev) => [...prev, newGroup]);
      toast.success("Ad group created successfully");
    }

    resetForm();
  };

  const handleSaveAdToExistingGroup = () => {
    if (!newAdForm.name.trim()) {
      toast.error("Please enter an ad name");
      return;
    }

    if (!newAdForm.targetUrl.trim()) {
      toast.error("Please enter a target URL");
      return;
    }

    if (!newAdForm.groupId) {
      toast.error("Please select an ad group");
      return;
    }

    if (!selectedFile && !adPreview) {
      toast.error("Please select an image");
      return;
    }

    const imageUrl =
      adPreview ||
      `https://via.placeholder.com/600x400?text=${encodeURIComponent(
        newAdForm.name
      )}`;

    const newAd: Ad = {
      id: uuidv4(),
      name: newAdForm.name,
      imageUrl,
      targetUrl: newAdForm.targetUrl,
      order: 0,
      createdAt: new Date(),
      views: 0,
      clicks: 0,
      active: true,
    };

    setAdGroups((groups) =>
      groups.map((group) => {
        if (group.id === newAdForm.groupId) {
          newAd.order = group.ads.length + 1;
          return {
            ...group,
            ads: [...group.ads, newAd],
          };
        }
        return group;
      })
    );

    toast.success("Ad added successfully");

    setNewAdForm({
      name: "",
      targetUrl: "",
      groupId: null,
      isAddingToExistingGroup: false,
    });
    setSelectedFile(null);
    setAdPreview(null);
  };

  const handleSaveSidebarTopAd = () => {
    if (!sidebarTopUrl.trim()) {
      toast.error("Please enter a target URL");
      return;
    }

    const imageUrl =
      sidebarTopPreview ||
      `https://via.placeholder.com/300x600?text=Top+Sidebar`;
    adService.updateSidebarAd("top", imageUrl, sidebarTopUrl);
    toast.success("Top sidebar ad updated successfully");
  };

  const handleSaveSidebarBottomAd = () => {
    if (!sidebarBottomUrl.trim()) {
      toast.error("Please enter a target URL");
      return;
    }

    const imageUrl =
      sidebarBottomPreview ||
      `https://via.placeholder.com/300x600?text=Bottom+Sidebar`;
    adService.updateSidebarAd("bottom", imageUrl, sidebarBottomUrl);
    toast.success("Bottom sidebar ad updated successfully");
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

  const handleToggleAdActive = (groupId: string, adId: string) => {
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
      toast.success(
        `Ad "${ad.name}" ${ad.active ? "deactivated" : "activated"}`
      );
    }
  };

  const handleToggleSidebarAdActive = (position: "top" | "bottom") => {
    adService.toggleSidebarAdActive(position);
    toast.success(
      `${
        position.charAt(0).toUpperCase() + position.slice(1)
      } sidebar ad toggled`
    );

    const ad = adService.getSidebarAd(position);
    if (position === "top") {
      setSidebarTopPreview(ad?.imageUrl || null);
      setSidebarTopUrl(ad?.targetUrl || "https://example.com");
    } else {
      setSidebarBottomPreview(ad?.imageUrl || null);
      setSidebarBottomUrl(ad?.targetUrl || "https://example.com");
    }
  };

  const handleDeleteAdGroup = (groupId: string) => {
    setAdGroups((groups) => groups.filter((group) => group.id !== groupId));
    toast.success("Ad group deleted successfully");
  };

  const handleDeleteAd = (groupId: string, adId: string) => {
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
  };

  const handleEditAdGroup = (group: AdGroup) => {
    setFormState({
      name: group.name,
      pages: [...group.pages],
      rotationMode: group.rotationMode,
      frequency: group.frequency,
      startDate: group.startDate ? format(group.startDate, "yyyy-MM-dd") : "",
      endDate: group.endDate ? format(group.endDate, "yyyy-MM-dd") : "",
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

              {adGroups.length === 0 ? (
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
                  {adGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {group.name}
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                  group.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {group.active ? "Active" : "Inactive"}
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {group.pages.map((pageId) => {
                                const page = PAGE_OPTIONS.find(
                                  (p) => p.id === pageId
                                );
                                return page ? (
                                  <span
                                    key={pageId}
                                    className="mr-2 inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                                  >
                                    {page.label}
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
                              onClick={() => handleDeleteAdGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-500 grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <span className="font-medium text-gray-700">
                              Rotation:
                            </span>{" "}
                            {group.rotationMode}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Frequency:
                            </span>{" "}
                            Every {group.frequency} listings
                          </div>
                          {group.startDate && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Start:
                              </span>{" "}
                              {format(group.startDate, "MMM d, yyyy")}
                            </div>
                          )}
                          {group.endDate && (
                            <div>
                              <span className="font-medium text-gray-700">
                                End:
                              </span>{" "}
                              {format(group.endDate, "MMM d, yyyy")}
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

                          {group.ads.length === 0 ? (
                            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded text-center">
                              No ads in this group yet
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {group.ads.map((ad) => (
                                <div
                                  key={ad.id}
                                  className="border rounded-md overflow-hidden"
                                >
                                  <div className="flex items-start">
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <img
                                        src={ad.imageUrl}
                                        alt={ad.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-2 flex-grow">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium text-sm flex items-center">
                                          {ad.name}
                                          <span
                                            className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                              ad.active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            {ad.active ? "Active" : "Inactive"}
                                          </span>
                                        </h4>
                                        <div className="flex space-x-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() =>
                                              handleToggleAdActive(
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
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-[#bc0117] hover:text-red-800 hover:bg-red-50"
                                            onClick={() =>
                                              handleDeleteAd(group.id, ad.id)
                                            }
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 break-all">
                                        {ad.targetUrl}
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
                        id="topAdUrl"
                        value={sidebarTopUrl}
                        onChange={(e) => setSidebarTopUrl(e.target.value)}
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

                      {sidebarTopPreview && (
                        <div className="mt-2 border rounded p-2">
                          <img
                            src={sidebarTopPreview}
                            alt="Top Sidebar Ad"
                            className="max-h-64 mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2 grid-cols-3">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleSidebarAdActive("top")}
                      >
                        {adService.getSidebarAd("top")?.active ? (
                          <>
                            <Ban className="h-4 w-4 " />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Activate
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
                        id="bottomAdUrl"
                        value={sidebarBottomUrl}
                        onChange={(e) => setSidebarBottomUrl(e.target.value)}
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

                      {sidebarBottomPreview && (
                        <div className="mt-2 border rounded p-2">
                          <img
                            src={sidebarBottomPreview}
                            alt="Bottom Sidebar Ad"
                            className="max-h-64 mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleSidebarAdActive("bottom")}
                      >
                        {adService.getSidebarAd("bottom")?.active ? (
                          <>
                            <Ban className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Activate
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
                    {selectedFile && (
                      <div className="text-sm text-gray-500">
                        {selectedFile.name}
                      </div>
                    )}
                  </div>

                  {adPreview && (
                    <div className="mt-2 border rounded p-2">
                      <img
                        src={adPreview}
                        alt="Ad Preview"
                        className="max-h-32 mx-auto"
                      />
                    </div>
                  )}
                </div>
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
                          checked={formState.pages.includes(page.id)}
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
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
                  </div>

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
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      className="bg-[#e5ebee]"
                      id="startDate"
                      type="date"
                      value={formState.startDate}
                      onChange={(e) =>
                        updateFormField("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      className="bg-[#e5ebee]"
                      id="endDate"
                      type="date"
                      value={formState.endDate}
                      onChange={(e) =>
                        updateFormField("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {!editingGroupId && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">
                      Create First Ad (Optional)
                    </h3>
                    <div className="space-y-4">
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
                          {selectedFile && (
                            <div className="text-sm text-gray-500">
                              {selectedFile.name}
                            </div>
                          )}
                        </div>

                        {adPreview && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={adPreview}
                              alt="Ad Preview"
                              className="max-h-32 mx-auto"
                            />
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={previewAd}
                        disabled={
                          !newAdForm.name.trim() || !newAdForm.targetUrl.trim()
                        }
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Ad
                      </Button>
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
    </div>
  );
};

export default AdManagement;
