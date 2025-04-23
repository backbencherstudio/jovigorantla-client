
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';

interface FlaggedHistoryItem {
  id: string;
  listingId: string;
  listingTitle: string;
  reportedBy: string;
  reportedAt: string;
  category: string;
  decision: string;
  decisionBy: string | null;
  decisionAt: string | null;
}

interface FlaggedHistoryTableProps {
  flaggedHistory: FlaggedHistoryItem[];
  formatDate: (dateString: string) => string;
  onViewListing: (listingId: string) => void;
}

const FlaggedHistoryTable: React.FC<FlaggedHistoryTableProps> = ({
  flaggedHistory,
  formatDate,
  onViewListing
}) => {
  if (flaggedHistory.length === 0) {
    return (
      <div className="text-center py-6">
        <p>No decision history available</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Reported By</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead>Decision Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {flaggedHistory.map(item => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.listingTitle}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.reportedBy}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.decision === 'approved' ? 'bg-green-100 text-green-800' :
                item.decision === 'blocked' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.decision?.charAt(0).toUpperCase() + item.decision?.slice(1)}
              </span>
            </TableCell>
            <TableCell>{item.decisionAt ? formatDate(item.decisionAt) : '-'}</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewListing(item.listingId)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FlaggedHistoryTable;
