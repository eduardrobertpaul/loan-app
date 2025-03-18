import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applicationSchema, LoanApplication } from "@/lib/types";
import { 
  getApplicationById, 
  updateApplication, 
  deleteApplication,
  addApplicationNote,
  processApplication
} from "@/lib/services/application-service";
import { auth } from "../../../../../auth";

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

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticate();
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  
  try {
    const id = params.id;
    const application = await getApplicationById(id);
    
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Application retrieved successfully",
      data: application
    });
  } catch (error) {
    console.error("Error retrieving application:", error);
    return NextResponse.json(
      { message: "Failed to retrieve application" },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] - Update a specific application
export async function PUT(
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
    
    // Validate request body against schema
    try {
      const validatedData = applicationSchema.partial().parse(body);
      
      const updatedApplication = await updateApplication(id, {
        ...validatedData,
        updatedAt: new Date().toISOString()
      });
      
      if (!updatedApplication) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: "Application updated successfully",
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
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: "Failed to update application" },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] - Delete a specific application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticate();
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  
  try {
    const id = params.id;
    const success = await deleteApplication(id);
    
    if (!success) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { message: "Failed to delete application" },
      { status: 500 }
    );
  }
} 