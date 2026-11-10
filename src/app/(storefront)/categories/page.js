import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { classNames as cn } from "@/lib/utils";
import { getCategories } from "@/lib/queries";

const gradients = [
  "from-rose-gold/30 to-muted-blush",
  "from-champagne-gold/30 to-beige",
  "from-stone/20 to-warm-white",
  "from-matte-black/10 to-ivory",
  "from-champagne-gold-dark/20 to-soft-cream",
  "from-rose-gold/20 to-champagne-gold/20",
  "from-muted-blush/30 to-stone/10",
];

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        title="Categories"
        subtitle="Browse our collection by category"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={classNames(
              "group relative flex h-[220px] items-end overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br transition-all duration-300 hover:shadow-lg",
              gradients[index % gradients.length]
            )}
          >
            <div className="relative z-10 w-full p-6">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-foreground/60 transition-colors group-hover:text-foreground">
                <span>Shop {category.name}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
