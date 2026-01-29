'use client';

import { useMemo, useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

// Mock data for now
const establishmentData = {
    id: 'estabelecimentoX',
    name: 'Arena Esportiva',
    quadras: [
        { id: 'Q1', nome: 'Quadra 1 (Futebol)' },
        { id: 'Q2', nome: 'Quadra 2 (Futebol)' },
        { id: 'Q3', nome: 'Quadra de Vôlei' },
        { id: 'Q4', nome: 'Quadra de Tênis' },
    ]
};

const today = new Date();
const startOfThisWeek = startOfWeek(today, { locale: ptBR });

const initialBookings = [
    { date: startOfThisWeek, time: '08:00', court: 'Quadra 1 (Futebol)' },
    { date: addDays(startOfThisWeek, 1), time: '09:00', court: 'Quadra 2 (Futebol)' },
    { date: addDays(startOfThisWeek, 2), time: '11:00', court: 'Quadra de Vôlei' },
    { date: addDays(startOfThisWeek, 2), time: '14:00', court: 'Quadra 1 (Futebol)' },
    { date: addDays(startOfThisWeek, 3), time: '16:00', court: 'Quadra de Tênis' },
    { date: addDays(startOfThisWeek, 4), time: '19:00', court: 'Quadra 2 (Futebol)' },
    { date: addDays(startOfThisWeek, 5), time: '10:00', court: 'Quadra 1 (Futebol)' },
];

const bookingFormSchema = z.object({
  court: z.string().min(1, "A quadra é obrigatória."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;


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
  quadras: {id: string, nome: string}[],
  isSubmitting: boolean,
}) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      court: "",
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
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>
            Você está reservando o horário das {selectedSlot.time} no dia {format(selectedSlot.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual quadra você deseja?</FormLabel>
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Agendamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function PublicBookingPage() {
  const params = useParams();
  const establishmentId = params.estabelecimentoId as string;
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const { user, isUserLoading } = useUser();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  const [isNewBookingDialogOpen, setNewBookingDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNewBookingClick = (day: Date, hour: string) => {
    if (isBefore(day, startOfToday()) && !isSameDay(day, startOfToday())) {
        toast({
            variant: "destructive",
            title: "Data Inválida",
            description: "Não é possível criar agendamentos em datas passadas.",
        });
        return;
    }
    
    if (isUserLoading) return;

    if (!user) {
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`/auth/cliente?redirectUrl=${redirectUrl}`);
        return;
    }

    setSelectedSlot({ date: day, time: hour });
    setNewBookingDialogOpen(true);
  }
    
  const handleSubmitBooking = async (data: BookingFormValues) => {
    if (!selectedSlot || !user) return;

    setIsSubmitting(true);

    const selectedQuadra = establishmentData.quadras.find(q => q.nome === data.court);
    if (!selectedQuadra) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Quadra selecionada inválida.' });
        setIsSubmitting(false);
        return;
    }

    const reservationDate = new Date(selectedSlot.date);
    const [hour, minute] = selectedSlot.time.split(':');
    reservationDate.setHours(parseInt(hour), parseInt(minute));

    const newBooking = {
      clienteId: user.uid,
      quadraId: selectedQuadra.id,
      dataHora: reservationDate.toISOString(),
      status: 'pendente',
      tipoPagamento: 'nao-definido',
    };

    const bookingsRef = collection(firestore, 'proprietarios', establishmentId, 'quadras', selectedQuadra.id, 'reservas');
    
    try {
        await addDocumentNonBlocking(bookingsRef, newBooking);
        
        // Add to local state for immediate UI update until Firestore is fully integrated
        setBookings(prev => [
            ...prev, 
            { 
                date: selectedSlot.date, 
                time: selectedSlot.time, 
                court: data.court, 
                client: user.displayName || 'Cliente', 
                status: 'pendente' 
            }
        ]);

        toast({
            title: "Solicitação de Reserva Enviada!",
            description: `Sua reserva para ${format(selectedSlot.date, 'dd/MM')} às ${selectedSlot.time} aguarda confirmação.`,
        });
        setNewBookingDialogOpen(false);
    } catch (error) {
        // Error is handled globally by the error emitter in non-blocking-updates
        toast({
            variant: "destructive",
            title: "Erro ao Agendar",
            description: "Não foi possível criar sua reserva. Tente novamente.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const getBookedCountForSlot = (hour: string, day: Date) => {
    return bookings.filter(b => isSameDay(b.date, day) && b.time === hour).length;
  }

  const allCourtsCount = establishmentData.quadras.length;

  if (isUserLoading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
        <Header />
        <main className="flex-1 py-8 md:py-12">
            <div className="container">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold font-headline">Reservar Horário</h1>
                        <p className="text-muted-foreground">
                            Agenda de horários para <span className="font-bold text-primary">{establishmentData.name}</span>.
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
                                    disabled={(date) => date < startOfToday() && !isSameDay(date, startOfToday())}
                                />
                                </PopoverContent>
                            </Popover>
                            <Button variant="outline" size="icon" onClick={goToNextWeek}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                    </div>
                    </div>
                </div>

                <Card className="mt-6 border-border/60 bg-background/95 shadow-lg">
                    <CardContent className="p-0">
                    <div className="relative overflow-auto">
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
                                  const bookedCount = getBookedCountForSlot(hour, day);
                                  const isFullyBooked = bookedCount >= allCourtsCount;
                                  const isPast = isBefore(day, startOfToday()) && !isSameDay(day, startOfToday());
                                return (
                                    <div key={day.toISOString()} className="px-2 py-2 border-l border-border/60">
                                    <button
                                        onClick={() => handleNewBookingClick(day, hour)}
                                        disabled={isPast || isFullyBooked}
                                        className={cn(
                                            "h-full w-full rounded-2xl border border-dashed px-4 py-3 text-xs flex items-center justify-center transition-colors text-center",
                                            isPast && "bg-muted/30 cursor-not-allowed text-muted-foreground",
                                            !isPast && isFullyBooked && "bg-rose-500/10 border-rose-500/20 text-rose-700 cursor-not-allowed",
                                            !isPast && !isFullyBooked && "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 hover:bg-emerald-500/10 hover:border-emerald-500/40"
                                        )}
                                    >
                                      {isPast ? "Encerrado" : (isFullyBooked ? "Lotado" : "Disponível")}
                                    </button>
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
                    quadras={establishmentData.quadras}
                    isSubmitting={isSubmitting}
                />
            </div>
        </main>
        <Footer />
    </div>
  );
}
