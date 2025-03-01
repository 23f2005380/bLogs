"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"

type BlogPost = {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  category: string
  tags: string[]
  imageUrl: string | null
  createdAt: Date
  isPrivate: boolean
}

export default function CategoryPage() {
  const { category } = useParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("category", "==", decodeURIComponent(category as string)),
        orderBy("createdAt", "desc"),
      )
      const querySnapshot = await getDocs(q)
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BlogPost[]

      // Filter out private posts that don't belong to the current user
      const filteredPosts = fetchedPosts.filter((post) => !post.isPrivate || (user && post.authorId === user.uid))

      setPosts(filteredPosts)
      setLoading(false)
    }

    fetchPosts()
  }, [category, user])

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category: {decodeURIComponent(category as string)}</h1>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found in this category.</p>
          <Link href="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Back to Home
          </Link>
        </div>
      ) : (
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
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{stripHtml(post.content).substring(0, 100)}...</p>
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
      )}
    </div>
  )
}

