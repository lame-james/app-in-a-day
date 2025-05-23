"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const createImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      createImageUrl(e as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    input.click();
  };

  const handleConvertImage = () => {
    console.log("convert image");
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <div className="flex flex-col gap-8 w-[300px] mx-auto">
        {imageUrl && (
          <div
            className="relative"
            style={{
              aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
            }}
          >
            <Image
              src={imageUrl}
              alt="uploaded image"
              fill
              className="object-contain"
            />
          </div>
        )}
        <button
          className="bg-black text-white p-2"
          onClick={imageUrl ? handleConvertImage : handleUploadImage}
        >
          {imageUrl ? "Convert" : "Upload Image"}
        </button>
      </div>
    </div>
  );
}
