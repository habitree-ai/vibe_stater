import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts, formatDate } from "@/data/sample";

export function Posts() {
  const [featured, ...rest] = posts;

  return (
    <section id="posts" className="relative grain border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Journal"
            title={
              <>
                최근 글과 <span className="serif-accent text-primary">영상</span>
              </>
            }
            description="AI·바이브코딩·독서에 대한 생각을 글로 정리합니다."
          />
          <Reveal delay={120}>
            <Link href="/posts" className={buttonVariants({ variant: "outline", size: "sm" })}>
              전체 보기 →
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* 피처드 글 */}
          <Reveal>
            <Link
              href={`/posts/${featured.slug}`}
              className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/15 via-card to-accent/30">
                <Badge variant="secondary" className="absolute left-4 top-4 bg-background/80 backdrop-blur">
                  {featured.tag}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-xs text-muted-foreground">{formatDate(featured.date)}</span>
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground">{featured.excerpt}</p>
                <span className="mt-auto pt-2 text-sm font-medium text-primary">읽어보기 →</span>
              </div>
            </Link>
          </Reveal>

          {/* 나머지 글 리스트 */}
          <div className="flex flex-col gap-4">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={(i + 1) * 90} className="h-full">
                <Link
                  href={`/posts/${post.slug}`}
                  className="lift group flex h-full items-center gap-5 rounded-2xl border border-border/70 bg-card p-5"
                >
                  <div className="hidden size-24 shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-accent/30 sm:block" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{post.tag}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                    </div>
                    <h3 className="font-display font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
