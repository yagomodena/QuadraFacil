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
        <section className="relative h-[70vh] min-h-[560px] w-full overflow-hidden flex items-center justify-center text-center text-white">
          <div className="absolute inset-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover scale-[1.03]"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-28 right-8 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>
          <div className="container relative z-20 flex flex-col items-center gap-6 px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em]">
              Gestao inteligente de quadras
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              A gestao da sua quadra,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-white">
                elevada a outro nivel.
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-neutral-200">
              Automatize agendamentos, pagamentos e a comunicacao com seus clientes. Menos preocupacao para voce, mais tempo de jogo para eles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="shadow-[0_20px_50px_-20px_rgba(56,189,248,0.45)]">
                <Link href="/signup/owner">Comece a usar gratis</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Link href="#features">Conheca os recursos</Link>
              </Button>
            </div>
            <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-4 text-left sm:grid-cols-4">
              {[
                { label: 'Reservas 24/7', value: '+2.1k' },
                { label: 'Taxa de ocupacao', value: '30%+' },
                { label: 'Pagamentos em dia', value: 'Zero atraso' },
                { label: 'Clientes fieis', value: '+410' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                  <p className="text-lg font-semibold">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Como Funciona</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Simples de comecar. Facil de gerenciar.</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              <HowItWorksStep number="1" title="Cadastre-se" description="Crie sua conta em minutos e cadastre os dados do seu estabelecimento e suas quadras." />
              <HowItWorksStep number="2" title="Configure" description="Defina seus horarios de funcionamento, precos, e regras de agendamento e pagamento." />
              <HowItWorksStep number="3" title="Divulgue e Gerencie" description="Compartilhe seu link de agendamento e gerencie todas as reservas em um painel centralizado." />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-muted border-y relative overflow-hidden">
          <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Recursos Principais</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que voce precisa para decolar</h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                Nossa plataforma foi pensada para resolver os principais desafios dos proprietarios de quadras esportivas.
              </p>
            </div>
            <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CalendarClock className="h-8 w-8 text-primary" />}
                title="Agenda Inteligente"
                description="Controle horarios, visualize agendamentos e evite conflitos com uma agenda online disponivel 24/7."
              />
              <FeatureCard
                icon={<Smartphone className="h-8 w-8 text-primary" />}
                title="Reservas Online"
                description="Seus clientes agendam diretamente pelo seu link exclusivo, sem precisar de ligacoes ou mensagens."
              />
              <FeatureCard
                icon={<Wallet className="h-8 w-8 text-primary" />}
                title="Pagamento Integrado"
                description="Receba pagamentos via PIX ou cartao de credito com confirmacao automatica. Chega de calotes."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Relatorios e Insights"
                description="Acompanhe a performance do seu negocio com dados de ocupacao, faturamento e novos clientes."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Amado por proprietarios em todo o Brasil</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <TestimonialCard
                avatar={testimonialAvatar1}
                name="Camila Borges"
                location="Arena Fute-Volei, RJ"
                testimonial='"O QuadraFacil transformou a gestao do meu negocio. A taxa de ocupacao aumentou 30% e nao tenho mais dor de cabeca com agendamentos duplicados."'
              />
              <TestimonialCard
                avatar={testimonialAvatar2}
                name="Ricardo Alves"
                location="Tennis Club, SP"
                testimonial='"A funcionalidade de pagamento online e fantastica. Reduziu a inadimplencia a zero e facilitou muito a vida dos meus clientes. Recomendo demais!"'
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-16 md:py-24 bg-muted border-y relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_55%)]" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Um preco que cabe no seu negocio</h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                Comece hoje mesmo com um plano simples e transparente. Sem taxas escondidas.
              </p>
            </div>
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:items-start">
              <PricingCard
                plan="Mensal"
                price="49,90"
                period="/mes por quadra"
                features={[
                  'Agenda completa',
                  'Pagamentos online (PIX e Cartao)',
                  'Gestao de horarios',
                  'Relatorios financeiros',
                ]}
                ctaText="Comecar com plano Mensal"
              />
              <PricingCard
                plan="Anual"
                price="Sob consulta"
                period="Plano sob medida para sua rede"
                features={[
                  'Tudo do plano Mensal',
                  'Divisao de Pagamentos (em breve)',
                  'Suporte prioritario',
                  'Onboarding personalizado',
                ]}
                ctaText="Quero falar com o time"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              Pronto para escalar
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Pronto para simplificar a gestao da sua quadra?</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
              Junte-se a centenas de proprietarios que ja estao economizando tempo e aumentando seu faturamento.
            </p>
            <Button asChild size="lg" className="mt-4 shadow-[0_20px_50px_-20px_rgba(56,189,248,0.45)]">
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
    <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-border bg-background/70 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-[0_10px_30px_-12px_rgba(59,130,246,0.7)]">
        {number}
      </div>
      <h3 className="text-xl font-bold font-headline">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="grid gap-4 text-center rounded-2xl border border-border bg-background/80 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.25)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
      <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
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
    <Card className="border-border/70 bg-background/80 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.25)] backdrop-blur">
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
  );
}

function PricingCard({ plan, price, period, features, ctaText, isFeatured = false }: { plan: string; price: string; period: string; features: string[]; ctaText: string; isFeatured?: boolean }) {
  const isConsult = price.toLowerCase() === 'sob consulta';

  return (
    <Card className={`relative w-full max-w-sm transition-all duration-300 ${isFeatured ? 'border-primary/40 shadow-[0_30px_80px_-45px_rgba(14,165,233,0.6)] scale-[1.03] bg-gradient-to-br from-background via-background to-primary/5' : 'border-border hover:shadow-lg bg-background'}`}>
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
          Plano estrategico
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-headline text-2xl">{plan}</CardTitle>
        {isFeatured && <p className="text-xs font-semibold uppercase tracking-wider text-primary">MAIS POPULAR</p>}
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="text-center">
          {isConsult ? (
            <>
              <span className="text-3xl font-extrabold text-primary">{price}</span>
              <p className="mt-2 text-sm text-muted-foreground">{period}</p>
            </>
          ) : (
            <>
              <span className="text-4xl font-extrabold">R$ {price}</span>
              <span className="text-sm text-muted-foreground">{period}</span>
            </>
          )}
        </div>
        <ul className="grid gap-3 text-sm text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className={isFeatured ? 'bg-primary text-primary-foreground shadow-[0_20px_50px_-25px_rgba(14,165,233,0.6)]' : 'bg-primary/90'}>
          <Link href="/signup/owner">{ctaText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
