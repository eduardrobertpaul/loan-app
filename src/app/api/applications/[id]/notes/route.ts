import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addApplicationNote } from "@/lib/services/application-service";
import { auth } from "../../../../../../auth";

// Validation schema for note request
const noteRequestSchema = z.object({
  text: z.string().min(1, "Note text is required"),
});

// Ensure request is authenticated
async function authenticate() {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    };
  }
  
  return {
    isAuthenticated: true,
    session
  };
}

// POST /api/applications/[id]/notes - Add a note to an application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticate();
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  
  // Ensure we have a user name
  const userName = authResult.session.user?.name || authResult.session.user?.email || 'Unknown User';
  
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request body
    try {
      const { text } = noteRequestSchema.parse(body);
      
      const updatedApplication = await addApplicationNote(
        id,
        {
          text,
          author: userName
        }
      );
      
      if (!updatedApplication) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: "Note added successfully",
        data: updatedApplication
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.errors.map(error => ({
          path: error.path.join('.'),
          message: error.message
        }));
        
        return NextResponse.json({
          message: "Validation error",
          errors
        }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error adding note to application:", error);
    return NextResponse.json(
      { message: "Failed to add note" },
      { status: 500 }
    );
  }
} 