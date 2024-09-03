import Link from 'next/link'
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"

const Navbar = () => {
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
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
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
