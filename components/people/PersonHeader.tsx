import { Users } from "lucide-react";

type Props = {
  total: number;
};

export default function PersonHeader({ total }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">Detected People</h1>

        <p className="mt-2 text-muted-foreground">
          Browse every detected face in your event.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border bg-card px-5 py-3">
        <Users className="h-5 w-5 text-primary" />

        <div>
          <p className="text-sm text-muted-foreground">Total People</p>

          <p className="text-xl font-bold">{total}</p>
        </div>
      </div>
    </div>
  );
}
