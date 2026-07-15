import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { products, productTypeLabel, productStatusLabel, formatPrice } from "@/data/sample";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "상품",
  description: "전자책·강의·템플릿·컨설팅 — 서비스 제작을 앞당기는 자료.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={
          <>
            바로 활용하는 <span className="serif-accent text-primary">자료</span>
          </>
        }
        subtitle="전자책·강의·템플릿·컨설팅으로 당신의 서비스 제작을 앞당깁니다."
      />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 70}>
              <Link
                href={`/products/${product.slug}`}
                className="lift gradient-border group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-accent/40 via-card to-primary/10">
                  <Badge
                    variant="secondary"
                    className="absolute left-3 top-3 bg-background/80 backdrop-blur"
                  >
                    {productTypeLabel[product.type]}
                  </Badge>
                  {product.status !== "ready" && (
                    <Badge
                      variant="outline"
                      className="absolute right-3 top-3 border-border/70 bg-background/80 text-muted-foreground backdrop-blur"
                    >
                      {productStatusLabel[product.status]}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span
                      className={cn(
                        "font-display text-lg font-semibold",
                        product.status === "ready" && product.price === 0 && "text-primary"
                      )}
                    >
                      {product.status === "ready"
                        ? formatPrice(product.price, product.currency)
                        : productStatusLabel[product.status]}
                    </span>
                    <span className="text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      자세히 →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
