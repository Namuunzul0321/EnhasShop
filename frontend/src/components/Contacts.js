"use client";

import { Header } from "./Header";

export const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Холбоо барих
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Манай Хаяг</h2>
            <p className="text-gray-600">Улаанбаатар, Монгол улс</p>
            <p className="text-gray-600">
              Утас:{" "}
              <a
                href="tel:+97699112233"
                className="text-green-600 hover:underline"
              >
                +976 9911 2233
              </a>
            </p>
            <p className="text-gray-600">
              И-мэйл:{" "}
              <a
                href="mailto:info@example.com"
                className="text-green-600 hover:underline"
              >
                info@example.com
              </a>
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Мессеж илгээх
            </h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Таны нэр"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                placeholder="Таны и-мэйл"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                placeholder="Мессеж бичих"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Илгээх
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4">
        &copy; 2025 Таны Компани. Бүх эрх хуулиар хамгаалагдсан.
      </footer>
    </div>
  );
};
