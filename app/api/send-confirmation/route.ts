import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const { email, bookingId } = await request.json();

    if (!email || !bookingId) {
      return NextResponse.json({ success: false, message: "Email and Booking ID are required" }, { status: 400 });
    }

    // Generate QR Code with booking details
    const qrCodeDataURL = await QRCode.toDataURL(`https://www.mahalispaces.com/checkin/${bookingId}`);

    // Mock: Log the QR code for now (later, attach it to an email)
    console.log(`Generated QR Code for booking ${bookingId}:`, qrCodeDataURL);

    return NextResponse.json({
      success: true,
      message: "QR Code generated successfully",
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    return NextResponse.json({ success: false, message: "Failed to generate QR Code" }, { status: 500 });
  }
}
