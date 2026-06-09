import { NextResponse } from "next/server";

/**
 * Google Places photo proxy. Per Google Places ToS we store the photo
 * *reference name* (not the bytes) and fetch on demand here, keeping the API
 * key server-side. The Place Photo media endpoint redirects to the image.
 *
 * GET /api/places/photo?name=places/<id>/photos/<ref>&w=800
 */
export async function GET(req: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Places API not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  const w = Math.min(1600, Math.max(80, Number(searchParams.get("w")) || 800));

  // Only allow well-formed Places photo resource names.
  if (!/^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/.test(name)) {
    return NextResponse.json({ error: "Invalid photo reference." }, { status: 400 });
  }

  try {
    const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${w}&key=${key}`;
    // skipHttpRedirect=false returns a 302 to the image; follow it and stream.
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "Photo unavailable." }, { status: 502 });
    }
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Photo fetch failed." }, { status: 502 });
  }
}
