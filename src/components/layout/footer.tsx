import { Icons } from '@/components/icons';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            Construído por apaixonados por esporte. &copy; {new Date().getFullYear()} QuadraFácil.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Um novo jeito de gerenciar e reservar quadras.
        </p>
      </div>
    </footer>
  );
}
