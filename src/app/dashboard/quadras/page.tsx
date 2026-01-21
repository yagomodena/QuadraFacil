'use client'

import { PlusCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const quadras = [
    { id: 'Q1', nome: 'Quadra 1 (Futebol)', tipo: 'Futebol', preco: 'R$ 80,00/h' },
    { id: 'Q2', nome: 'Quadra 2 (Futebol)', tipo: 'Futebol', preco: 'R$ 80,00/h' },
    { id: 'Q3', nome: 'Quadra de Vôlei', tipo: 'Vôlei de Praia', preco: 'R$ 60,00/h' },
    { id: 'Q4', nome: 'Quadra de Tênis', tipo: 'Tênis', preco: 'R$ 90,00/h' },
]

export default function QuadrasPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold font-headline">Minhas Quadras</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Quadra
                </Button>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Gerencie suas quadras</CardTitle>
                    <CardDescription>Visualize, edite ou adicione novas quadras ao seu estabelecimento.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead className="hidden md:table-cell">Esporte</TableHead>
                                <TableHead className="hidden md:table-cell">Preço</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quadras.map((quadra) => (
                                <TableRow key={quadra.id}>
                                    <TableCell className="font-medium">{quadra.nome}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{quadra.tipo}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{quadra.preco}</TableCell>
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
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem>Desativar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
