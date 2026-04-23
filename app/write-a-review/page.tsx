"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, MessageSquare, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { countryOptions } from "@/lib/country-options";

const getCountryInitials = (name: string): string =>
  name
    .split(/[\s()-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toLowerCase();

const matchesCountryQuery = (country: { name: string; code: string }, normalizedQuery: string): boolean => {
  if (!normalizedQuery) return true;
  const name = country.name.toLowerCase();
  const code = country.code.toLowerCase();
  const initials = getCountryInitials(country.name);
  return name.startsWith(normalizedQuery) || code.startsWith(normalizedQuery) || initials.startsWith(normalizedQuery);
};

const findBestCountryMatch = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return undefined;

  const exactNameMatch = countryOptions.find((country) => country.name.toLowerCase() === normalized);
  if (exactNameMatch) return exactNameMatch;

  const exactCodeMatch = countryOptions.find((country) => country.code.toLowerCase() === normalized);
  if (exactCodeMatch) return exactCodeMatch;

  const exactInitialsMatch = countryOptions.find((country) => getCountryInitials(country.name) === normalized);
  if (exactInitialsMatch) return exactInitialsMatch;

  return countryOptions
    .filter((country) => matchesCountryQuery(country, normalized))
    .sort((a, b) => a.name.localeCompare(b.name))[0];
};

export default function WriteReviewPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    review: "",
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const countryWrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countryOptions.find((country) => country.code === formData.country);

  const filteredCountries = useMemo(() => {
    const normalized = countryQuery.trim().toLowerCase();
    if (!normalized) return countryOptions;
    return countryOptions
      .filter((country) => matchesCountryQuery(country, normalized))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countryQuery]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (countryWrapperRef.current && !countryWrapperRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!isCountryDropdownOpen) return;
    setHighlightedIndex(0);
  }, [isCountryDropdownOpen, countryQuery]);

  const selectCountry = (countryCode: string) => {
    const match = countryOptions.find((country) => country.code === countryCode);
    if (!match) return;
    setFormData({
      ...formData,
      country: match.code,
    });
    setCountryQuery(match.name);
    setIsCountryDropdownOpen(false);
  };

  const commitTypedCountry = () => {
    const normalizedQuery = countryQuery.trim();
    if (!normalizedQuery) {
      setFormData({
        ...formData,
        country: "",
      });
      setCountryQuery("");
      return;
    }

    const match = findBestCountryMatch(countryQuery);
    if (match) {
      setFormData({
        ...formData,
        country: match.code,
      });
      setCountryQuery(match.name);
    }
  };

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextQuery = e.target.value;
    setCountryQuery(nextQuery);
    setIsCountryDropdownOpen(true);

    if (formData.country) {
      const selectedName = selectedCountry?.name ?? "";
      if (nextQuery !== selectedName) {
        setFormData({
          ...formData,
          country: "",
        });
      }
    }
  };

  const handleSubmit = () => {
    console.log("Review submitted:", formData);
    // Yahan API call karni hai
    alert("Review submitted successfully!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: star * 0.1, duration: 0.3 }}
              >
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Share Your Experience
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We value your feedback! Help us improve and let others know about your experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Write A Review</h2>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  />
                </motion.div>

                {/* Country Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="relative"
                  ref={countryWrapperRef}
                >
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country
                  </label>
                  <div className="relative">
                    {selectedCountry && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <Image
                          src={selectedCountry.flagUrl}
                          alt={selectedCountry.name}
                          width={20}
                          height={14}
                          className="rounded-xs object-cover"
                        />
                      </span>
                    )}
                    <input
                      id="country-input"
                      type="text"
                      className={`input h-12 w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white ${selectedCountry ? 'pl-11' : 'pl-5'}`}
                      value={isCountryDropdownOpen ? countryQuery : (selectedCountry?.name ?? countryQuery)}
                      placeholder="Type country name"
                      onFocus={() => {
                        setCountryQuery(selectedCountry?.name ?? countryQuery);
                        setIsCountryDropdownOpen(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setIsCountryDropdownOpen(true);
                          setHighlightedIndex((prev) => {
                            const maxIndex = filteredCountries.length - 1;
                            if (maxIndex < 0) return 0;
                            return Math.min(prev + 1, maxIndex);
                          });
                          return;
                        }

                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setIsCountryDropdownOpen(true);
                          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                          return;
                        }

                        if (event.key === "Enter") {
                          event.preventDefault();
                          if (filteredCountries.length > 0) {
                            const highlightedCountry = filteredCountries[highlightedIndex] ?? filteredCountries[0];
                            if (highlightedCountry) {
                              selectCountry(highlightedCountry.code);
                              return;
                            }
                          }
                          commitTypedCountry();
                          return;
                        }

                        if (event.key === "Escape") {
                          setIsCountryDropdownOpen(false);
                        }
                      }}
                      onBlur={commitTypedCountry}
                      onChange={handleCountryInputChange}
                    />
                  </div>

                  <AnimatePresence>
                    {isCountryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg"
                      >
                        <ul className="max-h-64 overflow-y-auto py-1">
                          {filteredCountries.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-500">No countries found.</li>
                          )}
                          {filteredCountries.map((country) => (
                            <li key={country.code}>
                              <button
                                type="button"
                                className={`flex w-full items-center justify-between px-3 py-2 cursor-pointer text-left text-sm hover:bg-slate-100 ${
                                  filteredCountries[highlightedIndex]?.code === country.code ? "bg-slate-100" : ""
                                }`}
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => {
                                  const hoveredIndex = filteredCountries.findIndex((item) => item.code === country.code);
                                  if (hoveredIndex >= 0) setHighlightedIndex(hoveredIndex);
                                }}
                                onClick={() => selectCountry(country.code)}
                              >
                                <span className="inline-flex items-center gap-2">
                                  <Image
                                    src={country.flagUrl}
                                    alt={`${country.name} flag`}
                                    width={20}
                                    height={14}
                                    className="rounded-xs object-cover"
                                  />
                                  <span>{country.name}</span>
                                </span>
                                {formData.country === country.code && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Review Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Tell us about your experience..."
                    rows={6}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:shadow-xl"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Submit Review
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/write-a-review.jpeg"
                  alt="Happy customer"
                  width={600}
                  height={700}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                
                {/* Floating Review Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500">Excellent Service</span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">
                    "Amazing quality and fast turnaround! Highly recommend their digitizing services."
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">John D.</p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

