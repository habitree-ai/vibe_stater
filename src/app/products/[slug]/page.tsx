import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products, findProduct, productTypeLabel, formatPrice } from "@/data/sample";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "상품을 찾을 수 없음" };
  return { title: product.name, description: product.summary };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        eyebrow={productTypeLabel[product.type]}
        title={product.name}
        subtitle={product.summary}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* 본문 */}
          <div className="space-y-10">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-accent/40 to-primary/10 ring-1 ring-border" />

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">핵심 결과물</h2>
              <p className="text-muted-foreground">{product.outcome}</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">누구를 위한 상품인가</h2>
              <ul className="space-y-2">
                {product.forWhom.map((w) => (
                  <li key={w} className="flex gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">포함 내용</h2>
              <div className="flex flex-wrap gap-2">
                {product.includes.map((i) => (
                  <Badge key={i} variant="outline">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">구매 후 이용 방법</h2>
              <p className="text-muted-foreground">{product.howToUse}</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold">자주 묻는 질문</h2>
              <div className="space-y-3">
                {product.faq.map((f) => (
                  <Card key={f.q}>
                    <CardContent className="space-y-1.5 py-1">
                      <p className="font-medium">{f.q}</p>
                      <p className="text-sm text-muted-foreground">{f.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* 구매 박스 (sticky) */}
          <aside className="lg:sticky lg:top-24">
            <Card>
              <CardContent className="space-y-4 py-2">
                <Badge variant="secondary" className="w-fit">
                  {productTypeLabel[product.type]}
                </Badge>
                <div className="font-heading text-3xl font-bold">
                  {formatPrice(product.price, product.currency)}
                </div>
                <Link
                  href={`/checkout/${product.id}`}
                  className={buttonVariants({ variant: "default", className: "h-11 w-full text-base" })}
                >
                  구매하기
                </Link>
                <Link
                  href="/products"
                  className={buttonVariants({ variant: "outline", className: "h-11 w-full text-base" })}
                >
                  다른 상품 보기
                </Link>
                <p className="text-xs text-muted-foreground">
                  * 결제는 추후 Stripe 연동 단계에서 활성화됩니다.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
