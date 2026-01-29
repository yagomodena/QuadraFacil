'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CalendarCheck, Clock, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { Reserva, Cliente } from '@/lib/types';
import { isToday, isThisWeek, parseISO, format } from 'date-fns';

function RecentBookingRow({ reserva }: { reserva: Reserva }) {
    const firestore = useFirestore();
    const [clientName, setClientName] = React.useState('Carregando...');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchClientName = async () => {
            setIsLoading(true);
            let name = reserva.clienteNome || 'Cliente não identificado';
            if (reserva.clienteId) {
                try {
                    const clientDoc = await getDoc(doc(firestore, 'clientes', reserva.clienteId));
                    if (clientDoc.exists()) {
                        const clientData = clientDoc.data() as Cliente;
                        name = `${clientData.primeiroNome} ${clientData.sobrenome}`;
                    }
                } catch (error) {
                    console.error("Error fetching client name:", error);
                    name = 'Erro ao buscar cliente';
                }
            }
            setClientName(name);
            setIsLoading(false);
        };

        fetchClientName();
    }, [reserva, firestore]);

    return (
        <TableRow>
            <TableCell className="font-medium">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : clientName}
            </TableCell>
            <TableCell className="hidden sm:table-cell">{reserva.quadraNome || 'N/A'}</TableCell>
            <TableCell className="hidden md:table-cell">{format(parseISO(reserva.dataHora), 'HH:mm')}</TableCell>
            <TableCell className="text-right">
                <Badge className={cn(
                    "border-transparent capitalize",
                    reserva.status === 'pago' && 'bg-accent text-accent-foreground hover:bg-accent/80',
                    reserva.status === 'pendente' && 'bg-warning text-warning-foreground hover:bg-warning/80',
                    reserva.status === 'cancelado' && 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
                )}>
                    {reserva.status}
                </Badge>
            </TableCell>
        </TableRow>
    );
}

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const allReservationsQuery = useMemoFirebase(
      () => user ? query(collectionGroup(firestore, 'reservas'), where('proprietarioId', '==', user.uid)) : null,
      [firestore, user]
    );

    const recentReservationsQuery = useMemoFirebase(
      () => user ? query(collectionGroup(firestore, 'reservas'), where('proprietarioId', '==', user.uid), orderBy('dataHora', 'desc'), limit(5)) : null,
      [firestore, user]
    );

    const { data: allReservations, isLoading: allReservationsLoading } = useCollection<Reserva>(allReservationsQuery);
    const { data: recentReservations, isLoading: recentReservationsLoading } = useCollection<Reserva>(recentReservationsQuery);

    const stats = useMemo(() => {
        if (!allReservations) return {
            revenueToday: 0,
            bookingsToday: 0,
            occupancyThisWeek: 0,
            // We can't calculate new clients just from reservations easily. This would need more logic.
        };

        const today = new Date();
        const paidReservations = allReservations.filter(r => r.status === 'pago');

        const revenueToday = paidReservations
            .filter(r => isToday(parseISO(r.dataHora)))
            .reduce((acc, r) => acc + 80, 0); // Assuming a fixed price for now. Real implementation needs quadra price.

        const bookingsToday = allReservations.filter(r => isToday(parseISO(r.dataHora))).length;
        
        // This is a simplification. Real occupancy needs to know total available slots.
        const bookingsThisWeek = allReservations.filter(r => isThisWeek(parseISO(r.dataHora), { weekStartsOn: 1 })).length;
        const occupancyThisWeek = bookingsThisWeek > 0 ? Math.min(Math.round((bookingsThisWeek / (7*16)) * 100), 100) : 0; // Assuming 16 slots/day

        return { revenueToday, bookingsToday, occupancyThisWeek };
    }, [allReservations]);


  const isLoading = isUserLoading || allReservationsLoading || recentReservationsLoading;

  return (
    <>
    <h1 className="text-2xl font-semibold font-headline pb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">R$ {stats.revenueToday.toFixed(2)}</div>}
              <p className="text-xs text-muted-foreground">Reservas pagas hoje</p>
            </CardContent>
          </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.bookingsToday}</div>}
              <p className="text-xs text-muted-foreground">Total de agendamentos para hoje</p>
            </CardContent>
          </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupação da Semana</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.occupancyThisWeek}%</div>}
                <p className="text-xs text-muted-foreground">(Estimativa simplificada)</p>
            </CardContent>
          </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">N/D</div>}
              <p className="text-xs text-muted-foreground">Cálculo em desenvolvimento</p>
            </CardContent>
          </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Reservas Recentes</CardTitle>
            <CardDescription>As últimas 5 reservas feitas no seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell">Quadra</TableHead>
                    <TableHead className="hidden md:table-cell">Horário</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto my-4" />
                        </TableCell>
                    </TableRow>
                )}
                {!isLoading && recentReservations?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">Nenhuma reserva encontrada.</TableCell>
                    </TableRow>
                )}
                {!isLoading && recentReservations?.map((reserva) => (
                    <RecentBookingRow key={reserva.id} reserva={reserva} />
                ))}
            </TableBody>
        </Table>
        </CardContent>
      </Card>
    </>
  );
}
