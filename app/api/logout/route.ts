import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function GET(request: NextRequest) {
  try {
    const url = `${BACKEND_URL}/auth/logout`;

    const backendResponse = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message: "Failed to logout",
        },
        {
          status: backendResponse.status,
        },
      );
    }

    const response = NextResponse.json({
      message: "Logged out successfully",
    });

    response.cookies.set("hicappAccessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("hicappRefreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("LOGOUT API ERROR:", error);

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
