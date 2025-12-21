import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const contact = await db.contact.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = params

    // Check if contact exists
    const existingContact = await db.contact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      )
    }

    const contact = await db.contact.update({
      where: {
        id: params.id
      },
      data: {
        isRead: body.isRead
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}