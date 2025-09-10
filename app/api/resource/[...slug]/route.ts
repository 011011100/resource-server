import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "resources.json");

export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string[] }> }
) {
    const { slug } = await context.params; // ✅ 这里要 await
    const requestPath = "/assets/" + slug.join("/");

    const resources = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const resource = resources.find((r: any) => r.path === requestPath);

    if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    if (!resource.enabled) {
        return NextResponse.json({ error: "Resource disabled" }, { status: 403 });
    }

    const absPath = path.join(process.cwd(), "public", "assets", ...slug);

    try {
        const fileBuffer = fs.readFileSync(absPath);

        // 根据文件后缀设置 Content-Type
        const ext = path.extname(absPath).toLowerCase();
        const mimeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".webp": "image/webp",
            ".mp4": "video/mp4",
            ".mp3": "audio/mpeg",
            ".json": "application/json",
        };
        const contentType = mimeMap[ext] || "application/octet-stream";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
