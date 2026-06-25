"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function enc(s: string) {
  return encodeURIComponent(s);
}

// Google 계정으로 로그인 — Supabase OAuth(PKCE). Google 공급자는 Supabase 대시보드에서 활성화 필요.
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    redirect("/login?error=" + enc("Supabase가 아직 설정되지 않았습니다. .env.local에 키를 등록하세요."));
  }
  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ||
    `${hdrs.get("x-forwarded-proto") || "https"}://${hdrs.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data?.url) {
    redirect(
      "/login?error=" +
        enc(error?.message || "Google 로그인을 시작할 수 없습니다. (Supabase에서 Google 공급자를 활성화하세요)")
    );
  }
  redirect(data.url); // Google 동의 화면으로 이동
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/login?error=" + enc("Supabase가 아직 설정되지 않았습니다. .env.local에 키를 등록하세요."));
  }
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + enc(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/me");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/signup?error=" + enc("Supabase가 아직 설정되지 않았습니다. .env.local에 키를 등록하세요."));
  }
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    redirect("/signup?error=" + enc(error.message));
  }
  revalidatePath("/", "layout");
  if (!data.session) {
    redirect("/login?notice=" + enc("확인 메일을 보냈습니다. 이메일 인증 후 로그인하세요."));
  }
  redirect("/me");
}

export async function logout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
