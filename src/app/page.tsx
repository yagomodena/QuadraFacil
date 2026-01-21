import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, Calendar, Users, CreditCard } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-sports-court');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="flex flex-col gap-6">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-5xl lg:text-6xl">
              Agendamento de quadras, simplificado.
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              A plataforma completa para proprietários e jogadores. Gerencie suas quadras, receba pagamentos online e facilite a vida dos seus clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/signup/owner">Para Proprietários</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#find-court">Para Jogadores</Link>
              </Button>
            </div>
          </div>
          <div className="w-full h-80 lg:h-96 relative rounded-xl overflow-hidden shadow-2xl group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"/>
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-card border-y">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Nossos Recursos</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que você precisa em um só lugar</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                De agendamentos a pagamentos e relatórios, cobrimos todas as suas necessidades.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-primary" />}
                title="Agenda Inteligente"
                description="Visualize e gerencie todos os seus agendamentos em um calendário visual e intuitivo. Status por cores para fácil identificação."
              />
              <FeatureCard
                icon={<CreditCard className="h-8 w-8 text-primary" />}
                title="Pagamento Online Integrado"
                description="Receba pagamentos via PIX ou cartão de crédito. Confirmação automática e segurança para você e seus clientes."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Divisão de Pagamento"
                description="Permita que grupos dividam o valor da reserva. O sistema gera links individuais e só confirma a reserva quando todos pagam."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Um preço que cabe no seu negócio</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Comece hoje mesmo com um plano simples e transparente. Sem taxas escondidas.
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <PricingCard
                plan="Mensal"
                price="49,90"
                period="/mês por quadra"
                features={[
                  "Agenda completa",
                  "Pagamentos online (PIX e Cartão)",
                  "Gestão de horários",
                  "Relatórios financeiros",
                ]}
                ctaText="Começar com plano Mensal"
              />
              <PricingCard
                plan="Anual"
                price="44,90"
                period="/mês por quadra"
                features={[
                  "Tudo do plano Mensal",
                  "Divisão de Pagamentos",
                  "10% de desconto",
                  "Suporte prioritário",
                ]}
                ctaText="Economize 10%"
                isFeatured={true}
              />
            </div>
          </div>
        </section>

        {/* Placeholder for customer search */}
        <section id="find-court" className="w-full py-12 md:py-24 bg-card border-y">
            <div className="container text-center">
                 <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Encontre uma quadra</h2>
                 <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed mt-4">
                    Em breve, você poderá buscar e agendar em qualquer quadra parceira por aqui.
                 </p>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="grid gap-2 text-center md:text-left md:flex md:items-start md:gap-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <div className="grid gap-1">
        <h3 className="text-lg font-bold font-headline">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ plan, price, period, features, ctaText, isFeatured = false }: { plan: string; price: string; period:string; features: string[]; ctaText: string; isFeatured?: boolean }) {
  return (
    <Card className={`w-full max-w-sm transition-all duration-300 ${isFeatured ? 'border-primary shadow-2xl scale-105' : 'border-border'}`}>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">{plan}</CardTitle>
        {isFeatured && <div className="text-xs font-semibold text-primary">MAIS POPULAR</div>}
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="text-center">
          <span className="text-4xl font-extrabold">R$ {price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        <ul className="grid gap-3 text-sm text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className={isFeatured ? '' : 'bg-primary/90'}>
          <Link href="/signup/owner">{ctaText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
