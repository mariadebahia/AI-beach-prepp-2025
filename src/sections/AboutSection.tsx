import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-32 px-8 bg-[#fffcf7]" id="about-section">
      <div className="max-w-[860px] mx-auto text-center">
        <h2 className="font-gloock font-normal mb-6 leading-[1.4]">
          Hej, det är vi som är<br />Tres AImigos!
        </h2>
        <p className="text-xl mb-12">
          Vi är världens första AI Content Engineers, examinerade från Berghs SOC. 
          Med vår unika kompetens hjälper vi företag att komma igång med AI på ett 
          enkelt och konkret sätt.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Maria Zerihoun */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/maria.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9tYXJpYS5qcGciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" 
                  alt="Maria Zerihoun"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Maria Zerihoun</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/maria-zerihoun" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/linkedin.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9saW5rZWRpbi5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="https://mariazerihoun.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/globe.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9nbG9iZS5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="Portfolio" className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Noah Dagger */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/noah.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9ub2FoLmpwZyIsImlhdCI6MTcwOTgyNTYwMCwiZXhwIjoxNzQxMzYxNjAwfQ.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" 
                  alt="Noah Dagger"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Noah Dagger</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/noah-dagger" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/linkedin.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9saW5rZWRpbi5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="https://noahdagger.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/globe.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9nbG9iZS5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="Portfolio" className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Ellino Aaby Olsson */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto relative">
                <div className="absolute inset-0 bg-[#d8d355] rounded-full" style={{ clipPath: 'circle(50% at 100% 100%)' }} />
                <img 
                  src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/ellino.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9lbGxpbm8uanBnIiwiaWF0IjoxNzA5ODI1NjAwLCJleHAiOjE3NDEzNjE2MDB9.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" 
                  alt="Ellino Aaby Olsson"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Ellino Aaby Olsson</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/ellino-aaby-olsson" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/linkedin.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9saW5rZWRpbi5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="https://ellinoaabyolsson.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/globe.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9nbG9iZS5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="Portfolio" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6">
          <a 
            href="https://www.linkedin.com/company/tres-aimigos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/linkedin.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9saW5rZWRpbi5wbmciLCJpYXQiOjE3MDk4MjU2MDAsImV4cCI6MTc0MTM2MTYwMH0.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="LinkedIn" className="w-8 h-8" />
          </a>
          <a 
            href="https://www.instagram.com/tresaimigos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <img src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/instagram.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9pbnN0YWdyYW0ucG5nIiwiaWF0IjoxNzA5ODI1NjAwLCJleHAiOjE3NDEzNjE2MDB9.vWoKqxfHWWn_4NYU8YeABXF_VUxh_-xW_h5ZhVYKTwE" alt="Instagram" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;