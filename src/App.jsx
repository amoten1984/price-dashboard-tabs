import React from "react";
import TabLayout from "./TabLayout";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-white to-gray-50 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight">
            Instantly Share Product Pricing
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-600">
            A sleek, mobile-friendly live pricing dashboard connected to Google Sheets.
          </p>
          <div className="mt-6">
            <a
              href="#dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Dashboard */}
      <section id="dashboard" className="py-8 sm:py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <TabLayout />
        </div>
      </section>
    </div>
  );
}
