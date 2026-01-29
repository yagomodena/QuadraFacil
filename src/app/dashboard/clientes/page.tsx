'use client'

import React, { useEffect, useState, useMemo } from "react"
import {
  File,
  PlusCircle,
  Search,
  MoreHorizontal,
  Users,
  Loader2
} from "lucide-react"
import { collection, collectionGroup, getDocs, query, where, doc, documentId } from "firebase/firestore"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { Cliente, Reserva } from "@/lib/types"


export default function ClientesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [clients, setClients] = useState<Cliente[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const reservationsQuery = useMemoFirebase(
      () => user ? query(collectionGroup(firestore, 'reservas'), where('proprietarioId', '==', user.uid)) : null,
      [firestore, user]
    );

    const { data: reservations, isLoading: loadingReservations } = useCollection<Reserva>(reservationsQuery);

    useEffect(() => {
        if (loadingReservations || !reservations) {
            if(!loadingReservations){
                setLoadingClients(false);
            }
            return;
        };

        const clientIds = [...new Set(reservations.map(r => r.clienteId).filter(Boolean))] as string[];

        if (clientIds.length === 0) {
            setClients([]);
            setLoadingClients(false);
            return;
        }

        const fetchClients = async () => {
            setLoadingClients(true);
            try {
                const clientsRef = collection(firestore, 'clientes');
                // Firestore 'in' query is limited to 30 elements. For more, chunk the array.
                const q = query(clientsRef, where(documentId(), 'in', clientIds.slice(0, 30)));
                const clientSnap = await getDocs(q);
                const fetchedClients = clientSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Cliente[];
                setClients(fetchedClients);
            } catch (e) {
                console.error("Error fetching clients:", e);
                setClients([]);
            } finally {
                setLoadingClients(false);
            }
        };

        fetchClients();

    }, [reservations, loadingReservations, firestore]);
    
    const clientStats = useMemo(() => {
        const activeClients = new Set<string>();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        reservations?.forEach(r => {
            if (r.clienteId && new Date(r.dataHora) > thirtyDaysAgo) {
                activeClients.add(r.clienteId);
            }
        });

        return {
            totalClients: clients.length,
            activeClientsCount: activeClients.size,
            totalReservations: reservations?.length || 0,
        };
    }, [clients, reservations]);

    const findClientInfo = (clientId: string) => {
        const clientReservations = reservations?.filter(r => r.clienteId === clientId);
        const lastVisit = clientReservations?.reduce((latest, r) => {
            const rDate = new Date(r.dataHora);
            return rDate > latest ? rDate : latest;
        }, new Date(0));

        return {
            reservations: clientReservations?.length || 0,
            lastVisit: lastVisit && lastVisit.getTime() > 0 ? lastVisit.toLocaleDateString('pt-BR') : 'N/A'
        }
    }
    
  const isLoading = loadingReservations || loadingClients;

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
              <h1 className="text-2xl font-semibold font-headline">Clientes</h1>
              <p className="text-muted-foreground">
                  Gerencie sua base de clientes e visualize informações importantes.
              </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
              <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Buscar cliente..."
                      className="w-full rounded-lg bg-background pl-8"
                      disabled
                  />
              </div>
              <Button disabled>
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Cliente
              </Button>
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{clientStats.totalClients}</div>}
            <p className="text-xs text-muted-foreground">Clientes que já reservaram.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos (30 dias)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{clientStats.activeClientsCount}</div>}
            <p className="text-xs text-muted-foreground">Clientes com reservas recentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{clientStats.totalReservations}</div>}
            <p className="text-xs text-muted-foreground">Reservas realizadas por clientes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Informações detalhadas sobre cada cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="hidden md:table-cell text-center">Reservas</TableHead>
                <TableHead className="hidden sm:table-cell">Última Visita</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto my-4"/></TableCell>
                </TableRow>
              )}
              {!isLoading && clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nenhum cliente encontrado.</TableCell>
                </TableRow>
              )}
              {!isLoading && clients.map((client) => {
                const info = findClientInfo(client.id);
                return (
                    <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.primeiroNome} {client.sobrenome}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-center text-muted-foreground">{info.reservations}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {info.lastVisit}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem disabled>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" disabled>
                            Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{clients.length}</strong> de <strong>{clientStats.totalClients}</strong> clientes
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
