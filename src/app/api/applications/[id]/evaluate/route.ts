import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApplicationById } from "@/lib/services/application-service";
import { EvaluationEngine } from "@/lib/utils/evaluation-engine";
import { auth } from "../../../../../../auth";

// Validation schema for custom evaluation criteria
const customCriteriaSchema = z.object({
  minimumCreditScore: z.number().optional(),
  maximumDtiRatio: z.number().optional(),
  minimumIncome: z.number().optional(),
  maximumLoanToIncomeRatio: z.number().optional(),
  maximumLoanToValueRatio: z.number().optional(),
  minimumEmploymentYears: z.number().optional(),
  bankruptcyImpact: z.number().optional(),
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

// GET /api/applications/[id]/evaluate - Evaluate an application
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
    
    // Use default evaluation criteria
    const evaluationEngine = new EvaluationEngine();
    const recommendation = evaluationEngine.evaluateApplication(application);
    
    return NextResponse.json({
      message: "Application evaluated successfully",
      data: recommendation
    });
  } catch (error) {
    console.error("Error evaluating application:", error);
    return NextResponse.json(
      { message: "Failed to evaluate application" },
      { status: 500 }
    );
  }
}

// POST /api/applications/[id]/evaluate - Evaluate with custom criteria
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
    const application = await getApplicationById(id);
    
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    
    // Validate and use custom criteria if provided
    try {
      const customCriteria = customCriteriaSchema.parse(body);
      
      const evaluationEngine = new EvaluationEngine(customCriteria);
      const recommendation = evaluationEngine.evaluateApplication(application);
      
      return NextResponse.json({
        message: "Application evaluated successfully with custom criteria",
        data: recommendation
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
    console.error("Error evaluating application with custom criteria:", error);
    return NextResponse.json(
      { message: "Failed to evaluate application" },
      { status: 500 }
    );
  }
} 