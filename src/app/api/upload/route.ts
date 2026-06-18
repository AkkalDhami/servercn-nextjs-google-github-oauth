import { NextRequest, NextResponse } from "next/server";

import {
  deleteFilesFromImageKit,
  uploadToImageKit
} from "@/services/imagekit.service";

export async function POST(req: NextRequest) {
  try {
    //* Get form data
    const formData = await req.formData();

    //* Extract file
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided." },
        { status: 400 }
      );
    }

    //* Convert File - Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //* Upload to ImageKit
    const uploadedFile = await uploadToImageKit(buffer, {
      folder: "/uploads",
      fileName: file.name
    });

    return NextResponse.json(
      {
        success: true,
        data: uploadedFile
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json(); //* { publicId: "publicId" }

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "publicId is required."
        },
        { status: 400 }
      );
    }

    //* Delete file from ImageKit
    const result = await deleteFilesFromImageKit([publicId]);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete file."
      },
      { status: 500 }
    );
  }
}
