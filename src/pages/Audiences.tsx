import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSignature,
  Forward,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react'

export default function Audiences() {
  const workflowSteps = [
    {
      title: 'Soumission',
      description: 'Demande validée par le Protocole',
      icon: FileSignature,
      status: 'Terminé',
    },
    {
      title: 'Validation',
      description: 'Revue par le Directeur de Cabinet',
      icon: ShieldCheck,
      status: 'En cours',
    },
    {
      title: 'Planification',
      description: 'Créneau confirmé et ordre du jour partagé',
      icon: CalendarCheck,
      status: 'À programmer',
    },
  ]

  const upcomingAudiences = [
    {
      title: 'Délégation économique ivoirienne',
      date: 'Lundi 18h30',
      location: 'Salon Vert',
      lead: 'Chef du Protocole',
    },
    {
      title: 'Conseil restreint Défense',
      date: 'Mercredi 09h00',
      location: 'Salle du Conseil',
      lead: 'Directeur de Cabinet',
    },
    {
      title: 'Ordre national du Mérite',
      date: 'Vendredi 11h00',
      location: 'Salle des Fêtes',
      lead: 'Chancelier des Ordres',
    },
  ]

  const pendingApprovals = [
    {
      title: 'Fondation Jeunesse & Citoyenneté',
      requester: 'Ministre de la Jeunesse',
      status: 'Validation Directeur',
      time: 'Reçu il y a 2h',
    },
    {
      title: 'Ambassadeur du Sénégal',
      requester: 'Affaires étrangères',
      status: 'Avis Protocole',
      time: 'Reçu il y a 1j',
    },
    {
      title: 'Signature PPP autoroute Abidjan-Yamoussoukro',
      requester: 'Primature',
      status: 'Contrôle agenda',
      time: 'Reçu il y a 3j',
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audiences Royales</h1>
            <p className="text-muted-foreground">
              Circuit complet des demandes, validations et planification des audiences royales
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>12 demandes actives • 4 validations en attente • 3 audiences planifiées</p>
              <p className="text-foreground">Priorité : audiences diplomatiques et protocolaires</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button className="bg-royal-burgundy text-white hover:bg-royal-burgundy/90">
                Nouvelle demande
              </Button>
              <Button variant="outline">Consulter l'agenda</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Workflow</CardTitle>
              <p className="text-sm text-muted-foreground">Protocole → Directeur → Cabinet Civil</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflowSteps.map((step) => (
                <div key={step.title} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="rounded-full bg-white p-2 text-royal-burgundy shadow-sm">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{step.title}</p>
                      <span className="text-xs text-royal-burgundy">{step.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Suivi en temps réel</CardTitle>
              <p className="text-sm text-muted-foreground">
                Notifications et commentaires directement reliés au dossier
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-medium">Ordre du jour partagé</p>
                  <p className="text-muted-foreground">Généré pour l'audience de mercredi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-royal-burgundy" />
                <div>
                  <p className="font-medium">Note du protocole</p>
                  <p className="text-muted-foreground">Précisions logistiques ajoutées</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">Relance automatique</p>
                  <p className="text-muted-foreground">Rappel envoyé au Directeur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Audiences à venir</CardTitle>
                <p className="text-sm text-muted-foreground">Détails logistiques et responsables</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                Voir le planning
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAudiences.map((audience) => (
                <div
                  key={audience.title}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{audience.title}</p>
                    <p className="text-sm text-muted-foreground">{audience.location}</p>
                  </div>
                  <div className="text-sm text-right text-muted-foreground sm:text-left">
                    <p>{audience.date}</p>
                    <p>Référent : {audience.lead}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Validations en attente</CardTitle>
                <p className="text-sm text-muted-foreground">Circuit de validation sécurisé</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                Transmettre
                <Forward className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.map((request) => (
                <div
                  key={request.title}
                  className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.requester}</p>
                  </div>
                  <div className="text-sm text-right sm:text-left">
                    <p className="text-royal-burgundy">{request.status}</p>
                    <p className="text-muted-foreground">{request.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
