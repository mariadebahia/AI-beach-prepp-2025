import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Check, Trophy, Rocket } from 'lucide-react';

const IntroSection: React.FC = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Snabbt',
      description: 'Få snabba insikter med ett kort quiz.'
    },
    {
      icon: Check,
      title: 'Enkelt',
      description: 'Enkel att använda för alla nivåer.'
    },
    {
      icon: Trophy,
      title: 'Robust',
      description: 'Detaljerade rekommendationer baserat på dina svar.'
    }
  ];

  return (
    <AnimatedSection>
      <div className="text-center px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-4">Välkommen till AI Beach Prepp</h1>
        <p className="text-lg text-gray-600 mb-8">
          Mät din AI-mognad med vårt snabba quiz och få skräddarsydda rekommendationer.
        </p>
        <Button onClick={() => window.location.hash = '#quiz'}>
          Starta Quiz
        </Button>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-center">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default IntroSection;
