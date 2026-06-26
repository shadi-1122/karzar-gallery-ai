"use client";

import { Camera } from "lucide-react";

type Props = {
  onCapture: () => void;
};

export default function CaptureButton({ onCapture }: Props) {
  return (
    <button
      onClick={onCapture}
      className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            bg-white
            rounded-full
            p-5
            shadow-xl
            "
    >
      <Camera size={30} />
    </button>
  );
}
