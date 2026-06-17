import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { posts, findPost, formatDate } from "@/data/sample";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "글을 찾을 수 없음" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-6 flex items-center gap-3">
        <Badge variant="secondary">{post.tag}</Badge>
        <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
      </div>
      <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <div className="my-8 aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/30 ring-1 ring-border" />
      <div className="space-y-5 text-base leading-relaxed text-foreground/90">
        {post.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-12 border-t border-border/60 pt-8">
        <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
          ← 목록으로
        </Link>
      </div>
    </article>
  );
}
