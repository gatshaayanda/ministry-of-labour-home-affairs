import { NextRequest, NextResponse } from "next/server";

// Load the Ministry's versioned first-run catalogue without a huge URL payload.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/" || request.nextUrl.searchParams.has("example") || request.nextUrl.searchParams.has("ministry")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.searchParams.set("ministry", "1");
  url.searchParams.set("sample", "1");
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/"] };
