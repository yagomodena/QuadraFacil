'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { doc } from 'firebase/firestore'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase'
import { Proprietario } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

const profileFormSchema = z.object({
    nome: z.string().min(1, "Nome do proprietário é obrigatório."),
    telefone: z.string().min(10, "Telefone inválido."),
})

const establishmentFormSchema = z.object({
    nomeEstabelecimento: z.string().min(1, "Nome do estabelecimento é obrigatório."),
    cidade: z.string().min(1, "Cidade é obrigatória."),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type EstablishmentFormValues = z.infer<typeof establishmentFormSchema>

export default function ConfiguracoesPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const [isEstablishmentSaving, setIsEstablishmentSaving] = useState(false);

    const proprietarioRef = useMemoFirebase(
        () => (user ? doc(firestore, 'proprietarios', user.uid) : null),
        [firestore, user]
    );
    const { data: proprietario, isLoading: isProprietarioLoading } = useDoc<Proprietario>(proprietarioRef);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            nome: "",
            telefone: "",
        }
    })

    const establishmentForm = useForm<EstablishmentFormValues>({
        resolver: zodResolver(establishmentFormSchema),
        defaultValues: {
            nomeEstabelecimento: "",
            cidade: ""
        }
    })

    useEffect(() => {
        if (proprietario) {
            profileForm.reset({
                nome: proprietario.nome,
                telefone: proprietario.telefone,
            });
            establishmentForm.reset({
                nomeEstabelecimento: proprietario.nomeEstabelecimento,
                cidade: proprietario.cidade,
            });
        }
    }, [proprietario, profileForm, establishmentForm]);


    async function onProfileSubmit(data: ProfileFormValues) {
        if (!proprietarioRef) return;
        setIsProfileSaving(true);
        try {
            await updateDocumentNonBlocking(proprietarioRef, data);
            toast({ title: "Sucesso!", description: "Seu perfil foi atualizado." });
        } finally {
            setIsProfileSaving(false);
        }
    }

    async function onEstablishmentSubmit(data: EstablishmentFormValues) {
        if (!proprietarioRef) return;
        setIsEstablishmentSaving(true);
        try {
            await updateDocumentNonBlocking(proprietarioRef, data);
            toast({ title: "Sucesso!", description: "Os dados do estabelecimento foram atualizados." });
        } finally {
            setIsEstablishmentSaving(false);
        }
    }
    
    const isLoading = isUserLoading || isProprietarioLoading;

    return (
        <>
            <h1 className="text-2xl font-semibold font-headline pb-4">Configurações</h1>
            <div className="space-y-6">
                <Card>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                            <CardHeader>
                                <CardTitle>Perfil do Proprietário</CardTitle>
                                <CardDescription>Atualize suas informações pessoais.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <FormField control={profileForm.control} name="nome" render={({ field }) => (
                                            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" disabled value={proprietario?.email || ''} /></FormControl></FormItem>
                                        <FormField control={profileForm.control} name="telefone" render={({ field }) => (
                                            <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" disabled={isLoading || isProfileSaving}>
                                    {isProfileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>

                <Card>
                    <Form {...establishmentForm}>
                         <form onSubmit={establishmentForm.handleSubmit(onEstablishmentSubmit)}>
                            <CardHeader>
                                <CardTitle>Dados do Estabelecimento</CardTitle>
                                <CardDescription>Gerencie as informações do seu negócio.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 {isLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <FormField control={establishmentForm.control} name="nomeEstabelecimento" render={({ field }) => (
                                            <FormItem><FormLabel>Nome do Estabelecimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={establishmentForm.control} name="cidade" render={({ field }) => (
                                            <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" disabled={isLoading || isEstablishmentSaving}>
                                    {isEstablishmentSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </>
    )
}
