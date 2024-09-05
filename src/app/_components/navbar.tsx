"use client"
import Link from 'next/link'
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-500 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">HugArt</span>
        </Link>
        <div className="flex items-center md:order-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="bg-white text-blue-500 hover:bg-blue-100">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg md:hidden hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-blue-500 md:bg-blue-500">
            <li>
              <Link href="/" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 md:p-0">Home</Link>
            </li>
            <li>
              <Link href="/generate" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 md:p-0">Generate</Link>
            </li>
            <li>
              <Link href="/gallery" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 md:p-0">Gallery</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
