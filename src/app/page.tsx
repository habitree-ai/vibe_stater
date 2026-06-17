import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Products } from "@/components/sections/Products";
import { Posts } from "@/components/sections/Posts";
import { EducationCTA } from "@/components/sections/EducationCTA";
import { Newsletter } from "@/components/sections/Newsletter";
import { Marquee } from "@/components/ui/Marquee";

const marqueeItems = [
  "AI 바이브코딩",
  "Next.js",
  "Supabase",
  "Stripe 결제",
  "Resend 이메일",
  "Vercel 배포",
  "독서 · 필사",
  "LINKMAP 연결",
  "1인 SaaS",
  "개인 브랜드",
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-y border-border/60 bg-card/50 py-4">
        <Marquee items={marqueeItems} />
      </div>
      <About />
      <Projects />
      <Products />
      <Posts />
      <EducationCTA />
      <Newsletter />
    </>
  );
}
