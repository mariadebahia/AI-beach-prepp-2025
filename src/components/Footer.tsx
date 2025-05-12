import React from 'react';
import { Linkedin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  // Using the same direct URL as in HeroSection
  const logoUrl = "https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/3AImigos_logo_hand.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZkNTI0NzJhLTk5YzgtNDQ2Yy05ZTM3LTczMTVkYjJjYzQ4MiJ9.eyJ1cmwiOiJpbWFnZS8zQUltaWdvc19sb2dvX2hhbmQucG5nIiwiaWF0IjoxNzQ2NTU4NTE2LCJleHAiOjE3NzgwOTQ1MTZ9.KPMF6SXJR_5Jon9Kps4S59PyWn6hJyRP8o0cDcMmIeI";

  // Using placeholder images from Pexels temporarily
  const mariaImageUrl = "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800";
  const noahImageUrl = "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800";
  const ellinoImageUrl = "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <footer>
      <div className="bg-white py-16">
        <div className="max-w-[860px] mx-auto px-4 text-center">
          <h2 className="font-['Bricolage_Grotesque'] text-[4rem] font-black mb-6 leading-[1.4]">
            Hej, det är vi som är<br />Tres AImigos!
          </h2>
          <p className="text-2xl mb-12">
            Vi är världens första AI Content Engineers, examinerade från Berghs SOC. 
            Med vår unika kompetens hjälper vi företag att komma igång med AI på ett 
            enkelt och konkret sätt.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Maria Zerihoun */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                  <div className="absolute inset-0 bg-deep-purple rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                  <img 
                    src={mariaImageUrl}
                    alt="Maria Zerihoun"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Maria Zerihoun</h3>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/mariazerihoun/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://www.aicontentengineers.se/maria-zerihoun/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>

            {/* Noah Dagger */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                  <div className="absolute inset-0 bg-deep-purple rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                  <img 
                    src={noahImageUrl}
                    alt="Noah Dagger"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Noah Dagger</h3>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/noah-dagger-b3b4b9168" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://www.aicontentengineers.se/noah-dagger/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>

            {/* Ellino Aaby Olsson */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                  <div className="absolute inset-0 bg-deep-purple rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                  <img 
                    src={ellinoImageUrl}
                    alt="Ellino Aaby Olsson"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Ellino Aaby Olsson</h3>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/ellino-aaby-olsson" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://www.aicontentengineers.se/ellinor-aaby-olsson/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-deep-purple transition-colors"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#ff6b6b] py-8">
        <div className="max-w-[860px] mx-auto px-4 text-center">
          <img 
            src={logoUrl}
            alt="3AImigos Logo - Hand with three fingers"
            className="w-16 h-16 mx-auto hover:scale-110 transition-transform duration-300"
          />
          <h3 className="font-gloock text-base font-bold mt-4">Tres AImigos</h3>
          <a href="mailto:lostresAImigos@gmail.com" className="font-gloock hover:text-gray-700 transition-colors">
            lostresAImigos@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;