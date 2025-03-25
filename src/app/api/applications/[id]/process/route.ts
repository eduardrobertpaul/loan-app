import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processApplication } from "@/lib/services/application-service";
import { auth } from "../../../../../../auth";

// Process request schema
const processRequestSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  comments: z.string().optional(),
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

// POST /api/applications/[id]/process - Process a loan application (approve/reject)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticate();
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request body
    try {
      const { decision, comments } = processRequestSchema.parse(body);
      
      // Get the reviewer name from the session
      const reviewerName = authResult.isAuthenticated && authResult.session?.user?.name 
        ? authResult.session.user.name 
        : 'System';
      
      // Process the application
      const processedApplication = await processApplication(
        id, 
        decision, 
        reviewerName,
        comments
      );
      
      if (!processedApplication) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: `Application ${decision} successfully`,
        data: processedApplication
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
    console.error("Error processing application:", error);
    return NextResponse.json(
      { message: "Failed to process application" },
      { status: 500 }
    );
  }
} 