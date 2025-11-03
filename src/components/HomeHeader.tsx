import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/assets/PetaSarePolos.png";

interface HomeHeaderProps {
  isScrolled: boolean;
}

export const HomeHeader = ({ isScrolled }: HomeHeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-transparent border-b-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-orange-400 flex items-center justify-center transition-all duration-300 w-10 h-10`}>
              <img src={Logo} alt="PetaSare Logo" className="h-8 w-8 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-foreground">PetaSare</h1>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="border-border transition-transform active:scale-95 h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>{theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"}</p></TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};