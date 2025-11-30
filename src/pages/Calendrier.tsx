import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEvenementsList } from '@/hooks/useEvenements'
import { useAudiencesList } from '@/hooks/useAudiences'

const locales = {
  fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function Calendrier() {
  const { data: evenements } = useEvenementsList()
  const { data: audiences } = useAudiencesList()

  const events = [
    ...(evenements || []).map((evt) => ({
      id: evt.id,
      title: evt.titre,
      start: new Date(evt.date_debut),
      end: evt.date_fin ? new Date(evt.date_fin) : new Date(evt.date_debut),
      resource: 'evenement'
    })),
    ...(audiences || []).map((aud) => ({
      id: aud.id,
      title: `Audience: ${aud.objet}`,
      start: new Date(aud.date_audience),
      end: new Date(aud.date_audience),
      resource: 'audience'
    }))
  ]

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendrier & Audiences</h1>
            <p className="text-muted-foreground">Visualisation des événements et demandes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] bg-white rounded-md border">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                messages={{
                  next: 'Suivant',
                  previous: 'Précédent',
                  today: "Aujourd'hui",
                  month: 'Mois',
                  week: 'Semaine',
                  day: 'Jour',
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
