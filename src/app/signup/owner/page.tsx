'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const ownerSignUpSchema = z.object({
  nome: z.string().min(1, "Nome do proprietário é obrigatório."),
  nomeEstabelecimento: z.string().min(1, "Nome do estabelecimento é obrigatório."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  telefone: z.string().min(10, "Telefone inválido."),
  cidade: z.string().min(1, "Cidade é obrigatória."),
  quantidadeQuadras: z.coerce.number().int().min(1, "Deve ter pelo menos 1 quadra."),
});

type OwnerSignUpFormValues = z.infer<typeof ownerSignUpSchema>;

export default function OwnerSignUp() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<OwnerSignUpFormValues>({
    resolver: zodResolver(ownerSignUpSchema),
    defaultValues: {
      nome: "",
      nomeEstabelecimento: "",
      email: "",
      password: "",
      telefone: "",
      cidade: "",
      quantidadeQuadras: 1,
    }
  });

  const onSubmit = async (data: OwnerSignUpFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const proprietarioData = {
        id: user.uid,
        email: data.email,
        nome: data.nome,
        nomeEstabelecimento: data.nomeEstabelecimento,
        cidade: data.cidade,
        telefone: data.telefone,
        tipoPlano: "Mensal", // Default plan
        quantidadeQuadras: data.quantidadeQuadras,
      };

      const docRef = doc(firestore, "proprietarios", user.uid);
      setDocumentNonBlocking(docRef, proprietarioData, { merge: false });

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o seu painel.",
      });

      router.push("/dashboard");

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      let description = "Ocorreu um erro. Por favor, tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este e-mail já está em uso. Tente fazer login.";
      }
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: description,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">Cadastre seu Estabelecimento</CardTitle>
              <CardDescription>Preencha os dados abaixo e comece a gerenciar suas quadras online.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem><FormLabel>Nome do Proprietário</FormLabel><FormControl><Input placeholder="João da Silva" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="nomeEstabelecimento" render={({ field }) => (
                    <FormItem><FormLabel>Nome do Estabelecimento</FormLabel><FormControl><Input placeholder="Arena Esportiva" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="email@exemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="telefone" render={({ field }) => (
                    <FormItem><FormLabel>Telefone de Contato</FormLabel><FormControl><Input type="tel" placeholder="(00) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="cidade" render={({ field }) => (
                    <FormItem><FormLabel>Cidade / Bairro</FormLabel><FormControl><Input placeholder="São Paulo / Pinheiros" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="quantidadeQuadras" render={({ field }) => (
                    <FormItem><FormLabel>Quantidade de Quadras</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline font-medium text-primary">
                  Faça login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
