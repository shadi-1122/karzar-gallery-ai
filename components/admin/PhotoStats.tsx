"use client";

import { Images, Users, CheckCircle2, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  total: number;

  faces: number;

  processed: number;

  failed: number;
};

export default function PhotoStats({ total, faces, processed, failed }: Props) {
  const cards = [
    {
      title: "Photos",
      value: total,
      icon: Images,
    },
    {
      title: "Detected Faces",
      value: faces,
      icon: Users,
    },
    {
      title: "Processed",
      value: processed,
      icon: CheckCircle2,
    },
    {
      title: "Failed",
      value: failed,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>

                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
