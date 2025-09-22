import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

type Payload = {
  exp: number;
}

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("access_token")?.value
  const currentTime = Math.floor(Date.now() / 1000)

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard")
  const isEmptyRoute = request.nextUrl.pathname === "/"

  if (isEmptyRoute) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  if (isDashboardRoute) {
    try {
      if (!token) throw new Error("access_token not found")

      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
      const newPayload = payload as Payload

      if (newPayload.exp && newPayload.exp < currentTime) throw new Error("token expired")
    } catch {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  if (isAuthRoute) {
    if (token) {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
      const newPayload = payload as Payload
      if (newPayload && newPayload.exp > currentTime) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}