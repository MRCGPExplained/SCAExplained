const DARK = "#333333";
const YELLOW = "#F6D44B";

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  photoUrl,
  size = 44,
}: {
  name: string;
  photoUrl?: string | null;
  size?: number;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, admin-supplied URLs; not worth Image domain config for a handful of testimonials
      <img
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0 font-display font-bold"
      style={{
        width: size,
        height: size,
        background: YELLOW,
        color: DARK,
        fontSize: size * 0.38,
      }}
    >
      {initialsFor(name)}
    </span>
  );
}
