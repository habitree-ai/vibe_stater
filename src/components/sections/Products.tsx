import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CardCover } from "@/components/ui/CardCover";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products, productTypeLabel, formatPrice } from "@/data/sample";
import { cn } from "@/lib/utils";

export function Products() {
  return (
    <section id="products" className="relative border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Products"
            title={
              <>
                바로 활용하는 <span className="serif-accent text-primary">자료</span>
              </>
            }
            description="전자책·강의·템플릿·컨설팅으로 당신의 서비스 제작을 앞당깁니다."
          />
          <Reveal delay={120}>
            <Link href="/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
              전체 상품 보기 →
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 70}>
              <Link
                href={`/products/${product.slug}`}
                className="lift gradient-border group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <CardCover cover={product.cover} fallbackMark="📦" className="aspect-[5/4]">
                  <Badge
                    variant="secondary"
                    className="absolute left-3 top-3 z-10 bg-background/80 backdrop-blur"
                  >
                    {productTypeLabel[product.type]}
                  </Badge>
                </CardCover>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span
                      className={cn(
                        "font-display text-lg font-semibold",
                        product.price === 0 && "text-primary"
                      )}
                    >
                      {formatPrice(product.price, product.currency)}
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
      </div>
    </section>
  );
}
