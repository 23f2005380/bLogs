"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

type BlogPost = {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  imageUrl: string | null
  createdAt: Date
}

export default function BlogList({ limitPosts = 6 }: { limitPosts?: number }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(limitPosts))
      const querySnapshot = await getDocs(q)
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BlogPost[]
      setPosts(fetchedPosts)
      setLoading(false)
    }

    fetchPosts()
  }, [limitPosts])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No posts found. Be the first to create a post!</p>
        <Link href="/create" className="text-blue-500 hover:underline mt-2 inline-block">
          Create a post
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          {post.imageUrl ? (
            <div className="h-48 overflow-hidden">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          <div className="p-6">
            <div className="flex gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {post.category || "Uncategorized"}
              </span>
            </div>

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
        </div>
      ))}
    </div>
  )
}

