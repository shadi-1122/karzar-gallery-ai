import DuplicateGroups from "@/components/admin/DuplicateGroup";

export const dynamic = "force-dynamic";

async function getDuplicates() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/duplicates`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load duplicates.");
  }

  return res.json();
}

export default async function DuplicatesPage() {
  const data = await getDuplicates();

  return (
    <main className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Duplicate Photos</h1>

          <p className="mt-2 text-muted-foreground">
            Exact duplicate uploads detected using SHA-256.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-background p-6">
            <h2 className="text-2xl font-bold">{data.totalGroups}</h2>

            <p className="text-muted-foreground">Duplicate Groups</p>
          </div>

          <div className="rounded-lg border bg-background p-6">
            <h2 className="text-2xl font-bold">{data.totalDuplicates}</h2>

            <p className="text-muted-foreground">Duplicate Photos</p>
          </div>

          <div className="rounded-lg border bg-background p-6">
            <h2 className="text-2xl font-bold">
              {data.totalDuplicates - data.totalGroups}
            </h2>

            <p className="text-muted-foreground">Photos You Can Delete</p>
          </div>
        </div>

        <DuplicateGroups groups={data.groups} />
      </div>
    </main>
  );
}
