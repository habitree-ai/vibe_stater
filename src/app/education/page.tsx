import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { education, educationModules } from "@/data/sample";

export const metadata: Metadata = {
  title: "교육",
  description: education.description,
};

export default function EducationPage() {
  return (
    <>
      <PageHeader eyebrow="EDUCATION" title={education.title} subtitle={education.description} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <h2 className="mb-8 font-heading text-2xl font-semibold tracking-tight">커리큘럼</h2>
        <div className="grid gap-4">
          {educationModules.map((m) => (
            <Card key={m.step}>
              <CardContent className="flex items-start gap-5 py-2">
                <span className="font-heading text-2xl font-bold text-primary">{m.step}</span>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/products/linkmap-course" className={buttonVariants({ variant: "default", className: "h-11 px-6 text-base" })}>
            강의 보러가기
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline", className: "h-11 px-6 text-base" })}>
            교육 문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
