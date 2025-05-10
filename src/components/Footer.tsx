import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="bg-white py-16">
        <div className="max-w-[850px] mx-auto px-4 text-center">
          <h2 className="font-gloock font-normal mb-6 leading-[1.4]">
            Hej, det är vi som är<br />Tres AImigos!
          </h2>
          <p className="text-xl mb-12">
            Vi är världens första AI Content Engineers, examinerade från Berghs SOC. 
            Med vår unika kompetens hjälper vi företag att komma igång med AI på ett 
            enkelt och konkret sätt.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="https://www.linkedin.com/company/tres-aimigos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://www.instagram.com/tresaimigos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-beach-yellow py-8">
        <div className="max-w-[850px] mx-auto px-4 text-center">
          <img 
            src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/3AImigos_logo_hand.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZkNTI0NzJhLTk5YzgtNDQ2Yy05ZTM3LTczMTVkYjJjYzQ4MiJ9.eyJ1cmwiOiJpbWFnZS8zQUltaWdvc19sb2dvX2hhbmQucG5nIiwiaWF0IjoxNzQ2NTU4NTE2LCJleHAiOjE3NzgwOTQ1MTZ9.KPMF6SXJR_5Jon9Kps4S59PyWn6hJyRP8o0cDcMmIeI"
            alt="3AImigos Logo - Hand with three fingers"
            className="w-16 h-16 mx-auto hover:scale-110 transition-transform duration-300"
          />
          <h3 className="font-display text-base font-bold mt-4">Tres AImigos</h3><br></br>
          lostresAImigos@gmail.com
        </div>
      </div>
    </footer>
  );
};

export default Footer;