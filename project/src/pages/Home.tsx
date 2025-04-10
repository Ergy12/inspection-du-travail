import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, UserCog, LogIn } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { MissionCard } from '../components/MissionCard';
import { LoginModal } from '../components/LoginModal';
import { SignUpModal } from '../components/SignUpModal';

export function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        </div>
        
        <nav className="relative z-10 flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Inspection Générale du Travail</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowSignUpModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Créer un compte
            </button>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogIn size={20} />
              Connexion
            </button>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center h-[400px] text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Bienvenue à l'Inspection Générale du Travail
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/submit-complaint')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Déposer une plainte
            </button>
            <button 
              onClick={() => navigate('/track-complaint')}
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Suivre une plainte
            </button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<UserCog className="w-12 h-12 text-blue-600" />}
            title="Contrôle"
            description="Supervision et vérification des conditions de travail pour assurer le respect des normes légales."
          />
          <ServiceCard 
            icon={<Shield className="w-12 h-12 text-blue-600" />}
            title="Sécurité au Travail"
            description="Protection des droits des travailleurs et maintien d'un environnement de travail sûr."
          />
          <ServiceCard 
            icon={<FileText className="w-12 h-12 text-blue-600" />}
            title="Conseil"
            description="Accompagnement et orientation pour les employeurs et les employés sur leurs droits et obligations."
          />
        </div>
      </section>

      {/* Missions Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Missions</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <MissionCard 
            image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80"
            title="Protection des Travailleurs"
            description="Garantir les droits fondamentaux des travailleurs, assurer leur sécurité et veiller à leur bien-être dans l'environnement professionnel."
          />
          <MissionCard 
            image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
            title="Médiation et Résolution"
            description="Faciliter le dialogue social et la résolution des conflits entre employeurs et employés pour maintenir un climat de travail harmonieux."
          />
          <MissionCard 
            image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80"
            title="Formation et Sensibilisation"
            description="Organiser des sessions de formation et de sensibilisation sur les normes du travail, la sécurité professionnelle et les bonnes pratiques."
          />
          <MissionCard 
            image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
            title="Conseil et Accompagnement"
            description="Fournir une expertise approfondie sur la législation du travail et accompagner les entreprises dans la mise en conformité de leurs pratiques."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">À Propos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Notre Mission</a></li>
              <li><a href="#" className="hover:text-blue-400">Histoire</a></li>
              <li><a href="#" className="hover:text-blue-400">Équipe</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Dépôt de Plainte</a></li>
              <li><a href="#" className="hover:text-blue-400">Suivi de Plainte</a></li>
              <li><a href="#" className="hover:text-blue-400">Consultation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400">Guides</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>contact@inspection.gov</li>
              <li>+243 000 000 000</li>
              <li>123 Avenue Example, Ville</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 Inspection Générale du Travail. Tous droits réservés.</p>
        </div>
      </footer>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}