"use client"

import dynamic from "next/dynamic"

// Dynamically import Chatbot only on client-side to prevent hydration mismatch
const Chatbot = dynamic(() => import("@/components/Chatbot"), {
    ssr: false,
})

export default function ClientChatbot() {
    return <Chatbot />
}
