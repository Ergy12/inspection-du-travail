import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Copy, X } from 'lucide-react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { generateComplaintCode } from '../lib/utils';

const complaintSchema = z.object({
  personalInfo: z.object({
    email: z.string().email('Email invalide'),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    middleName: z.string().optional(),
    age: z.number().min(18, 'Vous devez avoir au moins 18 ans').max(100, 'Age invalide'),
    gender: z.enum(['male', 'female', 'other']),
    maritalStatus: z.string().min(1, 'Veuillez sélectionner votre situation matrimoniale'),
    address: z.string().min(5, 'Adresse invalide'),
    phone: z.string().min(10, 'Numéro de téléphone invalide'),
  }),
  professionalInfo: z.object({
    companyName: z.string().min(2, 'Nom de l\'entreprise invalide'),
    position: z.string().min(2, 'Poste invalide'),
    contractStartYear: z.number().min(1950).max(new Date().getFullYear()),
    companyAddress: z.string().min(5, 'Adresse de l\'entreprise invalide'),
  }),
  complaintInfo: z.object({
    reason: z.string().min(5, 'Motif de la plainte requis'),
    details: z.string().min(10, 'Les détails sont requis').max(400, 'Maximum 400 caractères'),
  }),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

interface SuccessModalProps {
  code: string;
  onClose: () => void;
}

function SuccessModal({ code, onClose }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Plainte Envoyée</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="mb-4">
          Votre plainte a été enregistrée avec succès. Voici votre code de suivi :
        </p>
        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md mb-4">
          <code className="flex-1 text-lg font-mono">{code}</code>
          <button
            onClick={copyCode}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            title="Copier le code"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Conservez ce code précieusement, il vous permettra de suivre l'état de votre plainte.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

export function ComplaintForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaintCode, setComplaintCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = (data: ComplaintFormData) => {
    const code = generateComplaintCode();
    setComplaintCode(code);
    setShowSuccess(true);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Déposer une Plainte</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations Personnelles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Informations Personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Email"
              {...register('personalInfo.email')}
              error={errors.personalInfo?.email?.message}
            />
            <Input
              placeholder="Prénom"
              {...register('personalInfo.firstName')}
              error={errors.personalInfo?.firstName?.message}
            />
            <Input
              placeholder="Nom"
              {...register('personalInfo.lastName')}
              error={errors.personalInfo?.lastName?.message}
            />
            <Input
              placeholder="Post-nom"
              {...register('personalInfo.middleName')}
            />
            <Input
              type="number"
              placeholder="Âge"
              {...register('personalInfo.age', { valueAsNumber: true })}
              error={errors.personalInfo?.age?.message}
            />
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              {...register('personalInfo.gender')}
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              {...register('personalInfo.maritalStatus')}
            >
              <option value="">Situation matrimoniale</option>
              <option value="single">Célibataire</option>
              <option value="married">Marié(e)</option>
              <option value="divorced">Divorcé(e)</option>
              <option value="widowed">Veuf/Veuve</option>
            </select>
            <Input
              placeholder="Adresse"
              {...register('personalInfo.address')}
              error={errors.personalInfo?.address?.message}
            />
            <Input
              placeholder="Téléphone"
              {...register('personalInfo.phone')}
              error={errors.personalInfo?.phone?.message}
            />
          </div>
        </div>

        {/* Informations Professionnelles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Informations Professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom de l'entreprise"
              {...register('professionalInfo.companyName')}
              error={errors.professionalInfo?.companyName?.message}
            />
            <Input
              placeholder="Poste occupé"
              {...register('professionalInfo.position')}
              error={errors.professionalInfo?.position?.message}
            />
            <Input
              type="number"
              placeholder="Année de début du contrat"
              {...register('professionalInfo.contractStartYear', { valueAsNumber: true })}
              error={errors.professionalInfo?.contractStartYear?.message}
            />
            <Input
              placeholder="Adresse de l'entreprise"
              {...register('professionalInfo.companyAddress')}
              error={errors.professionalInfo?.companyAddress?.message}
            />
          </div>
        </div>

        {/* Informations de la Plainte */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Détails de la Plainte</h3>
          <div className="space-y-4">
            <Input
              placeholder="Motif de la plainte"
              {...register('complaintInfo.reason')}
              error={errors.complaintInfo?.reason?.message}
            />
            <Textarea
              placeholder="Détails de la plainte (maximum 400 caractères)"
              {...register('complaintInfo.details')}
              error={errors.complaintInfo?.details?.message}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Soumettre la Plainte
        </button>
      </form>

      {showSuccess && (
        <SuccessModal
          code={complaintCode}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}