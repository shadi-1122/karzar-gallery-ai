"use client";

import { ScanFace } from "lucide-react";
import Webcam from "react-webcam";

type Props = {
  webcamRef: React.RefObject<Webcam | null>;
  facingMode: "user" | "environment";
};

export default function CameraPreview({ webcamRef, facingMode }: Props) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-3xl border bg-black shadow-inner">
      <Webcam
        ref={webcamRef}
        mirrored={facingMode === "user"}
        audio={false}
        screenshotFormat="image/jpeg"
        className="h-full w-full object-cover"
        videoConstraints={{
          facingMode,
          width: 1280,
          height: 720,
        }}
      />

      {/* Face Guide */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* <div className="h-56 w-56 rounded-full border-[4px] border-white shadow-lg" /> */}
        <ScanFace strokeWidth="0.4" className="h-64 w-64 text-background/25" />
      </div>

      {/* Corner Guides */}
      <div className="absolute inset-4 rounded-2xl border border-white/20" />
    </div>
  );
}
