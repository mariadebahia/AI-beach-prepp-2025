import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { Users } from 'lucide-react';

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-64 bg-gray-200 relative">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Team Member 1" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Alex Svensson</h3>
              <p className="text-blue-600 font-medium mb-4">AI Strategy Expert</p>
              <p className="text-gray-700">
                Specialiserad på att skapa AI-strategier som är enkla att implementera 
                och ger snabba, konkreta resultat.
              </p>
            </div>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-64 bg-gray-200 relative">
              <img 
                src="https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Team Member 2" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Mia Lindgren</h3>
              <p className="text-blue-600 font-medium mb-4">AI Implementation Coach</p>
              <p className="text-gray-700">
                Hjälper företag att konkret implementera AI i vardagen och skapa 
                nya arbetssätt som höjer effektiviteten.
              </p>
            </div>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-64 bg-gray-200 relative">
              <img 
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Team Member 3" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Johan Berglund</h3>
              <p className="text-blue-600 font-medium mb-4">AI Training Specialist</p>
              <p className="text-gray-700">
                Expert på att utbilda team i AI på ett pedagogiskt och inspirerande sätt,
                utan krångel eller teknisk jargong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;