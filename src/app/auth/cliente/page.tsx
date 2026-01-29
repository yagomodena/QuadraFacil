'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Cliente } from "@/lib/types";

const signUpSchema = z.object({
  primeiroNome: z.string().min(1, "O primeiro nome é obrigatório."),
  sobrenome: z.string().min(1, "O sobrenome é obrigatório."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  telefone: z.string().optional(),
});
type SignUpFormValues = z.infer<typeof signUpSchema>;

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});
type LoginFormValues = z.infer<typeof loginSchema>;


export default function ClientAuthPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const redirectUrl = searchParams.get('redirectUrl') || '/';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { primeiroNome: "", sobrenome: "", email: "", password: "", telefone: ""},
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, "clientes", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const nameParts = user.displayName?.split(" ") || [""];
        const primeiroNome = nameParts[0];
        const sobrenome = nameParts.slice(1).join(" ");
        
        const newClientData: Cliente = {
            id: user.uid,
            email: user.email!,
            primeiroNome,
            sobrenome,
        }
        await setDoc(userDocRef, newClientData);
      }
      
      router.push(redirectUrl);

    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      toast({
        variant: "destructive",
        title: "Erro ao entrar com Google",
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: "E-mail ou senha inválidos.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        const newClientData: Cliente = {
            id: user.uid,
            email: data.email,
            primeiroNome: data.primeiroNome,
            sobrenome: data.sobrenome,
            ...(data.telefone && { telefone: data.telefone }),
        }
        
        const docRef = doc(firestore, "clientes", user.uid);
        setDocumentNonBlocking(docRef, newClientData, { merge: false });
        
        router.push(redirectUrl);

    } catch (error: any) {
        console.error("Erro no cadastro:", error);
        toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: error.code === 'auth/email-already-in-use' ? 'Este e-mail já está cadastrado.' : error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">Acesse ou Crie sua Conta</CardTitle>
          <CardDescription>Faça seu agendamento em segundos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
                Continuar com Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
            </div>
            
            <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="space-y-4 pt-4">
                     <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField control={loginForm.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={loginForm.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4 pt-4">
                    <Form {...signUpForm}>
                        <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={signUpForm.control} name="primeiroNome" render={({ field }) => (
                                    <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="João" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={signUpForm.control} name="sobrenome" render={({ field }) => (
                                    <FormItem><FormLabel>Sobrenome</FormLabel><FormControl><Input placeholder="Silva" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={signUpForm.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={signUpForm.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={signUpForm.control} name="telefone" render={({ field }) => (
                                <FormItem><FormLabel>Telefone (Opcional)</FormLabel><FormControl><Input type="tel" placeholder="(00) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Conta"}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
