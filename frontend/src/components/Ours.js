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
              src="/logo1.png"
              alt="Манай баг"
              className="rounded-xl shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <p className="text-gray-700 text-base sm:text-lg">
              Манай гэр бүлийн бизнес нь өдөр тутмын хэрэглээнд тохирсон,
              органик, чанартай бүтээгдэхүүн үйлдвэрлэж, хэрэглэгчдэдээ хүргэхэд
              зориулагдсан. Бид өөрсдийн гараар бүтээсэн бүтээгдэхүүн бүрийг
              хайр шингээн бэлтгэдэг.
            </p>

            <p className="text-gray-700 text-base sm:text-lg">
              Бидний үнэт зүйлс:
              <span className="font-semibold text-green-600">
                {" "}
                чанар, итгэлцэл, сэтгэл ханамж{" "}
              </span>
              юм. Эдгээр зарчмыг баримталж ажилласнаар хэрэглэгчид маань
              найдвартай, сэтгэл ханамжтай үйлчилгээ авдаг.
            </p>

            <p className="text-gray-700 text-base sm:text-lg">
              Бүтээгдэхүүнээ захиалснаас хойш{" "}
              <span className="font-semibold">48 цагийн дотор </span>
              хүргэлт хийгдэнэ.
              <br /> Хүргэлтийн үнэ <span className="font-semibold">
                ₮5000
              </span>{" "}
              . <br /> Та бидэнтэй холбогдож, бүтээгдэхүүн болон үйлчилгээний
              талаар илүү дэлгэрэнгүй мэдээлэл авах боломжтой.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 mt-10">
        &copy; 2025
      </footer>
    </div>
  );
};
