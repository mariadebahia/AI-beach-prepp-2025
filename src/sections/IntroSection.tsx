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
      motivation: formData.get('motivation')
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
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-4 h2-quiz-outline">
          Har ni AI-FOMO på jobbet?
        </h2>
        <h2 className="mb-8 h2-quiz-outline">
          Lungt, vi får er att komma igång!
        </h2>
        
        <h5 className="text-[2rem] leading-[1.2] mb-16 max-w-4xl mx-auto">
          Alla snackar AI men hur kommer man igång på jobbet?! Vi hjälper er med den första milen. Vi kommer till din arbetsplats och AI-boostar med grunden, verktyg och tips för att komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr management konsult skulle nog kalla det för "get-AI-ready-or-die".
        </h5>

        {isSubmitted ? (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Tack för din anmälan!</h3>
            <p className="text-gray-700 mb-6">
              Vi har mottagit din intresseanmälan och återkommer inom kort.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Företagsnamn *
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Kontaktperson *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                Berätta kort om er AI-resa *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="text-center">
              <Button type="submit" variant="purple" disabled={isSubmitting}>
                {isSubmitting ? 'Skickar...' : 'Skicka intresseanmälan'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default IntroSection;