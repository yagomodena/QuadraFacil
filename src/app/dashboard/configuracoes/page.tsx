'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

const profileFormSchema = z.object({
    nome: z.string().min(1, "Nome do proprietário é obrigatório."),
    email: z.string().email("E-mail inválido."),
    telefone: z.string().min(10, "Telefone inválido."),
})

const establishmentFormSchema = z.object({
    nomeEstabelecimento: z.string().min(1, "Nome do estabelecimento é obrigatório."),
    cidade: z.string().min(1, "Cidade é obrigatória."),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type EstablishmentFormValues = z.infer<typeof establishmentFormSchema>

export default function ConfiguracoesPage() {
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            nome: "Nome do Proprietário",
            email: "email@proprietario.com",
            telefone: "(11) 99999-9999",
        }
    })

    const establishmentForm = useForm<EstablishmentFormValues>({
        resolver: zodResolver(establishmentFormSchema),
        defaultValues: {
            nomeEstabelecimento: "Meu Estabelecimento",
            cidade: "São Paulo"
        }
    })

    function onProfileSubmit(data: ProfileFormValues) {
        console.log(data)
    }

    function onEstablishmentSubmit(data: EstablishmentFormValues) {
        console.log(data)
    }

    return (
        <>
            <h1 className="text-2xl font-semibold font-headline pb-4">Configurações</h1>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil do Proprietário</CardTitle>
                        <CardDescription>Atualize suas informações pessoais.</CardDescription>
                    </CardHeader>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField control={profileForm.control} name="nome" render={({ field }) => (
                                    <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={profileForm.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" disabled {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={profileForm.control} name="telefone" render={({ field }) => (
                                    <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit">Salvar Alterações</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Estabelecimento</CardTitle>
                        <CardDescription>Gerencie as informações do seu negócio.</CardDescription>
                    </CardHeader>
                    <Form {...establishmentForm}>
                         <form onSubmit={establishmentForm.handleSubmit(onEstablishmentSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField control={establishmentForm.control} name="nomeEstabelecimento" render={({ field }) => (
                                    <FormItem><FormLabel>Nome do Estabelecimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={establishmentForm.control} name="cidade" render={({ field }) => (
                                    <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit">Salvar Alterações</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </>
    )
}
