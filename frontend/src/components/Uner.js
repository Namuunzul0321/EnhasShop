"use client";

const sShops = [
  { id: 1, img: "/chocolate.png", storeName: "chocolate" },
  { id: 2, img: "/forest.png", storeName: "forest" },
  { id: 3, img: "/lavender.png", storeName: "lavender" },
  { id: 4, img: "/lemon.png", storeName: "lemon" },
  { id: 5, img: "/coffee.png", storeName: "coffee" },
  { id: 6, img: "/strawberry.png", storeName: "strawberry" },
  { id: 7, img: "/vanilla.png", storeName: "vanilla" },
];

export const Uner = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[1575px] w-full px-4">
        {/* Гарчиг */}
        <h2 className="font-bold text-[24px] sm:text-[28px] lg:text-[32px] mb-6 text-center sm:text-left">
          Үнэрний сонголт
        </h2>

        {/* Картууд */}
        <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
          {sShops.map(({ id, img, storeName }) => (
            <div
              key={id}
              className=" w-[140px] sm:w-[160px] lg:w-[184px] rounded-[12px] hover:shadow-lg transition cursor-pointer flex flex-col items-center py-3 sm:py-4"
            >
              {/* Зураг */}
              <div className=" w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[136px] lg:h-[136px] rounded-full overflow-hidden bg-[#f9f9f9]">
                <img
                  src={img}
                  alt={storeName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Нэр */}
              <p className=" mt-3 text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-center">
                {storeName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
