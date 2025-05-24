export const formatCategory = (category: string) => {
    // Convert category to singular for display
    let displayCategory = category;
    if (category === "ACCOMMODATIONS") displayCategory = "Accommodation";
    if (category === "RIDES") displayCategory = "Ride";
    if (category === "JOBS") displayCategory = "Job";
    displayCategory = displayCategory?.slice(0, 1)?.toUpperCase() + displayCategory?.slice(1)?.toLowerCase();
    return displayCategory;
  };

export const formatSubCategory = (category: string, status: string) => {
   // For Marketplace, change the status to Item/Service
    let displayStatus = status;
    if (category?.toLowerCase() === "marketplace") {
      if (status?.toLowerCase() === "items") displayStatus = "Item";
      if (status?.toLowerCase() === "services") displayStatus = "Service";
    }
    displayStatus = displayStatus?.slice(0, 1)?.toUpperCase() + displayStatus?.slice(1)?.toLowerCase();
    return displayStatus;
  }