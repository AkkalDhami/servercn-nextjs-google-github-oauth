import { NextRequest, NextResponse } from "next/server";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "@/services/cloudinary.service";

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

    //* Upload to Cloudinary
    const uploadedFile = await uploadToCloudinary(buffer, {
      folder: "test",
      resource_type: "auto"
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
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "publicId is required."
        },
        { status: 400 }
      );
    }

    const result = await deleteFileFromCloudinary(publicId);
    // const result = await deleteFilesFromCloudinary([...publicIds]);

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
