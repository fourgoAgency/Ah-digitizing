"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Label from "@/components/label";
import client from "@/lib/sanityClient";

const services = [
  {
    title: "Web Development & Designing",
    description:
      "Full-stack development with modern frameworks and responsive design implementation.",
  },
  {
    title: "Graphics Designing",
    description:
      "Professional branding, logo design, and marketing materials creation.",
  },
  {
    title: "Digital Marketing",
    description:
      "SEO, social media management, and targeted advertising campaigns.",
  },
  {
    title: "E-commerce Store Management",
    description:
      "Complete store setup, product management, and sales optimization.",
  },
];

export default function AppointmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsModalOpen(true);
    }
  };

  // ✅ Cleaned logic — no alerts
  const confirmSubmission = async () => {
    setIsModalOpen(false);
    try {
      // Step 1: Save appointment in Sanity
      const newAppointment = await client.create({
        _type: "appointment",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        service: selectedService,
      });

      // Only proceed if successfully created
      if (newAppointment?._id) {  
          setIsSuccess(true);
        // Step 2: Send email (optional failure won’t stop success modal)
        try {
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              service: selectedService,
            }),
          });
          const emailResult = await emailResponse.json();
          if (!emailResult.success) {
            console.error("Email sending failed:", emailResult.error);
          } else {
            console.log("Email sent successfully");
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }

// ✅ Step 3: WhatsApp message (after 5 seconds delay)
setTimeout(() => {
  const businessNumber = "923353123932";
  const whatsappMessage = `Hello! I am ${formData.name}, I have booked *${selectedService}* on *${formData.date}* at *${formData.time}*. Please confirm my appointment. My contact number is *${formData.phone}* and email is *${formData.email}*.`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${businessNumber}?text=${encodedMessage}`;
  window.open(whatsappURL, "_blank");
}, 5000);


      }
    } catch (error) {
      console.error("Error during appointment submission:", error);
    }
  };

  // ✅ Auto-reset after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setCurrentStep(0);
        setSelectedService(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <section className="w-full bg-white text-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-white to-gray-50"
      >
        <Label text="Appointment" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-teal-700">
          Book Your Appointment
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl sm:max-w-2xl leading-relaxed text-sm sm:text-base">
          Schedule your free consultation with FourGo and let’s turn your ideas
          into impactful digital solutions.
        </p>
      </motion.div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Confirm Appointment
            </h3>
            <div className="space-y-2 text-gray-600 text-sm">
              <p><span className="font-medium">Service:</span> {selectedService}</p>
              <p><span className="font-medium">Date:</span> {formData.date}</p>
              <p><span className="font-medium">Time:</span> {formData.time}</p>
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="flex-1 px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800">
                Appointment Confirmed!
              </h3>
              <p className="text-gray-600 mt-2 text-center max-w-sm">
                We’ve sent a confirmation email and WhatsApp message. We’ll be
                in touch soon!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="hidden lg:block flex-1"
          >
            <h2 className="text-4xl font-bold text-gray-700 mb-6">
              Why Choose FourGo?
            </h2>
            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Progress */}
              <div className="mb-8">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep + 1) * 33.33}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-gray-500">
                    Step {currentStep + 1} of 3
                  </span>
                  {selectedService && (
                    <span className="hidden md:flex text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1 rounded-full">
                      {selectedService}
                    </span>
                  )}
                </div>
              </div>

              {/* Steps */}
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                        Select Service
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleServiceSelect(service.title)
                            }
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedService === service.title
                                ? "border-teal-400 bg-teal-50"
                                : "border-gray-200 hover:border-teal-300"
                            }`}
                          >
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base truncate">
                              {service.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                        Select Date & Time
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="date"
                          name="date"
                          min={new Date(
                            Date.now() + 86400000
                          ).toISOString().split("T")[0]}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-0"
                          required
                        />
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-0"
                          required
                          min="11:00"
                          max="23:00"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                        Your Information
                      </h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-0"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-0"
                          required
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-0"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Button */}
                <button
                  type="submit"
                  disabled={
                    (currentStep === 0 && !selectedService) ||
                    (currentStep === 1 &&
                      (!formData.date || !formData.time)) ||
                    (currentStep === 2 &&
                      (!formData.name ||
                        !formData.email ||
                        !formData.phone))
                  }
                  className={`w-full mt-8 py-4 px-6 rounded-lg font-medium transition-colors ${
                    (currentStep === 0 && !selectedService) ||
                    (currentStep === 1 &&
                      (!formData.date || !formData.time)) ||
                    (currentStep === 2 &&
                      (!formData.name ||
                        !formData.email ||
                        !formData.phone))
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-teal-400 text-white hover:bg-teal-500"
                  }`}
                >
                  {currentStep === 2
                    ? "Confirm Appointment"
                    : "Continue"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

