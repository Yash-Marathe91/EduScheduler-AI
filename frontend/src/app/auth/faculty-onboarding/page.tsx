"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function FacultyOnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    department: "",
    designation: "",
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    try {
      // 1. Get current session token for backend auth
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Prepare file
      const formData = new FormData();
      formData.append("file", file);

      // 3. Send to FastAPI backend OCR endpoint
      const response = await fetch("http://localhost:8000/api/v1/faculty/parse-id", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to parse ID");

      const result = await response.json();
      
      // 4. Auto-fill form with extracted data
      if (result.success) {
        setFormData({
          name: result.data.name,
          employee_id: result.data.employee_id,
          department: result.data.department,
          designation: result.data.designation,
        });
        setScanComplete(true);
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to scan ID. Please enter manually.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would send this to your backend to save the faculty details
    // For now, we'll just simulate a successful save and redirect to dashboard
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-xl z-10 border-outline-variant/30 shadow-xl bg-surface/80 backdrop-blur-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display text-on-surface">Faculty Onboarding</CardTitle>
          <CardDescription className="text-on-surface-variant font-body-md mt-2">
            Upload your Institutional ID card to instantly auto-fill your profile, or enter the details manually below.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          {/* AI Scanner Section */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${scanComplete ? 'border-success/50 bg-success/5' : 'border-primary/30 bg-primary/5 hover:border-primary/60 cursor-pointer'}`}
            onClick={() => !scanComplete && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            
            {isScanning ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-on-surface font-medium animate-pulse">AI is scanning your ID card...</p>
              </div>
            ) : scanComplete ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-success text-on-success rounded-full p-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-on-surface font-medium">ID Scanned Successfully! Details auto-filled.</p>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setScanComplete(false); }}>
                  Scan Another ID
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-surface p-3 rounded-full shadow-sm border border-outline-variant/30">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-on-surface font-medium">Click here to upload your ID Card</p>
                  <p className="text-on-surface-variant text-sm mt-1">Our AI will extract your details instantly</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-outline-variant/30 flex-1"></div>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">or verify manually</span>
            <div className="h-px bg-outline-variant/30 flex-1"></div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                  <Input 
                    id="name" 
                    className="pl-9" 
                    placeholder="e.g. Dr. Sarah Mitchell" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input 
                  id="employee_id" 
                  placeholder="e.g. EMP-98234" 
                  value={formData.employee_id}
                  onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  placeholder="e.g. Computer Science" 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input 
                  id="designation" 
                  placeholder="e.g. Associate Professor" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
