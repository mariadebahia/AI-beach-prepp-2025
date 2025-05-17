import React, { useState } from 'react';
import Button from './Button';
import type { FormData } from '../types';

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        motivation: '',
        gdprConsent: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-green-600 mb-4">Tack för din anmälan!</h3>
        <p className="text-gray-700 mb-6">
          Vi har mottagit din intresseanmälan och återkommer inom kort.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="companyName"
          placeholder="Företagsnamn *"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="contactName"
          placeholder="Kontaktperson (Namn) *"
          value={formData.contactName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="email"
          name="email"
          placeholder="E-post *"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefon *"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      <textarea
        name="motivation"
        placeholder="Berätta för oss varför just ditt företag skulle gynnas av en AI-träning *"
        value={formData.motivation}
        onChange={handleChange}
        required
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      
      <div className="flex items-start">
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={formData.gdprConsent}
          onChange={handleChange}
          required
          className="mt-1 h-4 w-4 text-beach-purple border-gray-300 rounded"
        />
        <label htmlFor="gdprConsent" className="ml-2 text-sm text-gray-700 text-left">
          Jag godkänner att mina uppgifter sparas enligt <a href="#" className="text-beach-purple underline">integritetspolicyn</a> *
        </label>
      </div>
      
      <Button
        type="submit"
        variant="purple"
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Skickar...' : 'Vi behöver AI Beach Prepp!!'}
      </Button>
    </form>
  );
};

export default FormCompetition;