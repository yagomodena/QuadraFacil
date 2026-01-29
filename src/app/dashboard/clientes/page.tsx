'use client'

import {
  File,
  PlusCircle,
  Search,
  MoreHorizontal,
  Users
} from "lucide-react"

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

const clientsData = [
  {
    id: "CLI001",
    name: "Grupo do Fute",
    contact: "joao@email.com",
    reservations: 12,
    lastVisit: "2024-07-15",
  },
  {
    id: "CLI002",
    name: "Ana e Amigos",
    contact: "(11) 98765-4321",
    reservations: 8,
    lastVisit: "2024-07-12",
  },
  {
    id: "CLI003",
    name: "Carlos",
    contact: "carlos.tenis@email.com",
    reservations: 5,
    lastVisit: "2024-07-10",
  },
  {
    id: "CLI004",
    name: "Equipe Rocket",
    contact: "jessie@email.com",
    reservations: 3,
    lastVisit: "2024-06-25",
  },
  {
    id: "CLI005",
    name: "Fute de Terça",
    contact: "pedro.fute@email.com",
    reservations: 25,
    lastVisit: "2024-07-16",
  },
  {
    id: "CLI006",
    name: "Vôlei de Sábado",
    contact: "sabado.volei@email.com",
    reservations: 15,
    lastVisit: "2024-07-13",
  },
]

export default function ClientesPage() {
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
                  />
              </div>
              <Button>
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos (30 dias)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
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
              {clientsData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{client.contact}</TableCell>
                   <TableCell className="hidden md:table-cell text-center text-muted-foreground">{client.reservations}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
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
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-6</strong> de <strong>8</strong> clientes
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
