"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  value: string;

  onChange: (value: string) => void;
};

export default function PhotoFilters({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>

        <TabsTrigger value="processed">Processed</TabsTrigger>

        <TabsTrigger value="faces">With Faces</TabsTrigger>

        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
