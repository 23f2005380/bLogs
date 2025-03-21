"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import SearchBar from "@/components/SearchBar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

export default function Header() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-800 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Panch Blog
        </Link>

        <div className="flex items-center space-x-4">
          <div className=" hidden md:block w-full md:w-auto">
            <SearchBar />
          </div>
          <ThemeSwitcher />

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-4">
          <ul className="flex flex-col md:flex-row md:space-x-4 items-center">
            <li className="list-none">
              <Link href="/" className="hover:text-gray-300 transition-colors duration-300">
                Home
              </Link>
            </li>
            <li className="list-none">
              <Link href="/categories" className="hover:text-gray-300 transition-colors duration-300">
                Categories
              </Link>
            </li>
            {user ? (
              <>
                <li className="list-none">
                  <Link href="/create" className="hover:text-gray-300 transition-colors duration-300">
                    Create Post
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/dashboard" className="hover:text-gray-300 transition-colors duration-300">
                    Dashboard
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/profile" className="hover:text-gray-300 transition-colors duration-300">
                    Profile
                  </Link>
                </li>
                <li className="list-none">
                  <button onClick={signOut} className="hover:text-gray-300 transition-colors duration-300">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="list-none">
                  <Link href="/signin" className="hover:text-gray-300 transition-colors duration-300">
                    Sign In
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/signup" className="hover:text-gray-300 transition-colors duration-300">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-90 z-50 flex flex-col items-center justify-center transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <nav className="flex flex-col items-center space-y-4">
          <ul className="flex flex-col items-center space-y-4">
            <li className="list-none">
              <Link href="/" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="list-none">
              <Link href="/categories" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
            </li>
            {user ? (
              <>
                <li className="list-none">
                  <Link href="/create" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    Create Post
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/dashboard" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/profile" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li className="list-none">
                  <button onClick={signOut} className="hover:text-gray-300 text-2xl transition-colors duration-300">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="list-none">
                  <Link href="/signin" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </li>
                <li className="list-none">
                  <Link href="/signup" className="hover:text-gray-300 text-2xl transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
