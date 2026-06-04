export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex items-end justify-between gap-3 animate-fade-up">
      <div>
        <p className="label text-lime">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight text-chalk">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
