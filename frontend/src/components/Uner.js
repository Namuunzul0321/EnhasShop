"use client";

const sShops = [
  { id: 1, img: "/chocolate.png", storeName: "Chocolate" },
  { id: 2, img: "/forest.png", storeName: "Forest" },
  { id: 3, img: "/lavender.png", storeName: "Lavender" },
  { id: 4, img: "/lemon.png", storeName: "Lemon" },
  { id: 5, img: "/coffee.png", storeName: "Coffee" },
  { id: 6, img: "/strawberry.png", storeName: "Strawberry" },
  { id: 7, img: "/vanilla.png", storeName: "Vanilla" },
];

export const Uner = () => {
  return (
    <section className="w-full flex justify-center ">
      <div className="max-w-[1575px] w-full px-4">
        {/* Гарчиг */}
        <h2 className="font-extrabold text-[26px] sm:text-[30px] lg:text-[36px] mb-8 text-center sm:text-left ">
          Үнэрний сонголт
        </h2>

        {/* Картууд */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {sShops.map(({ id, img, storeName }) => (
            <div
              key={id}
              className=" w-[140px] sm:w-[160px] lg:w-[184px] flex flex-col items-center py-3 sm:py-4 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
            >
              {/* Зураг */}
              <div className=" w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[136px] lg:h-[136px] rounded-full overflow-hidden bg-gradient-to-tr from-green-200 via-green-300 to-indigo-200 p-[4px] sm:p-[5px] lg:p-[6px] flex items-center justify-center ">
                <img
                  src={img}
                  alt={storeName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Нэр */}
              <p className="mt-3 text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-center">
                {storeName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
