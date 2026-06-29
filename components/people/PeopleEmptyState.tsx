import { Users } from "lucide-react";

export default function PersonEmptyState() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 p-20 text-center">
      <Users className="mx-auto mb-6 h-14 w-14 text-muted-foreground" />

      <h2 className="text-2xl font-semibold">No People Found</h2>

      <p className="mt-3 text-muted-foreground">Upload event photos first.</p>
    </div>
  );
}
