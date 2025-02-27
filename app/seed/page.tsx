"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { pushSampleData } from "@/lib/sampleData"

export default function SeedPage() {
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hasData, setHasData] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkForData = async () => {
      try {
        const q = query(collection(db, "posts"), limit(1))
        const snapshot = await getDocs(q)
        setHasData(!snapshot.empty)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkForData()
  }, [])

  const handleSeed = async () => {
    setSeeding(true)
    setError("")

    try {
      await pushSampleData()
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Checking database...</div>
  }

  return (
    <div className="max-w-md mx-auto text-center py-10">
      <h1 className="text-3xl font-bold mb-6">Database Seed</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Sample data has been successfully added! Redirecting to home page...
        </div>
      )}

      {hasData ? (
        <div>
          <p className="mb-4">Your database already contains data.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Your database is empty. Would you like to add sample data?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSeed}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={seeding}
            >
              {seeding ? "Adding Sample Data..." : "Add Sample Data"}
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              disabled={seeding}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

