"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Profile() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setDisplayName(data.displayName || "")
          setBio(data.bio || "")
        }
      }
      fetchUserProfile()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        displayName,
        bio,
      })
      alert("Profile updated successfully")
    }
  }

  if (!user) {
    return <div>Please sign in to view your profile</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block mb-2 font-semibold">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block mb-2 font-semibold">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={5}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  )
}

