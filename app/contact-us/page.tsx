'use client';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
import React, { useState } from 'react';

// Blue Contact Form Component
const ContactFormBlue: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative bg-blue-700 min-h-[500px] h-[60vh] py-16 px-4 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-32 w-40 h-40 rounded-full border-2 border-blue-500 opacity-30"></div>
      <div className="absolute bottom-32 left-16 w-32 h-32 rounded-full border-2 border-blue-500 opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full border-2 border-blue-500 opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full border-2 border-blue-400 opacity-25"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center w-full h-full justify-center gap-8 relative z-10">


<div 
  className="w-full lg:w-[40%] rounded-3xl p-6 shadow-2xl"
  style={{
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  }}
>
  <h2 className="text-white text-2xl font-bold mb-3">
    Get in touch
  </h2>
  
  <div className="space-y-3">
    <div>
      <label className="text-white text-xs mb-1 block font-medium">
        Your name
      </label>
      <input
        type="text"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
      />
    </div>

    <div>
      <label className="text-white text-xs mb-1 block font-medium">
        Your email
      </label>
      <input
        type="email"
        name="email"
        placeholder="yourmail@email.com"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
      />
    </div>

    <div>
      <label className="text-white text-xs mb-1 block font-medium">
        How can we help?
      </label>
      <textarea
        name="message"
        placeholder="Enter your message here"
        value={formData.message}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 resize-none"
      />
    </div>

    <button
      onClick={handleSubmit}
      className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-full transition-colors duration-200 shadow-lg"
    >
      Send my message
    </button>
  </div>
</div>


        <div className="hidden lg:block w-8"></div>

        <div className="hidden lg:block w-full lg:w-[50%] relative">


<div
  className="bg-white rounded-3xl shadow-2xl w-[420px] h-[420px] ml-auto bg-cover bg-center bg-no-repeat relative"
  style={{
    backgroundImage:
      "url('/contact_us.jpeg')"
  }}
>
  <div className="absolute -right-[-90%] top-20 z-50">
            <div className="bg-white rounded-full px-6 py-3 shadow-xl inline-block">
              <span className="text-blue-700 font-bold text-base whitespace-nowrap">Drop us a line</span>
            </div>

<svg
  width="200"
  height="300"
  viewBox="0 0 250 178"
  fill="#0A21C0"
  xmlns="http://www.w3.org/2000/svg"
  className="absolute -left-18 text-blue-700 w-[15vw] xl:w-[250px] -top-[110%] xl:-top-[100%] xl:-left-40  z-30">
<path d="M198.717 102.539C220.139 98.2283 233.25 83.9529 243.688 69.8763C244.065 69.3677 243.127 69.1071 242.682 69.6189C233.264 80.4674 222.718 92.794 206.089 98.0059C190.299 102.954 174.394 100.965 162.145 97.8281C160.442 97.3928 158.79 96.8997 157.167 96.3769C161.012 90.6513 163.857 84.7421 165.511 78.8996C168.637 67.8488 167.556 57.2713 161.346 49.2771C156.066 42.4809 144.542 36.2616 130.21 44.2211C114.055 53.1929 114.397 66.7701 119.422 75.1602C125.275 84.9324 135.391 92.6192 147.979 97.5812C148.577 97.8166 149.196 98.0436 149.812 98.272C140.295 111.037 125.282 122.527 107.168 129.174C80.4177 138.988 52.5914 137.433 37.9569 125.732C44.248 125.453 51.1014 123.638 57.6339 120.253C58.8566 119.62 58.8066 118.097 57.2894 118.628C46.2927 122.48 36.0504 122.761 28.535 119.033C26.6489 118.097 23.1691 120.204 23.1646 122.004C23.1407 130.485 23.0723 138.998 23.3698 147.393C23.4688 150.203 29.6979 148.573 29.7467 145.725C29.8554 139.359 29.7613 133.035 29.6329 126.725C43.4075 142.194 75.7069 144.685 106.027 134.215C126.677 127.084 143.82 114.262 154.653 99.9078C167.217 103.795 182.717 105.758 198.717 102.539ZM133.194 83.0307C125.733 76.2088 114.958 63.8443 126.981 51.6784C141.216 37.2719 154.935 49.3862 158.527 56.9798C162.005 64.3339 161.724 73.2775 158.509 82.3809C157.057 86.4879 154.979 90.6105 152.349 94.6436C144.892 91.6983 138.41 87.7987 133.194 83.0307Z" fill="#0A21C0"/>
<path d="M169.129 89.2666C176.725 72.845 179.207 55.868 169.118 44.2743C163.315 37.6059 143.257 26.2874 128.446 39.018C128.207 39.2237 128.53 39.4191 128.792 39.2284C138.684 32.0395 150.54 34.6876 157.484 37.8854C164.049 40.908 168.68 45.6258 171.289 51.2254C176.419 62.2357 173.259 75.9805 167.11 89.4248C166.655 90.4174 168.675 90.2489 169.129 89.2666Z" fill="#0A21C0"/>
<path d="M153.771 108.288C154.088 107.913 153.533 107.65 153.161 108.037C140.998 120.687 125.501 131.774 107.49 139.324C97.838 143.37 87.2 146.666 77.5055 147.521C68.0096 148.36 59.9453 146.721 51.6873 145.422C50.5251 145.239 49.5555 146.722 50.6642 146.944C67.9508 150.405 84.8631 149.789 105.633 141.479C124.663 133.866 142.096 122.062 153.771 108.288Z" fill="#0A21C0"/>
<path d="M44.4322 145.06C44.4851 145.024 44.5418 144.997 44.5939 144.959C45.3979 144.366 46.0936 143.541 46.1959 142.825C46.3073 142.055 45.067 141.907 44.119 142.142C43.9195 142.192 43.7334 142.255 43.5591 142.325C43.2926 142.211 42.9718 142.153 42.6217 142.172C40.6797 142.274 39.5235 144.067 39.953 145.095C40.4109 146.194 42.1596 146.23 43.7206 145.473C44.0352 145.404 44.2852 145.25 44.4322 145.06ZM41.8482 143.3C42.0032 143.207 42.1706 143.161 42.338 143.134C41.8288 143.681 41.6589 144.314 41.8599 144.794C41.2926 144.599 41.079 143.762 41.8482 143.3Z" fill="#0A21C0"/>
</svg>




          </div>

</div>


        </div>
      </div>
    </div>
  );
};

// White Contact Info Component
const ContactInfoWhite: React.FC = () => {
  const contactDetails = [
    {
      icon: '📧',
      label: 'Email',
      value: 'yourcompany@email.com'
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '+1 (123) 456-7893'
    },
    {
      icon: '📠',
      label: 'Fax',
      value: '(123) 456-6782'
    },
    {
      icon: '📍',
      label: 'Address',
      value: 'US'
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-gray-700 text-2xl font-semibold text-center mb-10">
          Get in touch anytime
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactDetails.map((detail, index) => (
            <div key={index} className="text-center">
              <p className="text-gray-500 text-sm font-medium mb-3">{detail.label}</p>
              <div className="flex items-center justify-center gap-2 text-gray-800">
                <span className="text-xl">{detail.icon}</span>
                <span className="text-sm font-medium">{detail.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component combining both
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <ContactFormBlue />
      <ContactInfoWhite />
      {/* <Footer /> */}
    </div>
  );

}

