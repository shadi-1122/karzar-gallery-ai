import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <Card className="p-6 text-center">
      <Icon className="mx-auto mb-4 h-8 w-8" />

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
