"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [converted64, setConverted64] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const img = new window.Image();
        img.onload = () => {
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          setImageB64(base64);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    inputRef.current?.click();
  };

  const handleConvert = async () => {
    setLoading(true);
    if (!imageB64) return;

    const res = await fetch("/api/convert", {
      method: "POST",
      body: JSON.stringify({
        imageB64,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setConverted64(`data:image/png;base64,${data.result}`);
    setImageDimensions({
      width: 1024,
      height: 1536,
    });
    setLoading(false);
  };

  const getButtonTitle = () => {
    if (converted64) {
      return "Download";
    } else if (imageB64) {
      return "Convert";
    } else {
      return "Upload";
    }
  };

  const onButtonClick = () => {
    if (converted64) {
      const a = document.createElement("a");
      a.href = converted64;
      a.download = "PS2-RENDER.png";
      a.click();
    } else if (imageB64) {
      handleConvert();
    } else {
      handleUploadImage();
    }
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      {loading ? (
        <div className="flex gap-4 w-[300px">
          <LoadingSpinner />
          <p>Converting image...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-[300px] mx-auto">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={createImageUrl}
          />
          {(imageB64 || converted64) && (
            <div
              className="relative"
              style={{
                aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
              }}
            >
              <Image
                src={converted64 ?? imageB64 ?? ""}
                alt="uploaded image"
                fill
                className="object-contain"
              />
            </div>
          )}

          <button
            className="bg-black text-white p-2 cursor-pointer"
            onClick={onButtonClick}
          >
            {getButtonTitle()}
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
