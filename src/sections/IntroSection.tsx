import React, { useState } from 'react';
import Button from '../components/Button';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/abhs8xzl3ssmsqjeglpldt8aj84hihfo';

const IntroSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const submission = {
      company_name: formData.get('company_name'),
      contact_name: formData.get('contact_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      motivation: formData.get('motivation'),
      gdpr: formData.get('gdpr') === 'on'
    };

    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to Make.com');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('Det gick inte att skicka formuläret. Försök igen senare.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 px-8 bg-[#fbf9f9]" id="intro-section">
      <div className="max-w-[850px] mx-auto text-center">
        <h2 className="mb-4 h2-quiz-outline">
          Har ni AI-FOMO på jobbet?<break></break>
          Lungt, vi får er att komma igång!
        </h2>
        
        <h5 className="text-[2rem] leading-[1.2] mb-16 max-w-[850px] mx-auto">
          Alla snackar AI men hur kommer man igång på jobbet?! Vi hjälper er med den första milen. Vi kommer till din arbetsplats och AI-boostar med grunden, verktyg och tips för att komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr management konsult skulle nog kalla det för "get-AI-ready-or-die".
        </h5>

        {isSubmitted ? (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-4xl font-bold text-green-600 mb-6">Tack – ni är med i AI Beach Prep! 🏋️</h3>
            <p className="text-2xl text-gray-700 mb-8">
              Vi har registrerat er anmälan och hör snart av oss om ni går vidare till nästa steg. Redan nu kan ni börja AI-värma upp med vår guide!
            </p>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Testa din AI-Fitness nu
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm">
            <div className="mb-6">
              <label htmlFor="company_name" className="block text-left text-lg font-medium text-gray-900 mb-2">
                Företagsnamn *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                placeholder="Ditt företag"
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="contact_name" className="block text-left text-lg font-medium text-gray-900 mb-2">
                Kontaktperson (Namn) *
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                placeholder="Förnamn Efternamn"
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-left text-lg font-medium text-gray-900 mb-2">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="din@email.se"
                  required
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-left text-lg font-medium text-gray-900 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="070-123 45 67"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="motivation" className="block text-left text-lg font-medium text-gray-900 mb-2">
                Motivering *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                placeholder="Berätta för oss varför just ditt företag skulle gynnas av AI-träning"
                required
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="gdpr"
                  name="gdpr"
                  required
                  className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="gdpr" className="text-left text-base text-gray-700">
                  Jag godkänner att mina uppgifter sparas enligt <a href="#" className="underline">integritetspolicyn</a> *
                </label>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="text-center">
              <Button 
                type="submit" 
                variant="purple" 
                disabled={isSubmitting}
                className="w-full md:w-auto bg-black text-white text-xl py-6 px-12"
              >
                {isSubmitting ? 'Skickar...' : 'Vi behöver AI Beach Prepp!!'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default IntroSection;