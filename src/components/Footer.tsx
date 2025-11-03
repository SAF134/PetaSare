import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto bg-transparent">
      <div className="container mx-auto px-4 md:px-6 border-t border-border/50 pt-6">
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PetaSare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};