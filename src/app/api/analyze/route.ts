import { exec } from "child_process";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define a temporary file path
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `resume-${Date.now()}`);

  try {
    // Write the uploaded file to a temporary location
    await fs.writeFile(tempFilePath, buffer);

    // Define the path to the config file
    const configPath = path.join(process.cwd(), "data", "agents-compose.json");

    // Construct the command to run the multisync tool
    const command = `npx multisync --config="${configPath}" --input-file="${tempFilePath}"`;

    // Execute the command
    const { stdout, stderr } = await new Promise<{
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });

    if (stderr) {
      console.error(`Error during analysis:`, stderr);
      return NextResponse.json(
        { success: false, error: "Failed to analyze the resume." },
        { status: 500 }
      );
    }

    // Parse the result from stdout
    const result = JSON.parse(stdout);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error during analysis:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze the resume." },
      { status: 500 }
    );
  } finally {
    // Clean up the temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error("Failed to clean up temporary file:", cleanupError);
      }
    }
  }
}
