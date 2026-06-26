"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

import { RefreshCcw, Zap, ZapOff } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useSearchStore } from "@/store/search-store";
import Image from "next/image";
import CameraControls from "./CameraControls";
import CameraPreview from "./CameraPreview";
import PreviewDialog from "./PreviewDialog";

type TorchCapabilities = MediaTrackCapabilities & {
  torch?: boolean;
};

export default function CameraScanner() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const setSelfie = useSearchStore((state) => state.setSelfie);
  const [preview, setPreview] = useState<string>();
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const capture = () => {
    const image = webcamRef.current?.getScreenshot();

    if (!image) return;

    setPreview(image);
  };

  const continueSearch = async () => {
    if (!preview) return;

    try {
      setLoading(true);

      const blob = await fetch(preview).then((r) => r.blob());

      setSelfie(blob);

      router.push("/searching");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlash = async () => {
    setFlashEnabled((v) => !v);

    const stream = webcamRef.current?.stream;

    const track = stream?.getVideoTracks()?.at(0);

    if (!track) return;

    const capabilities = track.getCapabilities() as TorchCapabilities;

    if (!capabilities.torch) {
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [
          {
            torch: !flashEnabled,
          } as MediaTrackConstraintSet,
        ],
      });
    } catch (err) {
      console.log("Torch not supported", err);
    }
  };

  const switchCamera = async () => {
    try {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md rounded-3xl border shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">AI Face Scanner</Badge>

            <Badge>Ready</Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold">Find Your Photos</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Position your face inside the frame and capture a selfie.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {!preview ? (
              <>
                <CameraPreview webcamRef={webcamRef} facingMode={facingMode} />

                <p className="text-center text-sm text-muted-foreground">
                  Position your face inside the guide.
                </p>

                <CameraControls
                  flashEnabled={flashEnabled}
                  onToggleFlash={toggleFlash}
                  onSwitchCamera={switchCamera}
                  onCapture={capture}
                />
              </>
            ) : (
              <>
                <PreviewDialog
                  open={!!preview}
                  image={preview}
                  loading={loading}
                  onRetake={() => setPreview(undefined)}
                  onContinue={continueSearch}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
