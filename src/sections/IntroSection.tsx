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
        <h2 className="mb-4" style={{
          WebkitTextStroke: '2px black',
          textStroke: '2px black',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          Har ni AI-FOMO på jobbet?
        </h2>
        <h2 className="mb-8" style={{
          WebkitTextStroke: '2px black',
          textStroke: '2px black',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          Lungt, vi får er att komma igång!
        </h2>
        
        <h5 className="text-[2rem] leading-[1.2] mb-16 max-w-4xl mx-auto">
          Alla snackar AI men hur kommer man igång på jobbet?! Vi hjälper er med den första milen. Vi kommer till din arbetsplats och AI-boostar med grunden, verktyg och tips för att komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr management konsult skulle nog kalla det för "get-AI-ready-or-die".
        </h5>
        
        {/* Rest of the component remains unchanged */}
      </div>
    </section>
  );
};

export default IntroSection;