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
      <div className="text-center">
        <h3 className="text-2xl font-bold text-green-600 mb-4">Tack för din anmälan!</h3>
        <p className="text-gray-700 mb-6">
          Vi har mottagit din intresseanmälan och återkommer inom kort.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Företagsnamn *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beach-purple focus:border-beach-purple"
          />
        </div>
        
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
            Kontaktperson (Namn) *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beach-purple focus:border-beach-purple"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-post *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beach-purple focus:border-beach-purple"
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
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beach-purple focus:border-beach-purple"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
          Berätta för oss varför just ditt företag skulle gynnas av en AI-träning *
        </label>
        <textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beach-purple focus:border-beach-purple"
        />
      </div>
      
      <div className="flex items-start">
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={formData.gdprConsent}
          onChange={handleChange}
          required
          className="mt-1 h-4 w-4 text-beach-purple border-gray-300 rounded focus:ring-beach-purple"
        />
        <label htmlFor="gdprConsent" className="ml-2 text-sm text-gray-700">
          Jag godkänner att mina uppgifter sparas enligt <a href="#" className="text-beach-purple underline">integritetspolicyn</a> *
        </label>
      </div>
      
      <div className="text-center">
        <Button
          type="submit"
          variant="purple"
          className="w-full md:w-auto bg-beach-purple hover:bg-opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Skickar...' : 'Vi behöver AI Beach Prepp!!'}
        </Button>
      </div>
    </form>
  );
};

export default FormCompetition;