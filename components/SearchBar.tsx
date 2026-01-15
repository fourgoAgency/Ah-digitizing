"use client";
// This component is a simple search bar that filters a list of services based on user input.
import { useState } from 'react';
import styles from '@/styles/style.module.css'; // adjust path

const ServiceSearch = () => {
  const [query, setQuery] = useState('');
  
  const services = [
    "Web Development",
    "Graphic Design",
    "SEO Optimization",
    "Digital Marketing",
    "Content Writing",
    "App Development"
  ];

  const filteredServices = services.filter(service =>
    service.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="text-center px-4 z-10 max-w-4xl w-full relative">
    <h1 className="text-4xl font-bold text-white mb-8">
      Find Your Service
    </h1>
    
    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search services..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={`w-full px-6 py-4 backdrop-blur border text-teal-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${styles.glass}`}
    />
  
    {/* Search Results */}
    {query && (
      <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-20 p-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <div 
              key={index}
              className="text-gray-800 hover:bg-gray-200 p-2 rounded cursor-pointer transition"
            >
              {service}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No services found.</p>
        )}
      </div>
    )}
  </div>
  
  );
}
export default ServiceSearch;
