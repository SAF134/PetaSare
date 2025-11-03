import Logo from "@/assets/PetaSarePolos.png";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header = ({ children, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "transition-all duration-300 z-40",
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
    </header>
  );
};