"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"

type Comment = {
  id: string
  content: string
  author: string
  createdAt: Date
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Comment[]
      setComments(fetchedComments)
    })

    return () => unsubscribe()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be signed in to comment")
      return
    }

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        content: newComment,
        author: user.displayName || user.email,
        createdAt: serverTimestamp(),
      })
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment: ", error)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          required
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={!user}
        >
          {user ? "Post Comment" : "Sign in to comment"}
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded-md">
            <p className="mb-2">{comment.content}</p>
            <p className="text-sm text-gray-600">
              By {comment.author} on {comment.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

