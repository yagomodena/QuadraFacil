'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const bookingsForDate = [
    { time: '18:00', court: 'Quadra 1', client: 'Grupo do Fute', status: 'pago' },
    { time: '19:00', court: 'Quadra 2', client: 'Amigos do Vôlei', status: 'pendente' },
    { time: '20:00', court: 'Quadra 1', client: 'Fute de Terça', status: 'pago' },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold font-headline pb-4">Agenda</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        classNames={{
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                        }}
                    />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Reservas para {date ? date.toLocaleDateString('pt-BR') : 'Data Selecionada'}
              </CardTitle>
            </CardHeader>
            <CardContent>
                {bookingsForDate.length > 0 ? (
                    <div className="space-y-4">
                        {bookingsForDate.map((booking, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-semibold">{booking.time} - {booking.court}</p>
                                <p className="text-sm text-muted-foreground">{booking.client}</p>
                            </div>
                            <Badge className={cn(
                                "border-transparent capitalize",
                                booking.status === 'pago' && 'bg-accent text-accent-foreground hover:bg-accent/80',
                                booking.status === 'pendente' && 'bg-warning text-warning-foreground hover:bg-warning/80',
                            )}>
                                {booking.status}
                            </Badge>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center">Nenhuma reserva para esta data.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
