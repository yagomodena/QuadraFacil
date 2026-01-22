'use client';

import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const courts = ['Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4'];

  const hours = useMemo(() => {
    const start = 7;
    const end = 22;

    return Array.from({ length: end - start + 1 }, (_, index) => {
      const hour = start + index;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  }, []);

  const bookingsForDate = [
    { time: '08:00', end: '09:00', court: 'Quadra 1', client: 'Fute da Manha', status: 'pago', tone: 'emerald' },
    { time: '09:00', end: '10:00', court: 'Quadra 2', client: 'Treino Juvenil', status: 'pendente', tone: 'amber' },
    { time: '11:00', end: '12:00', court: 'Quadra 3', client: 'Partida Amadora', status: 'pago', tone: 'sky' },
    { time: '14:00', end: '15:00', court: 'Quadra 1', client: 'Grupo do Fute', status: 'pago', tone: 'rose' },
    { time: '16:00', end: '17:00', court: 'Quadra 4', client: 'Liga Noturna', status: 'pago', tone: 'violet' },
    { time: '19:00', end: '20:00', court: 'Quadra 2', client: 'Amigos do Volei', status: 'pendente', tone: 'amber' },
    { time: '20:00', end: '21:00', court: 'Quadra 1', client: 'Fute de Terca', status: 'pago', tone: 'emerald' },
  ];

  const statusStyles = {
    pago: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    pendente: 'bg-amber-400/15 text-amber-600 border-amber-400/30',
  };

  const toneStyles: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
    amber: 'bg-amber-400/15 border-amber-400/30 text-amber-800',
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-800',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-800',
  };

  const findBooking = (time: string, court: string) => {
    return bookingsForDate.find((booking) => booking.time === time && booking.court === court);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold font-headline">Agenda</h1>
            <p className="text-muted-foreground">
              Visao diaria completa para {date ? date.toLocaleDateString('pt-BR') : 'Data selecionada'}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-border bg-background shadow-sm">
              <button className="px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Hoje</button>
              <button className="px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Semana</button>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <button className="text-base leading-none">‹</button>
              <span>02 - 06 Out</span>
              <button className="text-base leading-none">›</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">Buscar</button>
              <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lg">Novo agendamento</button>
              <button className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">Configurar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          <Card className="border-border/60 bg-background/80">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                classNames={{
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-accent text-accent-foreground',
                }}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/80">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Resumo do dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ocupacao</p>
                <p className="text-2xl font-semibold">72%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pagamentos</p>
                <p className="text-2xl font-semibold">R$ 2.940</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Proximo horario</p>
                <p className="text-2xl font-semibold">08:00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60 bg-background/95 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)]">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <CardTitle className="text-base font-semibold">Agenda por hora</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[calc(100vh-220px)] min-h-[640px] overflow-auto">
              <div className="min-w-[960px]">
                <div className="sticky top-0 z-10 grid grid-cols-[120px_repeat(4,minmax(200px,1fr))] bg-background/95 backdrop-blur border-b border-border/60">
                  <div className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Horario</div>
                  {courts.map((court) => (
                    <div key={court} className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {court}
                    </div>
                  ))}
                </div>
                <div className="divide-y divide-border/60">
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-[120px_repeat(4,minmax(200px,1fr))]">
                      <div className="px-4 py-6 text-sm text-muted-foreground">{hour}</div>
                      {courts.map((court) => {
                        const booking = findBooking(hour, court);
                        return (
                          <div key={`${hour}-${court}`} className="px-4 py-4">
                            {booking ? (
                              <div
                                className={cn(
                                  'h-full rounded-2xl border px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]',
                                  toneStyles[booking.tone]
                                )}
                              >
                                <p className="text-sm font-semibold">{booking.client}</p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.time} - {booking.end} | {booking.court}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={cn('mt-3 capitalize border bg-white/70', statusStyles[booking.status as keyof typeof statusStyles])}
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                            ) : (
                              <div className="h-full rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                                Disponivel
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
