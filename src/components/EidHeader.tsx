type EidHeaderProps = {
  title: string;
  subtitle: string;
  badgeText: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function EidHeader({ title, subtitle, badgeText, Icon }: EidHeaderProps) {
  return (
    <header className="space-y-1 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#f6eee1] px-4 py-1 text-xs font-medium text-[#8c6223]">
        <Icon className="size-4 text-[#c28b37]" />
        <span>{badgeText}</span>
      </div>
      <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#3c2b17]">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-[#7b6b55]">{subtitle}</p>
    </header>
  );
}

