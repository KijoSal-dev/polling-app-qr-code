'use client'

import './global.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

const inter = Inter({ subsets: ['latin'] })

function Navbar() {
  const session = useSession()

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
      <Link href="/" className="font-bold text-lg">
        Polling App
      </Link>
      <div>
        {session ? (
          <LogoutButton />
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const supabaseClient = createBrowserSupabaseClient()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <Navbar />
          <main className="p-6">{children}</main>
        </SessionContextProvider>
      </body>
    </html>
  )
}
