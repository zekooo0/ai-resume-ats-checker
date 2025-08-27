import { runFlowWithFile, validateConfig } from "multisync/core";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Ensure Node.js runtime as we use fs/os APIs
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Track any temp file we create so we can always clean it up
  let tempPath: string | null = null;
  try {
    const configPath = path.join(process.cwd(), "data", "agents-compose.json");
    const raw = await fs.readFile(configPath, "utf8");
    const config = JSON.parse(raw);

    // Validate before running
    validateConfig(config);

    // Determine PDF path from uploaded file (multipart/form-data)
    // tempPath is declared above for cleanup
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with a 'file' field" },
        { status: 400 }
      );
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempDir = path.join(os.tmpdir(), "ats-ai-checker");
    await fs.mkdir(tempDir, { recursive: true });
    tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    // Resolve API key from environment
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.MULTISYNC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing OPENAI_API_KEY (or MULTISYNC_API_KEY)" },
        { status: 500 }
      );
    }

    // Run flow with the resolved PDF path
    const result = await runFlowWithFile(config, tempPath!, "Resume Checker", {
      apiKey,
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("/api/analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Cleanup temp file if created
    if (tempPath) {
      try {
        await fs.unlink(tempPath);
      } catch {}
    }
  }
}
