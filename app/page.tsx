"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, query, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import BlogList from "@/components/BlogList"

export default function Home() {
  const [hasData, setHasData] = useState<boolean | null>(null)

  useEffect(() => {
    const checkForData = async () => {
      try {
        const q = query(collection(db, "posts"), limit(1))
        const snapshot = await getDocs(q)
        setHasData(!snapshot.empty)
      } catch (err) {
        console.error("Error checking for data:", err)
        setHasData(false)
      }
    }

    checkForData()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Welcome to Blogy Blogs</h1>
        <p className="text-gray-600">A responsive blogging platform built with Next.js and Firebase</p>
      </div>

      {hasData === false && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">No blog posts found</p>
          <p>
            It looks like your database is empty. Would you like to add some sample data?{" "}
            <Link href="/seed" className="underline">
              Click here to seed your database
            </Link>
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Latest Blog Posts</h2>
      <BlogList />
    </div>
  )
}

