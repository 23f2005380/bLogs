"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { doc, getDoc, deleteDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"
import CommentSection from "@/components/CommentSection"

type BlogPost = {
  id: string
  title: string
  content: string
  plainTextContent: string
  author: string
  authorId: string
  category: string
  tags: string[]
  imageUrl: string | null
  createdAt: Date
  likes: number
  likedBy: string[]
  editorType: "rich" | "html"
  isPrivate: boolean
}

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Added error state
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
          likes: docSnap.data().likes || 0,
          likedBy: docSnap.data().likedBy || [],
          editorType: docSnap.data().editorType || "html",
        } as BlogPost

        if (postData.isPrivate && (!user || user.uid !== postData.authorId)) {
          setError("This post is private and you don't have permission to view it.")
        } else {
          setPost(postData)
        }
      }
      setLoading(false)
    }

    fetchPost()
  }, [id, user])

  const handleDelete = async () => {
    if (!user || !post || user.uid !== post.authorId) {
      return
    }

    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id as string))
        router.push("/")
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const handleLike = async () => {
    if (!user || !post) return

    const docRef = doc(db, "posts", id as string)
    const isLiked = post.likedBy.includes(user.uid)

    try {
      if (isLiked) {
        await updateDoc(docRef, {
          likes: increment(-1),
          likedBy: post.likedBy.filter((uid) => uid !== user.uid),
        })
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.likes - 1,
                likedBy: prev.likedBy.filter((uid) => uid !== user.uid),
              }
            : null,
        )
      } else {
        await updateDoc(docRef, {
          likes: increment(1),
          likedBy: [...post.likedBy, user.uid],
        })
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.likes + 1,
                likedBy: [...prev.likedBy, user.uid],
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Error updating like:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      {post.imageUrl && (
        <div className="mb-6">
          <img
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {post.category || "Uncategorized"}
        </span>

        {post.tags &&
          post.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
      </div>

      <p className="text-gray-600 mb-6">
        By {post.author} on {post.createdAt.toLocaleDateString()}
      </p>

      <div className="flex items-center mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            user && post.likedBy.includes(user.uid) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          disabled={!user}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {post.likes} {post.likes === 1 ? "Like" : "Likes"}
        </button>
        {!user && <span className="ml-2 text-sm text-gray-500">Sign in to like this post</span>}
      </div>

      {user && user.uid === post.authorId && (
        <div className="flex gap-4 mb-6">
          <Link
            href={`/post/${post.id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Delete
          </button>
        </div>
      )}

      <div className="prose max-w-none mb-8" style={{font-family:'Source Sans Pro'}}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <CommentSection postId={post.id} />
    </div>
  )
}

