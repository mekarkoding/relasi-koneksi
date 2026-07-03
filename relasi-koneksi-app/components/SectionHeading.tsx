interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="animate-slide-up mb-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-forest/60">{subtitle}</p>}
      <div className="mt-3 h-1 w-14 rounded-full bg-marigold" />
    </div>
  );
}
