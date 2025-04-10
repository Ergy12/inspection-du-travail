import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ComplaintForm } from '../components/ComplaintForm';

interface ComplaintSubmissionProps {
  onBack: () => void;
}

export function ComplaintSubmission({ onBack }: ComplaintSubmissionProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </button>
        <h1 className="text-3xl font-bold text-center mb-8">
          Déposer une Plainte
        </h1>
        <ComplaintForm />
      </div>
    </div>
  );
}