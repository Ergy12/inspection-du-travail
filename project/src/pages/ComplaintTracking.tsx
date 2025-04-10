import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Building2, User2, FileText } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';
import type { Complaint, Invitation } from '../types';

interface ComplaintTrackingProps {
  onBack: () => void;
}

// Exemple de données pour la démonstration
const mockComplaint: Complaint = {
  id: '1',
  code: 'COMP123456',
  status: 'in_progress',
  personalInfo: {
    email: 'exemple@email.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    middleName: '',
    age: 35,
    gender: 'male',
    maritalStatus: 'married',
    address: '123 Rue Exemple',
    phone: '+243123456789'
  },
  professionalInfo: {
    companyName: 'Entreprise ABC',
    position: 'Technicien',
    contractStartYear: 2020,
    companyAddress: '456 Avenue Business'
  },
  complaintInfo: {
    reason: 'Conditions de travail inadéquates',
    details: 'Les conditions de sécurité ne sont pas respectées sur le lieu de travail.'
  },
  createdAt: new Date('2024-02-15'),
  updatedAt: new Date('2024-02-20')
};

const mockInvitations: Invitation[] = [
  {
    id: '1',
    complaintId: '1',
    message: 'Vous êtes invité à une réunion de médiation le 25 février 2024',
    isRead: false,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '2',
    complaintId: '1',
    message: 'Nouveau document disponible concernant votre plainte',
    isRead: true,
    createdAt: new Date('2024-02-18')
  }
];

const statusTranslations = {
  received: 'Reçue',
  pending: 'En attente',
  in_progress: 'En cours de traitement',
  resolved: 'Résolue',
  classified: 'Classée'
};

export function ComplaintTracking({ onBack }: ComplaintTrackingProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [complaint] = useState<Complaint | null>(mockComplaint);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Suivi de Plainte</h1>
            </div>
            <NotificationBell 
              invitations={mockInvitations}
              onClick={() => setShowNotifications(!showNotifications)}
            />
          </div>
        </div>
      </div>

      {/* Section de recherche */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Entrez votre code de plainte"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Rechercher la Plainte
          </button>
        </div>

        {/* Affichage des notifications */}
        {showNotifications && (
          <div className="mt-4 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {mockInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={`p-4 rounded-lg ${
                    invitation.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <p className="text-gray-900">{invitation.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(invitation.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Affichage de la plainte */}
        {complaint && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Plainte #{complaint.code}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {statusTranslations[complaint.status]}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <User2 className="h-5 w-5 text-gray-500" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-gray-900">{`${complaint.personalInfo.firstName} ${complaint.personalInfo.lastName}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{complaint.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{complaint.personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-gray-900">{complaint.personalInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Informations professionnelles */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  Informations Professionnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Entreprise</p>
                    <p className="text-gray-900">{complaint.professionalInfo.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Poste</p>
                    <p className="text-gray-900">{complaint.professionalInfo.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Année de début</p>
                    <p className="text-gray-900">{complaint.professionalInfo.contractStartYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse de l'entreprise</p>
                    <p className="text-gray-900">{complaint.professionalInfo.companyAddress}</p>
                  </div>
                </div>
              </div>

              {/* Détails de la plainte */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Détails de la Plainte
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Motif</p>
                    <p className="text-gray-900">{complaint.complaintInfo.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-900">{complaint.complaintInfo.details}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  Chronologie
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date de création</p>
                    <p className="text-gray-900">
                      {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="text-gray-900">
                      {new Date(complaint.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}