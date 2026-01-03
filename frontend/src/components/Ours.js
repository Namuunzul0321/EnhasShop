"use client";

import { Header } from "./Header";

export const Ours = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Бидний тухай
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image / Illustration */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/team.jpg" // Та хүссэн зурагны path-г оруулна
              alt="Манай баг"
              className="rounded-xl shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <p className="text-gray-700 text-base sm:text-lg">
              Манай компани нь хэрэглэгчдэд хамгийн чанартай бүтээгдэхүүн,
              үйлчилгээ үзүүлэхийг зорьдог. Бидний баг нь туршлагатай, чадварлаг
              мэргэжилтнүүдээс бүрддэг бөгөөд таны хэрэгцээнд нийцсэн
              шийдлүүдийг санал болгодог.
            </p>
            <p className="text-gray-700 text-base sm:text-lg">
              Бидний гол үнэт зүйлс:
              <span className="font-semibold text-green-600">
                {" "}
                чанар, итгэлцэл, инноваци
              </span>
              . Эдгээр зарчмыг баримталж ажиллах нь хэрэглэгчдийн итгэлийг
              хүлээх гол түлхүүр юм.
            </p>
            <p className="text-gray-700 text-base sm:text-lg">
              Та бидэнтэй холбогдож, манай түүх болон зорилго, бүтээгдэхүүн
              үйлчилгээг илүү дэлгэрэнгүй мэдэх боломжтой.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 mt-10">
        &copy; 2025 Таны Компани. Бүх эрх хуулиар хамгаалагдсан.
      </footer>
    </div>
  );
};
