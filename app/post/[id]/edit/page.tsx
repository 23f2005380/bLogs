"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"

type BlogPost = {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  createdAt: Date
}

export default function EditPost() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const postData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
        } as BlogPost

        // Check if the current user is the author
        if (user && postData.authorId !== user.uid) {
          setError("You do not have permission to edit this post")
        } else {
          setPost(postData)
          setTitle(postData.title)
          setContent(postData.content)
        }
      } else {
        setError("Post not found")
      }
      setLoading(false)
    }

    if (user) {
      fetchPost()
    }
  }, [id, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("You must be signed in to edit a post")
      return
    }

    try {
      const docRef = doc(db, "posts", id as string)
      await updateDoc(docRef, {
        title,
        content,
        updatedAt: new Date(),
      })
      router.push(`/post/${id}`)
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 font-semibold">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            rows={10}
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Update Post
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

