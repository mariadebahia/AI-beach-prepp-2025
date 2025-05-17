import React, { useState } from 'react';
import Button from './Button';
import type { FormData } from '../types';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const FormCompetition: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    motivation: '',
    gdprConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: submitError } = await supabase
        .from('submissions')
        .insert([{
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          motivation: formData.motivation
        }]);

      if (submitError) throw submitError;
      
      setIsSubmitted(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        motivation: '',
        gdprConsent: false
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Det gick tyvärr inte att skicka formuläret. Försök igen senare.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-beach-purple mb-4">Tack för din anmälan!</h3>
        <p className="text-lg mb-6">
          Vi har mottagit din intresseanmälan och återkommer inom kort om ni blir utvalda.
          Under tiden kan du testa er AI-nivå!
        </p>
        <a 
          href="#quiz-section"
          className="inline-block bg-beach-purple text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Testa er AI-nivå
        </a>
      </div>
    );
  }
  
  const inputClasses = "w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-beach-purple focus:border-beach-purple placeholder-gray-400 transition-all duration-200";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Företagsnamn *"
            value={formData.companyName}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-label="Företagsnamn"
          />
        </div>
        
        <div>
          <input
            type="text"
            id="contactName"
            name="contactName"
            placeholder="Kontaktperson (Namn) *"
            value={formData.contactName}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-label="Kontaktperson"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-post *"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-label="E-post"
          />
        </div>
        
        <div>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Telefon *"
            value={formData.phone}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-label="Telefon"
          />
        </div>
      </div>
      
      <div>
        <textarea
          id="motivation"
          name="motivation"
          placeholder="Berätta för oss varför just ditt företag skulle gynnas av en AI-träning *"
          value={formData.motivation}
          onChange={handleChange}
          required
          rows={4}
          className={inputClasses}
          aria-label="Motivation"
        />
      </div>
      
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={formData.gdprConsent}
          onChange={handleChange}
          required
          className="mt-1.5 h-4 w-4 text-beach-purple border-gray-300 rounded focus:ring-beach-purple"
          aria-label="GDPR samtycke"
        />
        <label htmlFor="gdprConsent" className="text-sm text-gray-700">
          Jag godkänner att mina uppgifter sparas enligt <a href="#" className="text-beach-purple underline hover:text-opacity-80 transition-colors">integritetspolicyn</a> *
        </label>
      </div>
      
      <div className="text-center">
        <Button
          type="submit"
          variant="purple"
          className="w-full md:w-auto bg-beach-purple hover:bg-opacity-90 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Skickar...
            </span>
          ) : (
            'Vi behöver AI Beach Prepp!!'
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCompetition;