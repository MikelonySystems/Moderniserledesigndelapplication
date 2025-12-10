import { useState } from 'react';
import {
  User,
  CreditCard,
  FileText,
  Package,
  Download,
  Trash2,
  ChevronRight,
  Check,
  AlertTriangle,
} from 'lucide-react';

export function ComptePage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Données mockées
  const userData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.fr',
    subscription: {
      name: 'Formule Pro',
      price: '9,99 €',
      period: 'mois',
      nextBilling: '15 janvier 2026',
      status: 'active',
    },
    paymentMethod: {
      type: 'Carte bancaire',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/2027',
    },
    lastInvoice: {
      number: 'INV-2024-12-001',
      date: '15 décembre 2024',
      amount: '9,99 €',
      status: 'Payée',
    },
  };

  const subscriptionPlans = [
    {
      id: 'gratuit',
      name: 'Gratuit',
      price: '0 €',
      period: 'mois',
      features: ['Jusqu\'à 10 cachets/mois', 'Gestion basique', 'Export PDF'],
      current: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '9,99 €',
      period: 'mois',
      features: [
        'Cachets illimités',
        'Toutes les fonctionnalités',
        'Export Excel',
        'Support prioritaire',
      ],
      current: true,
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '19,99 €',
      period: 'mois',
      features: [
        'Tout de Pro',
        'Comptabilité avancée',
        'Conseiller dédié',
        'Formation personnalisée',
      ],
      current: false,
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 pb-8">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A1E3F] to-purple-600 text-white shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-[#0A1E3F]">Mon Compte</h1>
            <p className="text-[#6B7280]">Gérez votre compte et votre abonnement</p>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0A1E3F]">Informations personnelles</h2>
            <button className="text-[#0A1E3F] hover:underline">
              Modifier
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#6B7280] mb-1">Prénom</label>
              <p className="text-[#374151]">{userData.firstName}</p>
            </div>
            <div>
              <label className="block text-[#6B7280] mb-1">Nom</label>
              <p className="text-[#374151]">{userData.lastName}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#6B7280] mb-1">Email</label>
              <p className="text-[#374151]">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Abonnement actuel */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <h2 className="text-[#0A1E3F] mb-6">Abonnement actuel</h2>
          <div className="bg-gradient-to-br from-[#0A1E3F] to-purple-600 text-white rounded-xl p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white mb-1">{userData.subscription.name}</h3>
                <p className="text-white/80">
                  {userData.subscription.price}/{userData.subscription.period}
                </p>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                Active
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white/90">
                Prochain prélèvement : {userData.subscription.nextBilling}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCancelDialog(true)}
            className="text-red-600 hover:underline"
          >
            Résilier mon abonnement
          </button>
        </div>

        {/* Changer d'abonnement */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <h2 className="text-[#0A1E3F] mb-6">Changer d&apos;abonnement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-all ${
                  plan.current
                    ? 'border-[#0A1E3F] bg-[#F9FAFB]'
                    : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0A1E3F] text-white text-xs rounded-full">
                    Populaire
                  </span>
                )}
                {plan.current && (
                  <div className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs rounded-full">
                    <Check className="w-3 h-3" />
                    Actuelle
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-[#374151] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#0A1E3F]">{plan.price}</span>
                    <span className="text-[#6B7280]">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-[#6B7280]"
                    >
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.current}
                  className={`w-full py-2 rounded-lg transition-all ${
                    plan.current
                      ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                      : 'bg-[#0A1E3F] text-white hover:bg-[#152945]'
                  }`}
                >
                  {plan.current ? 'Formule actuelle' : 'Choisir'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mode de paiement */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0A1E3F]">Mode de paiement</h2>
            <button className="text-[#0A1E3F] hover:underline">
              Modifier
            </button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-[#E5E7EB]">
              <CreditCard className="w-6 h-6 text-[#0A1E3F]" />
            </div>
            <div className="flex-1">
              <p className="text-[#374151]">
                {userData.paymentMethod.brand} •••• {userData.paymentMethod.last4}
              </p>
              <p className="text-sm text-[#6B7280]">
                Expire le {userData.paymentMethod.expiry}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Dernière facture */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <h2 className="text-[#0A1E3F] mb-6">Dernière facture</h2>
          <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-[#E5E7EB]">
              <FileText className="w-6 h-6 text-[#0A1E3F]" />
            </div>
            <div className="flex-1">
              <p className="text-[#374151]">
                Facture n°{userData.lastInvoice.number}
              </p>
              <p className="text-sm text-[#6B7280]">
                {userData.lastInvoice.date} • {userData.lastInvoice.amount} •{' '}
                <span className="text-emerald-600">{userData.lastInvoice.status}</span>
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A1E3F] text-white rounded-lg hover:bg-[#152945] transition-all">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>
          <button className="mt-4 text-[#0A1E3F] hover:underline">
            Voir toutes les factures
          </button>
        </div>

        {/* Données personnelles */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
          <h2 className="text-[#0A1E3F] mb-6">Mes données personnelles</h2>
          <div className="space-y-4">
            <button className="flex items-center justify-between w-full p-4 bg-[#F9FAFB] rounded-xl hover:bg-[#F1F3F5] transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-[#E5E7EB]">
                  <Download className="w-6 h-6 text-[#0A1E3F]" />
                </div>
                <div className="text-left">
                  <p className="text-[#374151]">Télécharger mes données</p>
                  <p className="text-sm text-[#6B7280]">
                    Export complet au format JSON
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center justify-between w-full p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-red-200">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-red-900">Supprimer mon compte</p>
                  <p className="text-sm text-red-700">
                    Action irréversible
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialog: Résilier l'abonnement */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-[#0A1E3F]">Résilier l&apos;abonnement</h3>
            </div>
            <p className="text-[#6B7280] mb-6">
              Êtes-vous sûr de vouloir résilier votre abonnement ? Vous perdrez l&apos;accès
              aux fonctionnalités Premium à la fin de votre période de facturation
              actuelle ({userData.subscription.nextBilling}).
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  // Logique de résiliation
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Résilier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Supprimer le compte */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-[#0A1E3F]">Supprimer le compte</h3>
            </div>
            <p className="text-[#6B7280] mb-4">
              Cette action est <strong>irréversible</strong>. Toutes vos données seront
              définitivement supprimées :
            </p>
            <ul className="list-disc list-inside text-[#6B7280] mb-6 space-y-1">
              <li>Tous vos cachets et revenus</li>
              <li>Vos dépenses et trajets</li>
              <li>Vos informations personnelles</li>
              <li>Votre historique AEM</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900">
                Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
              </p>
              <input
                type="text"
                placeholder="SUPPRIMER"
                className="w-full mt-2 px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  // Logique de suppression
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
