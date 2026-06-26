"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import Image from "next/image";

import { UploadCloud, Images, Loader2, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function UploadBox() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const uploadImages = async () => {
    if (!files.length) return;

    try {
      setLoading(true);

      const form = new FormData();

      files.forEach((file) => form.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Upload completed.");

      setFiles([]);
    } catch (err) {
      console.error(err);

      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const totalSize = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  return (
    <Card className="w-full max-w-6xl rounded-3xl shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl">Photo Upload</CardTitle>

            <CardDescription className="mt-2">
              Upload event photos and let AI detect every face.
            </CardDescription>
          </div>

          <Badge className="gap-2">
            <Images className="h-4 w-4" />
            {files.length} Photos
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition

          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />

          <UploadCloud className="mx-auto h-14 w-14 text-primary" />

          <h2 className="mt-5 text-2xl font-semibold">Drag & Drop Photos</h2>

          <p className="mt-2 text-muted-foreground">
            Click to browse or drop multiple images here.
          </p>
        </div>

        {files.length > 0 && (
          <>
            <Separator />

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">Selected Photos</h3>

                <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>

              <ScrollArea className="h-[420px] rounded-xl border p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border bg-background"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={300}
                        height={300}
                        unoptimized
                        className="aspect-square w-full object-cover"
                      />

                      <div className="p-2">
                        <p className="truncate text-xs">{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold">{files.length} Images</p>

                <p className="text-sm text-muted-foreground">
                  {(totalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <Button size="lg" disabled={loading} onClick={uploadImages}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Photos
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
