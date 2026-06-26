"use client";

type Props = {
  score?: number;
};

export default function ConfidenceBadge({ score }: Props) {
  if (!score) return null;

  return (
    <div className="rounded-full bg-green-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
      {(score * 100).toFixed(1)}%
    </div>
  );
}
