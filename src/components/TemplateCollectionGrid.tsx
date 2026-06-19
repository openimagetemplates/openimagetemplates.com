import { TemplateCard } from "@/components/TemplateCard";
import type { ImageTemplate } from "@/lib/templates";

type TemplateCollectionGridProps = {
  templates: ImageTemplate[];
};

export function TemplateCollectionGrid({ templates }: TemplateCollectionGridProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {templates.map((template, index) => (
        <TemplateCard key={template.id} template={template} priority={index === 0} />
      ))}
    </div>
  );
}
