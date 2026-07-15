-- =====================================================================
-- 0010_chat_settings.sql — AI 챗봇 런타임 설정(모델/temperature/기본지침)
-- 관리자가 /admin/settings 에서 저장하면 /api/chat 이 즉시 이 값을 읽어 반영한다.
-- API 키는 여기 저장하지 않는다(환경변수 전용). 이 표에는 비밀값이 없다.
-- =====================================================================

create table if not exists public.chat_settings (
  id            smallint primary key default 1,
  model         text not null default 'gpt-4o-mini',
  temperature   real not null default 0.6,
  max_tokens    int  not null default 512,
  system_prompt text not null,
  enabled       boolean not null default true,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id) on delete set null,

  -- 단일 행만 허용(설정은 사이트 전역 1벌).
  constraint chat_settings_singleton    check (id = 1),
  constraint chat_settings_model_len    check (char_length(btrim(model)) between 1 and 100),
  -- OpenAI 허용 범위. 모델별 추가 제약(예: gpt-5 계열 temperature=1)은 앱에서 검증.
  constraint chat_settings_temp_range   check (temperature >= 0 and temperature <= 2),
  constraint chat_settings_tokens_range check (max_tokens between 64 and 4096),
  constraint chat_settings_prompt_len   check (char_length(btrim(system_prompt)) between 1 and 8000)
);

alter table public.chat_settings enable row level security;

-- 정책을 두지 않는다 → anon/authenticated 는 읽기·쓰기 모두 차단되고,
-- RLS를 우회하는 service_role(서버 전용)만 접근한다. contact_messages 조회와 같은 방침.

-- 기본 행 시드 — 기존 /api/chat 의 하드코딩 PERSONA를 그대로 초기값으로 옮긴다.
insert into public.chat_settings (id, model, temperature, max_tokens, system_prompt)
values (
  1,
  'gpt-4o-mini',
  0.6,
  512,
  '당신은 ''Habitree''의 친절한 AI 어시스턴트입니다. 이 사이트는 ''바이브코딩 치트키''가 운영하는, 누구나 쉽게 시작하는 배움 공간으로 AI·바이브코딩·독서를 다룹니다. 운영자는 제조기업 ERP PM이자 AX(AI 전환) 담당자이며, 바이브코딩을 가르치는 강사가 아니라 같이 공부하고 기록을 나누는 동료입니다(실명은 공개하지 않습니다).
주요 서비스 — LINKMAP: 구글 계정 하나로 3분 만에 배포하는 바이브코딩 플랫폼(서비스 맵 시각화, 연결 체크리스트, 환경변수 AES-256 관리, 30개 이상 서비스 연동). ReadTree: 읽고 기록하면 독서나무가 자라는 독서 습관 플랫폼(독서 기록·통계, AI 채팅·OCR 필사·AI 리포트, 독서 그룹). YouTube 채널도 운영합니다.
무료 교육 자료 — ''바이브코딩으로 시작하는 1인 SaaS'' 전자책, ''LINKMAP 실전 강의'', ''Creator Platform 템플릿'', ''1:1 커피챗''은 모두 교육 목적으로 무료 공개됩니다. 비용 대신 디지털 키트(USD 1~10000, 강요 없음, 응원과 무관하게 자료는 항상 무료)으로 응원할 수 있습니다.
규칙: 항상 한국어로, 따뜻하고 간결하게 2~4문장으로 답하세요. 모르면 솔직히 말하고 문의나 응원 페이지를 안내하세요. 사이트와 무관한 질문은 정중히 본 주제로 안내하세요.'
)
on conflict (id) do nothing;
