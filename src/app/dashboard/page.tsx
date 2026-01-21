import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CalendarCheck, Clock } from "lucide-react";
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

const stats = [
  { title: "Receita Hoje", value: "R$ 450,00", icon: DollarSign, change: "+20% vs ontem" },
  { title: "Reservas Hoje", value: "3", icon: CalendarCheck, change: "+1 reserva vs ontem" },
  { title: "Ocupação da Semana", value: "65%", icon: Clock, change: "+5% vs semana passada" },
  { title: "Novos Clientes", value: "+2", icon: Users, change: "este mês" },
];

const recentBookings = [
    { id: 'REC001', client: 'Grupo do Fute', court: 'Quadra 1', time: '19:00', status: 'pago' },
    { id: 'REC002', client: 'Ana e Amigos', court: 'Quadra de Vôlei', time: '20:00', status: 'pendente' },
    { id: 'REC003', client: 'Carlos', court: 'Quadra de Tênis', time: '18:00', status: 'pago' },
    { id: 'REC004', client: 'Equipe Rocket', court: 'Quadra 2', time: '21:00', status: 'cancelado' },
    { id: 'REC005', client: 'Fute de Terça', court: 'Quadra 1', time: '20:00', status: 'pago' },
];

export default function DashboardPage() {
  return (
    <>
    <h1 className="text-2xl font-semibold font-headline pb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
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
                {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.client}</TableCell>
                        <TableCell className="hidden sm:table-cell">{booking.court}</TableCell>
                        <TableCell className="hidden md:table-cell">{booking.time}</TableCell>
                        <TableCell className="text-right">
                            <Badge className={cn(
                                "border-transparent capitalize",
                                booking.status === 'pago' && 'bg-accent text-accent-foreground hover:bg-accent/80',
                                booking.status === 'pendente' && 'bg-warning text-warning-foreground hover:bg-warning/80',
                                booking.status === 'cancelado' && 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
                            )}>
                                {booking.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </CardContent>
      </Card>
    </>
  );
}
