import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applicationSchema, LoanApplication } from "@/lib/types";
import { getApplications, createApplication } from "@/lib/services/application-service";
import { auth } from "../../../../auth";

// Ensure request is authenticated
async function authenticate() {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  
  return session;
}

// GET /api/applications - List all applications
export async function GET(request: NextRequest) {
  const authResult = await authenticate();
  if (authResult.status === 401) return authResult;
  
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const applications = await getApplications({ status: status || undefined });
    
    return NextResponse.json({
      message: "Applications retrieved successfully",
      data: applications
    });
  } catch (error) {
    console.error("Error retrieving applications:", error);
    return NextResponse.json(
      { message: "Failed to retrieve applications" },
      { status: 500 }
    );
  }
}

// POST /api/applications - Create a new application
export async function POST(request: NextRequest) {
  const authResult = await authenticate();
  if (authResult.status === 401) return authResult;
  
  try {
    const body = await request.json();
    
    // Validate request body against schema
    try {
      const validatedData = applicationSchema.parse(body);
      
      // Add metadata
      const application: LoanApplication = {
        ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending",
      };
      
      const createdApplication = await createApplication(application);
      
      return NextResponse.json({
        message: "Application created successfully",
        data: createdApplication
      }, { status: 201 });
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
    console.error("Error creating application:", error);
    return NextResponse.json(
      { message: "Failed to create application" },
      { status: 500 }
    );
  }
} 