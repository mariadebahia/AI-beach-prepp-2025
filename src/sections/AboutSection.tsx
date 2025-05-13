import React from 'react';
import { Linkedin, Globe, Instagram } from 'lucide-react';

const AboutSection: React.FC = () => {
  // Using placeholder images from Pexels temporarily
  const mariaImageUrl = "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800";
  const noahImageUrl = "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800";
  const ellinoImageUrl = "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <section className="py-32 px-8 bg-[#fffcf7]" id="about-section">
      <div className="max-w-[860px] mx-auto text-center">
        <h2 className="font-gloock font-normal mb-6 leading-[1.4]">
          Hej, det är vi som är<br />Tres AImigos!
        </h2>
        <p className="text-xl mb-12">
          Vi är världens första AI Content Engineers, examinerade från Berghs SOC. 
          Med vår unika kompetens hjälper vi företag att komma igång med AI på ett 
          enkelt och konkret sätt.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Maria Zerihoun */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src={mariaImageUrl}
                  alt="Maria Zerihoun"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Maria Zerihoun</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/maria-zerihoun" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Linkedin size={24} />
              </a>
              <a href="https://www.aicontentengineers.se/maria-zerihoun/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>

          {/* Noah Dagger */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src={noahImageUrl}
                  alt="Noah Dagger"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Noah Dagger</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/noah-dagger" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Linkedin size={24} />
              </a>
              <a href="https://www.aicontentengineers.se/noah-dagger/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>

          {/* Ellino Aaby Olsson */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src={ellinoImageUrl}
                  alt="Ellino Aaby Olsson"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Ellino Aaby Olsson</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/ellino-aaby-olsson" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Linkedin size={24} />
              </a>
              <a href="https://www.aicontentengineers.se/ellinor-aaby-olsson/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Globe size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6">
          <a 
            href="https://www.linkedin.com/company/tres-aimigos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <Linkedin size={32} />
          </a>
          <a 
            href="https://www.instagram.com/tresaimigos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <Instagram size={32} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;