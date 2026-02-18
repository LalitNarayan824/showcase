import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
    try {
        const { filename } = await params;

        // Sanitize filename to prevent path traversal
        const safeName = path.basename(filename);
        const filepath = path.join(process.cwd(), "uploads", safeName);

        const file = await readFile(filepath);

        // Determine content type from extension
        const ext = path.extname(safeName).toLowerCase();
        const contentTypes = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
        };

        const contentType = contentTypes[ext] || "application/octet-stream";

        return new NextResponse(file, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
