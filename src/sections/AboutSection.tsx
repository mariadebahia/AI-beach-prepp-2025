import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { Users, Linkedin, Globe } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-[#fffcf7]" id="about-section">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Users className="text-blue-600 mr-3" size={32} />
          <AnimatedHeader
            text="Tres Almigos - Dina AI-PTs"
            className="text-3xl md:text-4xl font-bold text-center"
          />
        </div>
        
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-16">
          Vi är världens första AI Content Engineers, examinerade från Berghs SOC. 
          Med vår unika kompetens hjälper vi företag att komma igång med AI på ett 
          enkelt och konkret sätt.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Maria Zerihoun */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <div className="w-full h-full bg-gray-200" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#d8d355]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Maria Zerihoun</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <Linkedin size={24} />
              </a>
              <a href="https://portfolio.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>

          {/* Noah Dagger */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <div className="w-full h-full bg-gray-200" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#d8d355]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Noah Dagger</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <Linkedin size={24} />
              </a>
              <a href="https://portfolio.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>

          {/* Ellino Aaby Olsson */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <div className="w-full h-full bg-gray-200" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#d8d355]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ellino Aaby Olsson</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <Linkedin size={24} />
              </a>
              <a href="https://portfolio.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;