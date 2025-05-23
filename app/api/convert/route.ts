import { sendMessageToOpenAI } from "@/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageB64 } = await req.json();
  if (!imageB64) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }
  const result = await sendMessageToOpenAI(imageB64);
  return NextResponse.json({ result });
}
