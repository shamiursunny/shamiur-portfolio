import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Delete the contact
    await db.contact.delete({
      where: { id }
    })

    return NextResponse.json(
      { success: true, message: "Contact deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

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

    // Update the contact (only allow updating isRead status)
    const updatedContact = await db.contact.update({
      where: { id },
      data: {
        isRead: body.isRead !== undefined ? body.isRead : existingContact.isRead
      }
    })

    return NextResponse.json(
      { success: true, message: "Contact updated successfully", contact: updatedContact },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    )
  }
}