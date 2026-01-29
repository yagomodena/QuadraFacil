'use client';

import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const today = new Date();
const startOfThisWeek = startOfWeek(today, { locale: ptBR });

const bookingsForWeek = [
    { date: startOfThisWeek, time: '08:00', court: 'Quadra 1', client: 'Fute da Manha', status: 'pago', tone: 'emerald' },
    { date: addDays(startOfThisWeek, 1), time: '09:00', court: 'Quadra 2', client: 'Treino Juvenil', status: 'pendente', tone: 'amber' },
    { date: addDays(startOfThisWeek, 2), time: '11:00', court: 'Quadra 3', client: 'Partida Amadora', status: 'pago', tone: 'sky' },
    { date: addDays(startOfThisWeek, 2), time: '14:00', court: 'Quadra 1', client: 'Grupo do Fute', status: 'pago', tone: 'rose' },
    { date: addDays(startOfThisWeek, 3), time: '16:00', court: 'Quadra 4', client: 'Liga Noturna', status: 'pago', tone: 'violet' },
    { date: addDays(startOfThisWeek, 4), time: '19:00', court: 'Quadra 2', client: 'Amigos do Volei', status: 'pendente', tone: 'amber' },
    { date: addDays(startOfThisWeek, 5), time: '10:00', court: 'Quadra 1', client: 'Fute de Sabado', status: 'pago', tone: 'emerald' },
];


export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const week = useMemo(() => {
    const start = startOfWeek(currentDate, { locale: ptBR });
    const end = endOfWeek(currentDate, { locale: ptBR });
    return { start, end, days: eachDayOfInterval({ start, end }) };
  }, [currentDate]);

  const hours = useMemo(() => {
    const start = 7;
    const end = 22;
    return Array.from({ length: end - start + 1 }, (_, index) => {
      const hour = start + index;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  }, []);

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

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

  const findBooking = (time: string, day: Date) => {
    return bookingsForWeek.find((booking) => {
        return isSameDay(booking.date, day) && booking.time === time;
    });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold font-headline">Agenda Semanal</h1>
          <p className="text-muted-foreground">
            Visão da semana de {format(week.start, "d 'de' MMMM", { locale: ptBR })} a {format(week.end, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-auto min-w-[240px] justify-start text-left font-normal",
                        !currentDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentDate ? format(currentDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(day) => {
                            if (day) setCurrentDate(day);
                            setDatePickerOpen(false);
                        }}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
          </div>
          <Button>Novo agendamento</Button>
        </div>
      </div>

      <Card className="border-border/60 bg-background/95 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)]">
        <CardContent className="p-0">
          <div className="relative h-[calc(100vh-220px)] min-h-[640px] overflow-auto">
            <div className="min-w-[1200px]">
              <div className="sticky top-0 z-10 grid grid-cols-[100px_repeat(7,minmax(150px,1fr))] bg-background/95 backdrop-blur border-b border-border/60">
                <div className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Horário</div>
                {week.days.map((day) => (
                  <div key={day.toISOString()} className="px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="font-semibold capitalize">{format(day, 'E', { locale: ptBR })}</span>
                    <span className="block text-2xl font-bold text-foreground">{format(day, 'd')}</span>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-border/60">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-[100px_repeat(7,minmax(150px,1fr))]">
                    <div className="flex items-center justify-center px-4 py-6 text-sm text-muted-foreground">{hour}</div>
                    {week.days.map((day) => {
                      const booking = findBooking(hour, day);
                      return (
                        <div key={day.toISOString()} className="px-2 py-2 border-l border-border/60">
                          {booking ? (
                            <div
                              className={cn(
                                'h-full rounded-2xl border px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]',
                                toneStyles[booking.tone]
                              )}
                            >
                              <p className="text-sm font-semibold">{booking.client}</p>
                              <p className="text-xs font-semibold text-muted-foreground">
                                {booking.court}
                              </p>
                              <Badge
                                variant="outline"
                                className={cn('mt-3 capitalize border bg-white/70', statusStyles[booking.status as keyof typeof statusStyles])}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          ) : (
                            <div className="h-full rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground flex items-center justify-center">
                              Disponível
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
  );
}
