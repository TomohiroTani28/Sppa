// src/app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const LIBRETRANSLATE_URL = "http://libretranslate:5000/translate";

/**
 * LibreTranslateを使用してテキストを翻訳するAPIエンドポイント
 * @param req - リクエストオブジェクト
 */
export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate error: ${response.statusText}`);
    }

    // data の型を明示的にキャスト
    const data = (await response.json()) as { translatedText: string };

    return NextResponse.json({ translatedText: data.translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
