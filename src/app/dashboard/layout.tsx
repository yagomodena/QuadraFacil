import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Home, Calendar, Shield, DollarSign, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'owner-avatar-1');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-6 text-primary" />
            <span className="text-lg font-semibold font-headline">QuadraFácil</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/dashboard"><Home /> Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"><Calendar /> Agenda</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"><Shield /> Minhas Quadras</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"><DollarSign /> Financeiro</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"><Settings /> Configurações</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 border-t">
            <Avatar className="size-9">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Avatar do proprietário" />}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">João da Silva</span>
              <span className="text-xs text-muted-foreground truncate">Arena Esportiva</span>
            </div>
             <Button variant="ghost" size="icon" className="ml-auto" asChild>
                <Link href="/"><LogOut /></Link>
             </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div>{/* This div is a spacer */}</div>
          <Button>Nova Reserva</Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
