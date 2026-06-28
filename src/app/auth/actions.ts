"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";

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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await logActivity({ action: "auth.login", level: "issue", message: error.message, metadata: { email } });
    redirect("/login?error=" + enc(error.message));
  }
  await logActivity({ action: "auth.login", userId: data.user?.id, message: "이메일 로그인" });
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
    await logActivity({ action: "auth.signup", level: "issue", message: error.message, metadata: { email } });
    redirect("/signup?error=" + enc(error.message));
  }
  await logActivity({ action: "auth.signup", userId: data.user?.id, message: "회원가입", metadata: { email } });
  revalidatePath("/", "layout");
  if (!data.session) {
    redirect("/login?notice=" + enc("확인 메일을 보냈습니다. 이메일 인증 후 로그인하세요."));
  }
  redirect("/me");
}

export async function logout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.auth.signOut();
    await logActivity({ action: "auth.logout", userId: user?.id, message: "로그아웃" });
  }
  revalidatePath("/", "layout");
  redirect("/");
}

// 계정관리 — 개인정보(표시 이름·프로필 이미지) 수정. 프로필 + auth user_metadata 동기화.
export async function updateProfile(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/me?error=" + enc("Supabase가 아직 설정되지 않았습니다."));
  }
  const name = String(formData.get("name") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();
  if (!name) {
    redirect("/me?error=" + enc("이름을 입력해 주세요."));
  }
  if (name.length > 100) {
    redirect("/me?error=" + enc("이름은 100자 이하여야 합니다."));
  }
  if (avatarUrl && !/^https?:\/\/.+/i.test(avatarUrl)) {
    redirect("/me?error=" + enc("프로필 이미지는 http(s)로 시작하는 URL이어야 합니다."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?notice=" + enc("로그인이 필요합니다."));
  }

  const avatar = avatarUrl || null;
  const { error: authError } = await supabase.auth.updateUser({
    data: { name, avatar_url: avatar },
  });
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ name, avatar_url: avatar })
    .eq("id", user!.id);

  if (authError || profileError) {
    const msg = authError?.message || profileError?.message || "정보 수정에 실패했습니다.";
    await logActivity({ action: "account.update_profile", level: "issue", userId: user!.id, message: msg });
    redirect("/me?error=" + enc(msg));
  }

  await logActivity({ action: "account.update_profile", userId: user!.id, message: `프로필 수정 → ${name}` });
  revalidatePath("/", "layout");
  redirect("/me?success=" + enc("정보가 저장되었습니다."));
}
