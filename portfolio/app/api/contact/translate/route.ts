import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TranslatePayload = {
  text?: string;
  sourceLang?: string;
};

function normalizeLang(code: string) {
  const base = code.split("-")[0].trim();
  return base ? base.toUpperCase() : "";
}

export async function POST(request: Request) {
  let payload: TranslatePayload = {};
  try {
    payload = (await request.json()) as TranslatePayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const text = payload.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const sourceLang = payload.sourceLang?.trim() || "auto";
  if (sourceLang.startsWith("en")) {
    return NextResponse.json({
      english: text,
      detectedLang: "EN",
    });
  }

  try {
    const langCode = sourceLang === "auto" ? "auto" : sourceLang.split("-")[0];
    const translateResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langCode}|en`
    );

    if (!translateResponse.ok) {
      throw new Error("Translate failed");
    }

    const translateJson = (await translateResponse.json()) as {
      responseStatus?: number;
      responseData?: { translatedText?: string; match?: number; detectedLanguage?: string };
      matches?: Array<{ source?: string }>;
    };

    if (translateJson.responseStatus && translateJson.responseStatus !== 200) {
      throw new Error("Translate failed");
    }

    const english = translateJson.responseData?.translatedText || text;
    let detected =
      translateJson.responseData?.detectedLanguage ||
      translateJson.matches?.[0]?.source ||
      (sourceLang === "auto" ? "" : sourceLang.split("-")[0]);

    return NextResponse.json({
      english,
      detectedLang: normalizeLang(detected) || "HI",
    });
  } catch (error) {
    return NextResponse.json({ error: "Translate failed" }, { status: 500 });
  }
}
