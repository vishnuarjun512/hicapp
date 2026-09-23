import { iconMap, navItems } from "@/lib/social-data";
import Link from "next/link";

export const FootBar = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-background/95 p-2 backdrop-blur lg:hidden">
      {navItems.map((item, i) => {
        if (i == 4) return;
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 p-2 text-[10px] text-muted-foreground"
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
