"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

import "react-quill/dist/quill.snow.css"

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
  editorType: "rich" | "html"
}

export default function EditPost() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [editorType, setEditorType] = useState<"rich" | "html">("rich")
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
          setIsPrivate(postData.isPrivate || false)
          setEditorType(postData.editorType || "rich")
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
        isPrivate,
        editorType,
      })
      router.push(`/post/${id}`)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
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
          <label className="block mb-2 font-semibold">Editor Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="rich"
                checked={editorType === "rich"}
                onChange={() => setEditorType("rich")}
                className="form-radio"
              />
              <span className="ml-2">Rich Text Editor</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="html"
                checked={editorType === "html"}
                onChange={() => setEditorType("html")}
                className="form-radio"
              />
              <span className="ml-2">HTML Editor</span>
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 font-semibold">
            Content
          </label>
          {editorType === "rich" ? (
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
              rows={10}
            ></textarea>
          )}
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Make this post private</span>
          </label>
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

