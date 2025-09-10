import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "resources.json");

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params; // 这里要 await

    const body = await req.json();
    const { enabled } = body;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = data.findIndex((r: any) => r.id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    data[index].enabled = enabled;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
}
