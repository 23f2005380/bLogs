"use client"

import type { ReactNode } from "react"

type SidebarProps = {
  children: ReactNode
  position: "left" | "right"
}

export default function Sidebar({ children, position }: SidebarProps) {
  return (
    <div
      className={`hidden lg:block lg:w-64 p-4 ${
        position === "left" ? "border-r" : "border-l"
      } border-gray-200 dark:border-gray-700`}
      style={{ minWidth: "200px" }} // Ensure minimum width
    >
      {children}
    </div>
  )
}