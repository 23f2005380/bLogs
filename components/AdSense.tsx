"use client"

import { useEffect, useRef } from "react"

type AdSenseProps = {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  style?: React.CSSProperties
  className?: string
}

export default function AdSense({ adSlot, adFormat = "auto", style, className }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only initialize ads when component is mounted and visible
    const initAd = () => {
      if (typeof window !== "undefined" && adRef.current) {
        // Check if the element has width
        const { width } = adRef.current.getBoundingClientRect()
        
        if (width > 0) {
          try {
            // Push the ad only if the container has width
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          } catch (error) {
            console.error("AdSense error:", error)
          }
        } else {
          // If no width, try again after a short delay
          setTimeout(initAd, 200)
        }
      }
    }

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(initAd, 100)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={adRef} className={`adsense-container my-4 ${className || ""}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          minHeight: "280px",
          ...style
        }}
        data-ad-client="ca-pub-6418435405848772" 
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}