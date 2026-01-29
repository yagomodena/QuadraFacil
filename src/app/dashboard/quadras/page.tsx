'use client'

import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react"
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import { Quadra } from "@/lib/types"

export default function QuadrasPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const quadrasRef = useMemoFirebase(
      () => (user ? collection(firestore, 'proprietarios', user.uid, 'quadras') : null),
      [firestore, user]
    );
    const { data: quadras, isLoading: isQuadrasLoading } = useCollection<Quadra>(quadrasRef);

    const isLoading = isUserLoading || isQuadrasLoading;

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold font-headline">Minhas Quadras</h1>
                <Button disabled>
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
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto my-4" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && quadras?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Nenhuma quadra cadastrada.</TableCell>
                                </TableRow>
                            )}
                            {!isLoading && quadras?.map((quadra) => (
                                <TableRow key={quadra.id}>
                                    <TableCell className="font-medium">{quadra.nomeQuadra}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{quadra.tipoEsporte}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{`R$ ${quadra.precoHora.toFixed(2)}/h`}</TableCell>
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
                                                <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                                                <DropdownMenuItem disabled>Desativar</DropdownMenuItem>
                                                <DropdownMenuItem disabled className="text-destructive">Excluir</DropdownMenuItem>
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
