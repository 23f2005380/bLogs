import { collection, addDoc, serverTimestamp, setDoc, doc, getDocs } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "./firebase"

export async function pushSampleData() {
  // Create a sample user
  let userId = null
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "demo@example.com", "password123")
    userId = userCredential.user.uid

    // Create user profile
    await setDoc(doc(db, "users", userId), {
      displayName: "Demo User",
      email: "demo@example.com",
      bio: "This is a demo user account created for sample data.",
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating sample user:", error)
    // If user already exists, try to get the user ID
    userId = "demo-user-id"
  }

  const samplePosts = [
    {
      title: "Getting Started with Next.js",
      content: `Next.js is a powerful React framework that makes it easy to build server-side rendered and statically generated web applications.

## Why Next.js?

Next.js provides a great developer experience with features like:

- Server-side rendering
- Static site generation
- API routes
- File-based routing
- Built-in CSS and Sass support
- Fast refresh

## Getting Started

To create a new Next.js app, run:

\`\`\`
npx create-next-app my-app
cd my-app
npm run dev
\`\`\`

This will start your development server at http://localhost:3000.

## Conclusion

Next.js is a fantastic framework for building modern web applications. Give it a try for your next project!`,
      category: "Technology",
      tags: ["nextjs", "react", "javascript", "web development"],
      author: "Demo User",
      authorId: userId,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Introduction to Firebase",
      content: `Firebase is a comprehensive backend-as-a-service (BaaS) platform that helps developers build and scale applications quickly.

## Key Firebase Services

Firebase offers a wide range of services:

### Firestore
A flexible, scalable NoSQL cloud database to store and sync data for client and server-side development.

### Authentication
Easy-to-use authentication system with support for email/password, social providers, and more.

### Storage
Store and serve user-generated content like images, audio, and video.

### Hosting
Fast and secure web hosting for your web app.

## Getting Started with Firebase

To start using Firebase in your project:

1. Create a Firebase project in the Firebase console
2. Register your app with Firebase
3. Add the Firebase SDK to your application
4. Initialize Firebase in your code

## Conclusion

Firebase provides a powerful set of tools that can help you build better apps faster. It's particularly useful for startups and small teams who want to focus on their core product rather than infrastructure.`,
      category: "Technology",
      tags: ["firebase", "backend", "database", "authentication"],
      author: "Demo User",
      authorId: userId,
      imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "The Benefits of Meditation",
      content: `Meditation is a practice that has been around for thousands of years and has numerous benefits for both mental and physical health.

## Mental Benefits

Regular meditation practice can:

- Reduce stress and anxiety
- Improve focus and concentration
- Enhance self-awareness
- Promote emotional health
- Lengthen attention span

## Physical Benefits

Meditation isn't just good for your mind; it's also beneficial for your body:

- Lowers blood pressure
- Improves sleep
- Helps manage pain
- Reduces inflammation

## How to Start Meditating

Starting a meditation practice is simple:

1. Find a quiet, comfortable place to sit
2. Set a timer for 5-10 minutes
3. Close your eyes and focus on your breath
4. When your mind wanders, gently bring your attention back to your breath
5. Practice regularly, ideally daily

## Conclusion

Meditation is a simple practice that can have profound effects on your wellbeing. Even just a few minutes a day can make a significant difference in how you feel and function.`,
      category: "Health",
      tags: ["meditation", "mindfulness", "wellness", "mental health"],
      author: "Demo User",
      authorId: userId,
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Easy Pasta Recipes for Beginners",
      content: `Pasta is one of the most versatile and beginner-friendly foods to cook. Here are some simple pasta recipes that anyone can make.

## Classic Spaghetti Aglio e Olio

This traditional Italian pasta dish requires just a few ingredients:

### Ingredients:
- 1 pound spaghetti
- 6 cloves garlic, thinly sliced
- 1/2 cup olive oil
- 1/4 teaspoon red pepper flakes
- Salt and pepper to taste
- Fresh parsley, chopped
- Grated Parmesan cheese (optional)

### Instructions:
1. Cook spaghetti according to package directions
2. While pasta cooks, heat olive oil in a pan and add sliced garlic
3. Cook until garlic is golden, then add red pepper flakes
4. Drain pasta, reserving 1/2 cup of pasta water
5. Add pasta to the pan with garlic oil, toss to coat
6. Add pasta water as needed to create a light sauce
7. Season with salt and pepper, garnish with parsley and cheese

## Simple Tomato Pasta

A quick and easy tomato sauce pasta:

### Ingredients:
- 1 pound pasta of your choice
- 2 tablespoons olive oil
- 1 onion, diced
- 3 cloves garlic, minced
- 1 can (28 oz) crushed tomatoes
- 1 teaspoon dried basil
- Salt and pepper to taste
- Grated Parmesan cheese

### Instructions:
1. Cook pasta according to package directions
2. In a large pan, heat olive oil and sauté onion until soft
3. Add garlic and cook for 30 seconds
4. Add crushed tomatoes and basil, simmer for 10 minutes
5. Season with salt and pepper
6. Toss with drained pasta and top with cheese

## Conclusion

These simple pasta recipes are perfect for beginners and can be customized with additional ingredients as you become more comfortable in the kitchen.`,
      category: "Food",
      tags: ["pasta", "recipes", "cooking", "food"],
      author: "Demo User",
      authorId: userId,
      imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Essential Tips for Remote Work",
      content: `Remote work has become increasingly common. Here are some essential tips to help you stay productive and maintain work-life balance while working from home.

## Create a Dedicated Workspace

Having a dedicated workspace helps you:
- Mentally separate work from personal life
- Reduce distractions
- Maintain proper ergonomics
- Signal to others that you're working

## Establish a Routine

A consistent routine helps maintain productivity:
- Wake up at the same time each day
- Get dressed as if you're going to the office
- Take regular breaks
- End work at a set time

## Communication is Key

When working remotely, clear communication becomes even more important:
- Over-communicate rather than under-communicate
- Use video calls when possible
- Be responsive during work hours
- Document decisions and action items

## Take Care of Your Physical and Mental Health

Remote work can blur the lines between work and personal life:
- Take regular breaks to move your body
- Step outside for fresh air
- Set boundaries with work hours
- Connect with colleagues socially

## Conclusion

Remote work offers flexibility and freedom, but it requires intentionality to be successful. By creating structure, maintaining communication, and taking care of your wellbeing, you can thrive in a remote work environment.`,
      category: "Lifestyle",
      tags: ["remote work", "productivity", "work from home", "career"],
      author: "Demo User",
      authorId: userId,
      imageUrl: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1600&q=80",
    },
  ]

  for (const post of samplePosts) {
    await addDoc(collection(db, "posts"), {
      ...post,
      createdAt: serverTimestamp(),
    })
  }

  // Add some sample comments
  const commentTexts = [
    "Great post! Thanks for sharing this information.",
    "I found this really helpful. Looking forward to more content like this.",
    "This is exactly what I needed to read today. Thank you!",
    "I have a question about this topic. Could you elaborate more on the second point?",
    "I've been following your blog for a while now, and this is one of my favorite posts.",
    "I shared this with my colleagues. Very insightful!",
    "I never thought about it this way before. You've changed my perspective.",
    "Do you have any recommended resources for learning more about this?",
  ]

  // Get the posts we just created
  const postsRef = collection(db, "posts")
  const postsSnapshot = await getDocs(postsRef)

  // Add comments to each post
  for (const postDoc of postsSnapshot.docs) {
    // Add 2-4 random comments to each post
    const numComments = Math.floor(Math.random() * 3) + 2

    for (let i = 0; i < numComments; i++) {
      const randomCommentIndex = Math.floor(Math.random() * commentTexts.length)

      await addDoc(collection(db, "comments"), {
        postId: postDoc.id,
        content: commentTexts[randomCommentIndex],
        author: "Demo User",
        createdAt: serverTimestamp(),
      })
    }
  }

  console.log("Sample data pushed successfully")
}

