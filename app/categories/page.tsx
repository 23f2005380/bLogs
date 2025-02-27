"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, query, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type CategoryCount = {
  name: string
  count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, "posts"))
      const querySnapshot = await getDocs(q)

      const categoryMap = new Map<string, number>()

      querySnapshot.docs.forEach((doc) => {
        const category = doc.data().category || "Uncategorized"
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })

      const categoryList = Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count,
      }))

      // Sort by count (descending)
      categoryList.sort((a, b) => b.count - a.count)

      setCategories(categoryList)
      setLoading(false)
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600">
                {category.count} {category.count === 1 ? "post" : "posts"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

