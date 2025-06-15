'use client'

import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
import { EmptyState } from "@/components/ui/empty-state"
import { 
  FileText, 
  Link, 
  Files, 
  Search, 
  MessageSquare, 
  Mail, 
  Image,
  FileQuestion,
  Settings
} from "lucide-react"

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="absolute w-full h-full"
      />

      <div className="p-8 relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Mini-RAG: Your Personal AI Powerhouse
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl">
          Engage in intelligent conversations with your documents. Upload your data and get instant, accurate answers powered by cutting-edge retrieval-augmented generation.
        </p>
      </div>
    </Card>
  )
}

function EmptyStateDefault() {
  return (
    <EmptyState
      title="No Forms Created"
      description="You can create a new template to add in your pages."
      icons={[FileText, Link, Files]}
      action={{
        label: "Create Form",
        onClick: () => console.log("Create form clicked")
      }}
    />
  )
}

function EmptyStateMessages() {
  return (
    <EmptyState
      title="No Messages"
      description="Start a conversation by sending a message."
      icons={[MessageSquare, Mail]}
      action={{
        label: "Send Message",
        onClick: () => console.log("Send message clicked")
      }}
    />
  )
}

function EmptyStateSearch() {
  return (
    <EmptyState
      title="No Results Found"
      description="Try adjusting your search filters."
      icons={[Search, FileQuestion]}
    />
  )
}

function EmptyStateMedia() {
  return (
    <EmptyState
      title="No Images"
      description="Upload images to get started with your gallery."
      icons={[Image]}
      action={{
        label: "Upload Images",
        onClick: () => console.log("Upload clicked")
      }}
    />
  )
}

function EmptyStateSettings() {
  return (
    <EmptyState
      title="No Settings"
      description="Configure your application settings to get started."
      icons={[Settings]}
      action={{
        label: "Configure",
        onClick: () => console.log("Configure clicked")
      }}
    />
  )
}

export {
  EmptyStateDefault,
  EmptyStateMessages,
  EmptyStateSearch,
  EmptyStateMedia,
  EmptyStateSettings,
} 