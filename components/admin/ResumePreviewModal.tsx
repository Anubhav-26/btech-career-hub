"use client";

import { useState } from "react";

export default function ResumePreviewModal({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>

        {/* PDF VIEWER */}
        <iframe
          src={url}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}