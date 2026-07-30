interface Program {
  name: string;
  meaning: string;
  blurb: string;
}

interface Props {
  title: string;
  subtitle: string;
  programs: Program[];
}

export function KknProgramList({ title, subtitle, programs }: Props) {
  return (
    <section>
      <h2 className="text-xl font-bold text-forest sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-justify text-sm text-forest/60 sm:text-base">
        {subtitle}
      </p>
      <ul className="mt-8 divide-y divide-tamblingan/15 border-y border-tamblingan/15">
        {programs.map((program) => (
          <li
            key={program.name}
            className="grid gap-2 py-5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6"
          >
            <div>
              <p className="font-extrabold tracking-wide text-tamblingan">
                {program.name}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-forest/45">
                {program.meaning}
              </p>
            </div>
            <p className="text-justify text-sm leading-relaxed text-forest/75 sm:text-base">
              {program.blurb}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
