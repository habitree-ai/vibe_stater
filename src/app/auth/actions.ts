"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function enc(s: string) {
  return encodeURIComponent(s);
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
