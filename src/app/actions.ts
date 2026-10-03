
"use server";
import { cookies } from "next/headers";

export async function clearAuthCookie() {
  (await cookies()).delete("token");
}

