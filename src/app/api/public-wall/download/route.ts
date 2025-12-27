import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");
    const filename = searchParams.get("filename");

    if (!url) {
        return new NextResponse("Missing URL parameter", { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`);
            return new NextResponse("Failed to fetch image", { status: 502 });
        }

        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();

        // Determine filename if not provided
        let finalFilename = filename;
        if (!finalFilename) {
            try {
                const urlPath = new URL(url).pathname;
                finalFilename = urlPath.split('/').pop() || "image.jpg";
            } catch {
                finalFilename = "image.jpg";
            }
        }

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${finalFilename}"`,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Download proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
