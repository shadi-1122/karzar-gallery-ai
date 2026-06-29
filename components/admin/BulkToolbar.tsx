"use client";

import { Trash2, Download, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  selected: number;
  total: number;
  loading?: boolean;
  onDelete: () => void;
  onDownload: () => void;
  onCancel: () => void;
  onSelectAll: () => void;
};

export default function BulkToolbar({
  selected,
  total,
  loading = false,
  onDelete,
  onDownload,
  onCancel,
  onSelectAll,
}: Props) {
  return (
    <Card className="sticky top-4 z-50 border-primary shadow-lg">
      <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Badge className="px-3 py-1 text-sm">{selected}</Badge>

          <div>
            <p className="font-semibold">
              {selected} Photo{selected !== 1 ? "s" : ""} Selected
            </p>

            <p className="text-sm text-muted-foreground">
              Perform actions on all selected photos.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selected < total && (
            <Button variant="outline" onClick={onSelectAll} disabled={loading}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Select All
            </Button>
          )}

          <Button variant="outline" onClick={onDownload} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Download ZIP
          </Button>

          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>

          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
