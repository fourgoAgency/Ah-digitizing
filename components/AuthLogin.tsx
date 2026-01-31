"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthSlider() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen min-w-full">
      <div className="relative w-250 h-175 rounded-4xl overflow-hidden shadow-2xl">

        {/* FORMS */}
        <div className="absolute inset-0 flex">
          {/* SIGN IN */}
          <motion.div
            animate={{
              x: isSignup ? "100%" : "0%",
              opacity: isSignup ? 0 : 1
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-1/2 flex items-center justify-center"
          >
            <form className="w-3/4 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
              </div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Email"
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Password"
                type="password"
              />
              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                Sign In
              </button>
            </form>
          </motion.div>

          {/* SIGN UP */}
          <motion.div
            animate={{
              x: isSignup ? "0%" : "-100%",
              opacity: isSignup ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-1/2 flex items-center justify-center"
          >
            <form className="w-3/4 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-500 text-sm mt-2">Join us today</p>
              </div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Full Name"
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Email"
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Password"
                type="password"
              />
              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                Sign Up
              </button>
            </form>
          </motion.div>
        </div>

        {/* SLIDING OVERLAY */}
        <motion.div
          animate={{ x: isSignup ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full rounded-4xl bg-linear-to-br from-primary via-primary to-black text-white flex items-center justify-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, x: isSignup ? 0 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-center space-y-8 px-10"
          >
            <div className="text-center space-y-8 px-10 ">
              {isSignup ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
                    <div className="h-1 w-16 bg-white mx-auto rounded-full"></div>
                  </div>
                  <p className="text-white/80 text-lg">Already have an account? Sign in to continue</p>
                  <button
                    onClick={() => setIsSignup(false)}
                    className="border-2 border-white text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300"
                  >
                    Sign In
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-4xl font-bold mb-2">Hello, Friend</h2>
                    <div className="h-1 w-16 bg-white mx-auto rounded-full"></div>
                  </div>
                  <p className="text-white/80 text-lg">Start your journey with us today</p>
                  <button
                    onClick={() => setIsSignup(true)}
                    className="border-2 border-white text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300"
                  >
                    Sign Up
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
