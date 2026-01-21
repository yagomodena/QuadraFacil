'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Proprietario } from '@/lib/types';
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'owner-avatar-1');
  
  const proprietarioRef = useMemoFirebase(
    () => (user ? doc(firestore, 'proprietarios', user.uid) : null),
    [firestore, user]
  );
  const { data: proprietario, isLoading: isProprietarioLoading } = useDoc<Proprietario>(proprietarioRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.logo className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/agenda", label: "Agenda", icon: Calendar },
    { href: "/dashboard/quadras", label: "Minhas Quadras", icon: Shield },
    { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
    { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
  ];

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
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}><item.icon /> {item.label}</Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 border-t">
            <Avatar className="size-9">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Avatar do proprietário" />}
              <AvatarFallback>{proprietario?.nome?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
            {isProprietarioLoading ? (
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                </div>
            ) : (
                <>
                    <span className="text-sm font-semibold truncate">{proprietario?.nome}</span>
                    <span className="text-xs text-muted-foreground truncate">{proprietario?.nomeEstabelecimento}</span>
                </>
            )}
            </div>
             <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                <LogOut />
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
