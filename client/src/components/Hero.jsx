import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Build Your Dream PC With the Best Parts
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 mb-6">
          Discover powerful CPUs, GPUs, RAM, and more – all in one place.
        </p>
        <Link
          to="/"
          className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-full shadow hover:bg-blue-100 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default Hero;
