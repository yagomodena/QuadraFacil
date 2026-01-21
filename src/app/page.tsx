import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, CalendarClock, Smartphone, Wallet, BarChart3, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-sports-court');
  const testimonialAvatar1 = PlaceHolderImages.find(p => p.id === 'testimonial-avatar-1');
  const testimonialAvatar2 = PlaceHolderImages.find(p => p.id === 'testimonial-avatar-2');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/60 z-10"/>
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="container relative z-20 flex flex-col items-center gap-6 px-4">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              A gestão da sua quadra, elevada a outro nível.
            </h1>
            <p className="max-w-2xl text-lg text-neutral-200">
              Automatize agendamentos, pagamentos e a comunicação com seus clientes. Menos preocupação para você, mais tempo de jogo para eles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/signup/owner">Comece a usar grátis</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#features">Conheça os recursos</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How it works */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Como Funciona</div>
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Simples de começar. Fácil de gerenciar.</h2>
                </div>
                <div className="grid gap-12 md:grid-cols-3">
                    <HowItWorksStep number="1" title="Cadastre-se" description="Crie sua conta em minutos e cadastre os dados do seu estabelecimento e suas quadras." />
                    <HowItWorksStep number="2" title="Configure" description="Defina seus horários de funcionamento, preços, e regras de agendamento e pagamento." />
                    <HowItWorksStep number="3" title="Divulgue e Gerencie" description="Compartilhe seu link de agendamento e gerencie todas as reservas em um painel centralizado." />
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-muted border-y">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Recursos Principais</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que você precisa para decolar</h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                Nossa plataforma foi pensada para resolver os principais desafios dos proprietários de quadras esportivas.
              </p>
            </div>
            <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CalendarClock className="h-8 w-8 text-primary" />}
                title="Agenda Inteligente"
                description="Controle horários, visualize agendamentos e evite conflitos com uma agenda online disponível 24/7."
              />
              <FeatureCard
                icon={<Smartphone className="h-8 w-8 text-primary" />}
                title="Reservas Online"
                description="Seus clientes agendam diretamente pelo seu link exclusivo, sem precisar de ligações ou mensagens."
              />
              <FeatureCard
                icon={<Wallet className="h-8 w-8 text-primary" />}
                title="Pagamento Integrado"
                description="Receba pagamentos via PIX ou cartão de crédito com confirmação automática. Chega de calotes."
              />
               <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Relatórios e Insights"
                description="Acompanhe a performance do seu negócio com dados de ocupação, faturamento e novos clientes."
              />
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                     <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Amado por proprietários em todo o Brasil</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <TestimonialCard 
                        avatar={testimonialAvatar1}
                        name="Camila Borges"
                        location="Arena Fute-Vôlei, RJ"
                        testimonial='"O QuadraFácil transformou a gestão do meu negócio. A taxa de ocupação aumentou 30% e não tenho mais dor de cabeça com agendamentos duplicados."'
                    />
                    <TestimonialCard 
                        avatar={testimonialAvatar2}
                        name="Ricardo Alves"
                        location="Tennis Club, SP"
                        testimonial='"A funcionalidade de pagamento online é fantástica. Reduziu a inadimplência a zero e facilitou muito a vida dos meus clientes. Recomendo demais!"'
                    />
                </div>
            </div>
        </section>


        {/* Pricing Section */}
        <section className="w-full py-16 md:py-24 bg-muted border-y">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Um preço que cabe no seu negócio</h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                Comece hoje mesmo com um plano simples e transparente. Sem taxas escondidas.
              </p>
            </div>
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:items-start">
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
                  "Divisão de Pagamentos (em breve)",
                  "10% de desconto",
                  "Suporte prioritário",
                ]}
                ctaText="Economize com o Anual"
                isFeatured={true}
              />
            </div>
             <div className="text-center mt-8 text-sm text-muted-foreground">
                <p>Precisa de um plano personalizado? <Link href="#" className="text-primary underline">Entre em contato</Link>.</p>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 text-center flex flex-col items-center gap-4">
                 <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Pronto para simplificar a gestão da sua quadra?</h2>
                 <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                    Junte-se a centenas de proprietários que já estão economizando tempo e aumentando seu faturamento.
                 </p>
                 <Button asChild size="lg" className="mt-4">
                    <Link href="/signup/owner">Criar minha conta agora</Link>
                 </Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function HowItWorksStep({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                {number}
            </div>
            <h3 className="text-xl font-bold font-headline">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="grid gap-4 text-center">
      <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <div className="grid gap-1">
        <h3 className="text-lg font-bold font-headline">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ avatar, name, location, testimonial }: { avatar: any; name: string; location: string; testimonial: string; }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                        {avatar && <AvatarImage src={avatar.imageUrl} alt={avatar.description} />}
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">{location}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                </div>
                <p className="text-muted-foreground italic">
                    {testimonial}
                </p>
            </CardContent>
        </Card>
    )
}

function PricingCard({ plan, price, period, features, ctaText, isFeatured = false }: { plan: string; price: string; period:string; features: string[]; ctaText: string; isFeatured?: boolean }) {
  return (
    <Card className={`w-full max-w-sm transition-all duration-300 ${isFeatured ? 'border-primary shadow-2xl scale-105' : 'border-border hover:shadow-lg'}`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-headline text-2xl">{plan}</CardTitle>
        {isFeatured && <p className="text-xs font-semibold uppercase tracking-wider text-primary">MAIS POPULAR</p>}
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="text-center">
          <span className="text-4xl font-extrabold">R$ {price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        <ul className="grid gap-3 text-sm text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-accent" />
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
