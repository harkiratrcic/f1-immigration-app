import { useState } from "react"
import { CheckCircle, Clock, FileText, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function InviteFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const steps = [
    {
      title: "Personal Information",
      description: "Basic details and contact information",
      icon: Users,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending"
    },
    {
      title: "Immigration History",
      description: "Previous applications and travel history", 
      icon: FileText,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending"
    },
    {
      title: "Supporting Documents",
      description: "Upload required documentation",
      icon: Shield,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending"
    },
    {
      title: "Review & Submit",
      description: "Final review and electronic signature",
      icon: CheckCircle,
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending"
    }
  ]

  const progress = (currentStep / totalSteps) * 100

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success'
      case 'current': return 'text-primary'
      default: return 'text-muted-foreground'
    }
  }

  const getStepBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success'
      case 'current': return 'bg-primary'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F1</span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">F1 Immigration inc.</h1>
                <p className="text-xs text-muted-foreground">Secure Client Intake Portal</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Auto-saves
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Work Permit Application</h2>
              <p className="text-muted-foreground">Complete your secure intake form</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</p>
              <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Overview */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {steps.map((step, index) => (
            <Card key={index} className={`transition-all duration-200 ${
              step.status === 'current' ? 'ring-2 ring-primary/20 shadow-lg' : 
              step.status === 'completed' ? 'bg-success/5' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepBg(step.status)}`}>
                    <step.icon className={`h-5 w-5 ${
                      step.status === 'completed' || step.status === 'current' 
                        ? 'text-white' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className={`text-base ${getStepColor(step.status)}`}>
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Current Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              Please provide the following information to continue with your work permit application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Form Content */}
            <div className="grid gap-4">
            <div className="p-6 border border-dashed border-border rounded-lg text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Form Fields Would Appear Here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interactive form components for Step {currentStep} would be rendered in this area.
              </p>
              <div className="flex justify-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                  disabled={currentStep === totalSteps}
                >
                  {currentStep === totalSteps ? 'Submit' : 'Next Step'}
                </Button>
              </div>
            </div>
            </div>
            
            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure & Confidential</p>
                <p className="text-xs text-muted-foreground">
                  Your information is encrypted and stored securely. This form auto-saves your progress.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact us at <a href="mailto:intake@f1immigration.com" className="text-primary hover:underline">intake@f1immigration.com</a> or call (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  )
}