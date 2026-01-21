import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function OwnerSignUp() {
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner-name">Nome do Proprietário</Label>
                <Input id="owner-name" placeholder="João da Silva" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishment-name">Nome do Estabelecimento</Label>
                <Input id="establishment-name" placeholder="Arena Esportiva" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone de Contato</Label>
                <Input id="phone" type="tel" placeholder="(00) 99999-9999" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade / Bairro</Label>
                <Input id="city" placeholder="São Paulo / Pinheiros" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courts-qty">Quantidade de Quadras</Label>
                <Input id="courts-qty" type="number" placeholder="2" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport-type">Tipo de Esporte</Label>
                <Input id="sport-type" placeholder="Futebol, Tênis, Vôlei" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="picture">Foto do Estabelecimento (Opcional)</Label>
                <Input id="picture" type="file" className="text-muted-foreground" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">Criar minha conta</Button>
              </div>
            </form>
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
