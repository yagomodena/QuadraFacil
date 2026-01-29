'use client';

import { useMemo, useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';

const today = new Date();
const startOfThisWeek = startOfWeek(today, { locale: ptBR });

const initialBookings = [
    { date: startOfThisWeek, time: '08:00', court: 'Quadra 1', client: 'Fute da Manha', status: 'pago', tone: 'emerald' },
    { date: addDays(startOfThisWeek, 1), time: '09:00', court: 'Quadra 2', client: 'Treino Juvenil', status: 'pendente', tone: 'amber' },
    { date: addDays(startOfThisWeek, 2), time: '11:00', court: 'Quadra 3', client: 'Partida Amadora', status: 'pago', tone: 'sky' },
    { date: addDays(startOfThisWeek, 2), time: '14:00', court: 'Quadra 1', client: 'Grupo do Fute', status: 'pago', tone: 'rose' },
    { date: addDays(startOfThisWeek, 3), time: '16:00', court: 'Quadra 4', client: 'Liga Noturna', status: 'pago', tone: 'violet' },
    { date: addDays(startOfThisWeek, 4), time: '19:00', court: 'Quadra 2', client: 'Amigos do Volei', status: 'pendente', tone: 'amber' },
    { date: addDays(startOfThisWeek, 5), time: '10:00', court: 'Quadra 1', client: 'Fute de Sabado', status: 'pago', tone: 'emerald' },
];

const bookingFormSchema = z.object({
  client: z.string().min(1, "O nome do cliente é obrigatório."),
  court: z.string().min(1, "A quadra é obrigatória."),
  status: z.enum(["pago", "pendente"]),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const quadras = [
    { id: 'Q1', nome: 'Quadra 1 (Futebol)' },
    { id: 'Q2', nome: 'Quadra 2 (Futebol)' },
    { id: 'Q3', nome: 'Quadra de Vôlei' },
    { id: 'Q4', nome: 'Quadra de Tênis' },
];

const toneStyles: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
    amber: 'bg-amber-400/15 border-amber-400/30 text-amber-800',
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-800',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-800',
};

const courtTones: Record<string, string> = {
    'Quadra 1 (Futebol)': 'emerald',
    'Quadra 2 (Futebol)': 'sky',
    'Quadra de Vôlei': 'rose',
    'Quadra de Tênis': 'violet',
}


function NewBookingDialog({
  isOpen,
  onOpenChange,
  selectedSlot,
  onSubmitBooking
}: {
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  selectedSlot: { date: Date, time: string } | null,
  onSubmitBooking: (data: BookingFormValues) => void
}) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      client: "",
      court: "",
      status: "pendente",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  if (!selectedSlot) return null;

  const handleSubmit = (data: BookingFormValues) => {
    onSubmitBooking(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Reserva para {format(selectedSlot.date, "EEEE, dd 'de' MMMM", { locale: ptBR })} às {selectedSlot.time}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente / Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Grupo do Fute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quadra</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a quadra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {quadras.map((quadra) => (
                        <SelectItem key={quadra.id} value={quadra.nome}>
                          {quadra.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status do Pagamento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pendente" />
                        </FormControl>
                        <FormLabel className="font-normal">Pendente</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pago" />
                        </FormControl>
                        <FormLabel className="font-normal">Pago</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  const [isNewBookingDialogOpen, setNewBookingDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const { toast } = useToast();

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

  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const statusStyles = {
    pago: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    pendente: 'bg-amber-400/15 text-amber-600 border-amber-400/30',
  };

  const findBooking = (time: string, day: Date) => {
    return bookings.find((booking) => {
        return isSameDay(booking.date, day) && booking.time === time;
    });
  };

  const handleNewBookingClick = (day: Date, hour: string) => {
    if (isBefore(day, startOfToday())) {
        toast({
            variant: "destructive",
            title: "Data Inválida",
            description: "Não é possível criar agendamentos em datas passadas.",
        });
        return;
    }
    setSelectedSlot({ date: day, time: hour });
    setNewBookingDialogOpen(true);
  }
    
  const handleSubmitBooking = (data: BookingFormValues) => {
    if (!selectedSlot) return;

    const newBooking = {
      date: selectedSlot.date,
      time: selectedSlot.time,
      client: data.client,
      court: data.court,
      status: data.status,
      tone: courtTones[data.court as keyof typeof courtTones] || 'sky',
    };

    setBookings(prev => [...prev, newBooking]);
    toast({
        title: "Agendamento Criado!",
        description: `Reserva para ${data.client} no dia ${format(selectedSlot.date, 'dd/MM')} às ${selectedSlot.time}.`,
    })
  }

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
                      const isPast = isBefore(day, startOfToday());
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
                            <button
                                onClick={() => handleNewBookingClick(day, hour)}
                                disabled={isPast}
                                className={cn(
                                    "h-full w-full rounded-2xl border border-dashed border-border/60 px-4 py-3 text-xs text-muted-foreground flex items-center justify-center transition-colors",
                                    isPast 
                                    ? "bg-muted/30 cursor-not-allowed" 
                                    : "bg-muted/20 hover:bg-primary/5 hover:border-primary/40"
                                )}
                            >
                              {isPast ? "Passado" : "Disponível"}
                            </button>
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
      <NewBookingDialog
            isOpen={isNewBookingDialogOpen}
            onOpenChange={setNewBookingDialogOpen}
            selectedSlot={selectedSlot}
            onSubmitBooking={handleSubmitBooking}
        />
    </div>
  );
}
