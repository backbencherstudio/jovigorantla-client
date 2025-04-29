export interface USAListing {
  id: string;
  title: string;
  category: string;
  postedBy: string;
  postedAt: string;
  status: "approved" | "pending" | "rejected";
  decision?: string;
  decisionBy?: string;
  decisionAt?: string;
} 