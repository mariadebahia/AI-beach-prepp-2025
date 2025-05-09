import React, { useState } from 'react';
import Button from '../components/Button';
import AnimatedHeader from '../components/AnimatedHeader';
import { Trophy } from 'lucide-react';
import type { FormData } from '../types';

const CompetitionSection: React.FC = () => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        motivation: '',
        gdprConsent: false
      });
      
      // In a real application, you would send this data to your backend
      console.log('Form submitted:', formData);
    }, 1500);
  };
  
  return (
    <section className="py-20 px-4 bg-blue-50" id="competition-section">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="text-yellow-500 mr-3" size={32} />
          <AnimatedHeader
            text="Vinn AI-träning för ditt företag"
            className="text-3xl md:text-4xl font-bold text-center"
          />
        </div>
        
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
          Tävla om en personlig AI-träningssession för dig och ditt team. Vi hjälper er att 
          hitta de bästa sätten att implementera AI i just er verksamhet.
        </p>
        
        {isSubmitted ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Tack för din anmälan!</h3>
            <p className="text-gray-700 mb-6">
              Vi har mottagit din intresseanmälan och kommer att kontakta dig om ni väljs ut som vinnare.
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Kontaktperson *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                Motivera varför just ert företag borde vinna *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-8">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="gdprConsent"
                  name="gdprConsent"
                  checked={formData.gdprConsent}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="gdprConsent" className="ml-2 block text-sm text-gray-700">
                  Jag godkänner att mina uppgifter sparas enligt <a href="#" className="text-blue-600 underline">integritetspolicyn</a> *
                </label>
              </div>
            </div>
            
            <div className="text-center">
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? 'Skickar in...' : 'Anmäl till tävlingen'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CompetitionSection;