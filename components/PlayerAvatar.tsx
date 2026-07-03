import { getInitials } from "@/utils";

export function PlayerAvatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}