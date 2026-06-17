import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { posts, formatDate } from "@/data/sample";

export const metadata: Metadata = {
  title: "콘텐츠",
  description: "AI·바이브코딩·독서에 대한 글과 영상 정리.",
};

export default function PostsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={
          <>
            글과 <span className="serif-accent text-primary">영상</span>
          </>
        }
        subtitle="AI·바이브코딩·독서에 대한 생각을 글로 정리합니다."
      />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link
                href={`/posts/${post.slug}`}
                className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/15 via-card to-accent/30">
                  <Badge variant="secondary" className="absolute left-3 top-3 bg-background/80 backdrop-blur">
                    {post.tag}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                  <h3 className="font-display text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-auto pt-2 text-sm font-medium text-primary">읽어보기 →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
