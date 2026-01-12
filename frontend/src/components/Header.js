"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Header = () => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const admin = localStorage.getItem("isAdmin") === "true";

    setIsLoggedIn(!!email);
    setIsAdmin(admin);

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-90 bg-white dark:bg-gray-900 shadow-md border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* TOP BAR */}
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/home" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" width={120} height={40} />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 font-medium text-gray-700 dark:text-gray-200">
            <NavLink href="/home">Нүүр</NavLink>
            <NavLink href="/our">Бидний тухай</NavLink>
            <NavLink href="/contact">Холбоо барих</NavLink>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Toggle Theme"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>

            {/* CART */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/userOrders"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Захиалгууд
            </Link>

            {/* ADMIN BUTTONS */}
            {isAdmin && (
              <>
                <button
                  onClick={() => router.push("/addProduct")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  + Product
                </button>
                <button
                  onClick={() => router.push("/adminOrders")}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Нийт захиалгууд
                </button>
              </>
            )}

            {/* USER DROPDOWN */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  👤 Профайл
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded shadow-lg py-2 flex flex-col">
                    <Link
                      href="/profile"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Профайл
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Нэвтрэх
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-800 p-4 space-y-4 flex flex-col">
            <NavLink mobile href="/home">
              Нүүр
            </NavLink>
            <NavLink mobile href="/our">
              Бидний тухай
            </NavLink>
            <NavLink mobile href="/contact">
              Холбоо барих
            </NavLink>

            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className="flex-1 py-2 rounded bg-gray-200 dark:bg-gray-700 text-center"
              >
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </button>
              <Link
                href="/cart"
                className="flex-1 py-2 rounded bg-gray-200 dark:bg-gray-700 text-center"
              >
                🛒 Сагс ({cartCount})
              </Link>
            </div>

            {isAdmin && (
              <>
                <button
                  onClick={() => router.push("/addProduct")}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Product нэмэх
                </button>
                <button
                  onClick={() => router.push("/adminOrders")}
                  className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Захиалгууд
                </button>
              </>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded text-left flex justify-center items-center"
                >
                  👤 Профайл
                </button>
                {dropdownOpen && (
                  <div className="mt-2 bg-white dark:bg-gray-800 rounded shadow-lg flex flex-col">
                    <Link
                      href="/profile"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Профайл
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="w-full p-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-center"
              >
                Нэвтрэх
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, children, mobile }) => (
  <Link
    href={href}
    className={
      mobile
        ? "block w-full text-center py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        : "hover:text-green-500 transition"
    }
  >
    {children}
  </Link>
);
