import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
