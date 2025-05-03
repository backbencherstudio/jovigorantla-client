import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsaHistoryItem {
  id: string;
  title: string;
  postedBy: string;
  postedAt: string;
  category: string;
  status: string;
  decision: string;
  decisionBy: string;
  decisionAt: string;
}

interface UsaHistoryTableProps {
  usaHistory: UsaHistoryItem[];
  formatDate: (dateString: string) => string;
}

const UsaHistoryTable: React.FC<UsaHistoryTableProps> = ({
  usaHistory,
  formatDate,
}) => {
  if (usaHistory.length === 0) {
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
          <TableHead>Title</TableHead>
          <TableHead>Posted By</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead>Decision Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usaHistory.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.postedBy}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  item.decision === "approved"
                    ? "bg-green-100 text-green-800"
                    : item.decision === "blocked"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.decision?.charAt(0).toUpperCase() +
                  item.decision?.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              {item.decisionAt ? formatDate(item.decisionAt) : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsaHistoryTable;
