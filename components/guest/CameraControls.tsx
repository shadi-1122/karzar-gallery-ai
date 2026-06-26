"use client";

import { Camera, RefreshCcw, Zap, ZapOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  flashEnabled: boolean;
  onToggleFlash: () => void;

  onSwitchCamera: () => void;

  onCapture: () => void;
};

export default function CameraControls({
  flashEnabled,
  onToggleFlash,
  onSwitchCamera,
  onCapture,
}: Props) {
  return (
    <div className="">
      <div className="flex items-center justify-center gap-6">
        <Button variant="outline" size="icon" onClick={onToggleFlash}>
          {flashEnabled ? (
            <Zap className="h-5 w-5" />
          ) : (
            <ZapOff className="h-5 w-5" />
          )}
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="p-6 rounded-full text-base" onClick={onCapture}>
              <Camera className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Take a selfie</TooltipContent>
        </Tooltip>

        <Button variant="outline" size="icon" onClick={onSwitchCamera}>
          <RefreshCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
