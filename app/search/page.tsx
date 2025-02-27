"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { collection, query, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import SearchBar from "@/components/SearchBar"

type BlogPost = {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchPosts = async () => {
      if (!searchQuery) {
        setPosts([])
        setLoading(false)
        return
      }

      // This is a simple search implementation
      // For production, consider using Algolia or Firebase Extensions for search
      const postsRef = collection(db, "posts")
      const q = query(postsRef)
      const querySnapshot = await getDocs(q)

      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BlogPost[]

      // Client-side filtering (not ideal for large datasets)
      const filteredPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setPosts(filteredPosts)
      setLoading(false)
    }

    searchPosts()
  }, [searchQuery])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p className="mb-4">
            {posts.length} {posts.length === 1 ? "result" : "results"} for &quot;{searchQuery}&quot;
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      By {post.author} on {post.createdAt.toLocaleDateString()}
                    </span>
                    <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline">
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

