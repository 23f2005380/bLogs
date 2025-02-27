"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editorType, setEditorType] = useState<"rich" | "html">("rich")

  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("You must be signed in to create a post")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Process tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // Create post document
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        content,
        category: category || "Uncategorized",
        tags: tagArray,
        imageUrl,
        author: user.displayName || user.email,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        editorType,
      })

      router.push(`/post/${docRef.id}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Health",
    "Lifestyle",
    "Business",
    "Education",
    "Entertainment",
    "Other",
  ]

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
          <label htmlFor="category" className="block mb-2 font-semibold">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block mb-2 font-semibold">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. nextjs, firebase, blog"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-2 font-semibold">
            Featured Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g. https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Content Editor Type</label>
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
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-64 mb-12"
            />
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

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  )
}