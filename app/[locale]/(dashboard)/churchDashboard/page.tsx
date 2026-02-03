"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Plus, Trash2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

export default function Page() {
    useEffect(() => {
        const getData = async () => {
            const data = await fetch("")
        }
    },[])

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="default">Payé</Badge>
      case "Pending":
        return <Badge variant="secondary">En attente</Badge>
      case "Unpaid":
        return <Badge variant="destructive">Impayé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 min-w-full">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue Pasteur Jean</h1>
        <p className="text-lg text-muted-foreground">
          Nous sommes ravis de vous voir aujourd'hui
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Membres</p>
          <p className="text-2xl font-bold">245</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Présence Dimanche</p>
          <p className="text-2xl font-bold">189</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Nouveaux Ce Mois</p>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>

      {/* Actions & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Les fidèles de l'Église de la Victoire</h2>
          <p className="text-sm text-muted-foreground">
            Gestion complète des membres et des contributions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un membre..." 
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Facture</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Méthode de paiement</TableHead>
              <TableHead className="font-semibold text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice} className="hover:bg-muted/50">
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{getStatusBadge(invoice.paymentStatus)}</TableCell>
                <TableCell className="font-medium">{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right font-semibold">{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/50">
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total des contributions
              </TableCell>
              <TableCell className="text-right font-bold text-lg">
                $2,500.00
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Additional Information
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border p-5 space-y-3">
          <h3 className="text-lg font-semibold">Dernières activités</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Jean Dupont</p>
                <p className="text-sm text-muted-foreground">Nouveau membre inscrit</p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Marie Lambert</p>
                <p className="text-sm text-muted-foreground">Don mensuel reçu</p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 1 jour</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-5 space-y-3">
          <h3 className="text-lg font-semibold">Prochains événements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Culte du dimanche</p>
                <p className="text-sm text-muted-foreground">9h30 - 12h00</p>
              </div>
              <p className="text-sm text-muted-foreground">Demain</p>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Réunion de prière</p>
                <p className="text-sm text-muted-foreground">19h00 - 20h30</p>
              </div>
              <p className="text-sm text-muted-foreground">Mercredi</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}