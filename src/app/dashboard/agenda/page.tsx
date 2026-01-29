'use client';

import { useMemo, useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay, isBefore, startOfToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, collectionGroup, query, where } from 'firebase/firestore';

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
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { Quadra, Reserva } from '@/lib/types';


const bookingFormSchema = z.object({
  client: z.string().min(1, "O nome do cliente é obrigatório."),
  court: z.string().min(1, "A quadra é obrigatória."),
  status: z.enum(["pago", "pendente", "cancelado"]),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;


const toneStyles: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
    amber: 'bg-amber-400/15 border-amber-400/30 text-amber-800',
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-800',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-800',
};


function NewBookingDialog({
  isOpen,
  onOpenChange,
  selectedSlot,
  onSubmitBooking,
  quadras,
  isSubmitting,
}: {
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  selectedSlot: { date: Date, time: string } | null,
  onSubmitBooking: (data: BookingFormValues) => void,
  quadras: Quadra[],
  isSubmitting: boolean
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
                        <SelectItem key={quadra.id} value={quadra.id}>
                          {quadra.nomeQuadra}
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
                      defaultValue={field.value as string}
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Agendar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function AgendaPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isNewBookingDialogOpen, setNewBookingDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quadrasRef = useMemoFirebase(() => (user ? collection(firestore, 'proprietarios', user.uid, 'quadras') : null), [firestore, user]);
  const reservationsQuery = useMemoFirebase(() => user ? query(collectionGroup(firestore, 'reservas'), where('proprietarioId', '==', user.uid)) : null, [firestore, user]);

  const { data: quadras, isLoading: quadrasLoading } = useCollection<Quadra>(quadrasRef);
  const { data: reservations, isLoading: reservationsLoading } = useCollection<Reserva>(reservationsQuery);


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
    cancelado: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
  };

  const findBookingsForSlot = (time: string, day: Date) => {
    if (!reservations) return [];
    return reservations.filter((booking) => {
        const bookingDate = parseISO(booking.dataHora);
        return isSameDay(bookingDate, day) && format(bookingDate, 'HH:mm') === time;
    });
  };

  const handleNewBookingClick = (day: Date, hour: string) => {
    if (isBefore(day, startOfToday()) && !isSameDay(day, startOfToday())) {
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
    
  const handleSubmitBooking = async (data: BookingFormValues) => {
    if (!selectedSlot || !user || !quadras) return;

    setIsSubmitting(true);
    const selectedQuadra = quadras.find(q => q.id === data.court);

    if (!selectedQuadra) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Quadra selecionada inválida.' });
        setIsSubmitting(false);
        return;
    }
    
    const reservationDate = new Date(selectedSlot.date);
    const [hour, minute] = selectedSlot.time.split(':');
    reservationDate.setHours(parseInt(hour), parseInt(minute));

    const newBooking: Omit<Reserva, 'id'> = {
      proprietarioId: user.uid,
      quadraId: selectedQuadra.id,
      quadraNome: selectedQuadra.nomeQuadra,
      clienteNome: data.client,
      dataHora: reservationDate.toISOString(),
      status: data.status,
      tipoPagamento: 'nao-definido',
    };

    const reservationsRef = collection(firestore, 'proprietarios', user.uid, 'quadras', selectedQuadra.id, 'reservas');
    
    try {
        await addDocumentNonBlocking(reservationsRef, newBooking);
        toast({
            title: "Agendamento Criado!",
            description: `Reserva para ${data.client} no dia ${format(selectedSlot.date, 'dd/MM')} às ${selectedSlot.time}.`,
        });
        setNewBookingDialogOpen(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Agendar",
            description: "Ocorreu um erro ao salvar a reserva. Tente novamente.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (quadrasLoading || reservationsLoading) {
    return (
        <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
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
                      const bookingsInSlot = findBookingsForSlot(hour, day);
                      const isPast = isBefore(day, startOfToday()) && !isSameDay(day, startOfToday());
                      const availableCourts = (quadras?.length || 0) - bookingsInSlot.length;
                      return (
                        <div key={day.toISOString()} className="px-2 py-2 border-l border-border/60">
                          {bookingsInSlot.length > 0 ? (
                            <div className="space-y-2">
                            {bookingsInSlot.map(booking => (
                                <div
                                key={booking.id}
                                className={cn(
                                    'rounded-lg border px-3 py-2 shadow-sm',
                                    toneStyles[(booking.quadraId || 'Q1').slice(-1)] // Temporary logic for color
                                )}
                                >
                                <p className="text-xs font-semibold">{booking.clienteNome || 'Cliente'}</p>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    {booking.quadraNome}
                                </p>
                                <Badge
                                    variant="outline"
                                    className={cn('mt-2 capitalize border text-xs bg-white/70', statusStyles[booking.status as keyof typeof statusStyles])}
                                >
                                    {booking.status}
                                </Badge>
                                </div>
                            ))}
                            {availableCourts > 0 && (
                                 <button
                                    onClick={() => handleNewBookingClick(day, hour)}
                                    disabled={isPast}
                                    className="h-full w-full rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs text-primary/80 flex items-center justify-center transition-colors hover:bg-primary/10"
                                >
                                    + Agendar
                                </button>
                            )}
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
            quadras={quadras || []}
            isSubmitting={isSubmitting}
        />
    </div>
  );
}
