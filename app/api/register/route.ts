import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${BACKEND_URL}/auth/register`;

    const backendResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    const response = NextResponse.json({
      message: data.message,
      user: data.user,
    });

    return response;
  } catch (error) {
    console.error("REGISTER API ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
