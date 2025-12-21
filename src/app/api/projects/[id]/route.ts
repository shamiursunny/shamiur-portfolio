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

    const project = await db.project.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error deleting project:", error)
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

    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const project = await db.project.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        link: body.link
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}