import { useState } from "react";
import { Upload, FileText, Image, File, Loader2, CheckCircle2, Brain, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { useSession, EvaluationResult, UploadedFile } from "../contexts/SessionContext";
import AIEvaluationService from "../services/AIEvaluationService";
import { toast } from "sonner";

export function UploadPage() {
  const { addEvaluationResult, addUploadedFile, updateFileStatus, setCurrentEvaluation } = useSession();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rubricType, setRubricType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [useRealAI, setUseRealAI] = useState(false);

  // Check if API key is available (user settings, env, or default)
  const hasApiKey = () => {
    const userApiKey = localStorage.getItem('openrouter_api_key');
    const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    return !!(userApiKey || (envApiKey && envApiKey !== 'your_openrouter_api_key_here'));
  };

  const processingSteps = [
    { label: "Parsing document", icon: FileText },
    { label: "Evaluating content", icon: Brain },
    { label: "Generating feedback", icon: CheckCircle2 },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !rubricType) return;
    
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const evaluationId = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add file to session
    const uploadedFileData: UploadedFile = {
      id: fileId,
      file: uploadedFile,
      rubricType,
      uploadTime: new Date().toISOString(),
      status: 'processing',
      evaluationId,
    };
    
    addUploadedFile(uploadedFileData);
    setCurrentFileId(fileId);
    
    setIsProcessing(true);
    setProcessingStep(0);
    setProgress(0);

    try {
      if (useRealAI && hasApiKey()) {
        // Real AI Evaluation
        const aiService = new AIEvaluationService();
        
        // Progress simulation for UI feedback
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 1000);

        setTimeout(() => setProcessingStep(1), 1000);
        setTimeout(() => setProcessingStep(2), 3000);

        // Actual AI evaluation
        const result = await aiService.evaluate(
          uploadedFile, 
          rubricType as 'flowchart' | 'algorithm' | 'pseudocode'
        );

        clearInterval(progressInterval);
        setProgress(100);

        const evaluationResult: EvaluationResult = {
          ...result,
          id: evaluationId
        };

        addEvaluationResult(evaluationResult);
        setCurrentEvaluation(evaluationResult);
        updateFileStatus(fileId, 'completed', evaluationId);
        
        toast.success("AI evaluation completed successfully!");
        
      } else {
        // Mock evaluation (existing code)
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 2;
          });
        }, 100);

        setTimeout(() => setProcessingStep(1), 2000);
        setTimeout(() => setProcessingStep(2), 4000);
        
        setTimeout(() => {
          clearInterval(interval);
          
          // Generate mock evaluation result
          const mockResult: EvaluationResult = {
            id: evaluationId,
            filename: uploadedFile.name,
            fileType: uploadedFile.type,
            rubricType,
            timestamp: new Date().toISOString(),
            overallScore: {
              points: 87,
              total: 100,
              percentage: 87,
              grade: 'A-'
            },
            criteriaScores: [
              {
                criterion: "Clarity & Readability",
                weight: 20,
                score: 18,
                maxScore: 20,
                percentage: 90,
                status: "excellent",
                feedback: "Excellent use of clear symbols and consistent labeling. Flow direction is intuitive and easy to follow."
              },
              {
                criterion: "Logical Flow",
                weight: 25,
                score: 22,
                maxScore: 25,
                percentage: 88,
                status: "good",
                feedback: "Strong logical progression with proper use of decision points. Minor improvement needed in loop termination conditions."
              },
              {
                criterion: "Completeness",
                weight: 20,
                score: 17,
                maxScore: 20,
                percentage: 85,
                status: "good",
                feedback: "Most essential elements are present. Consider adding error handling paths for edge cases."
              },
              {
                criterion: "Syntax & Standards",
                weight: 15,
                score: 14,
                maxScore: 15,
                percentage: 93,
                status: "excellent",
                feedback: "Adheres to standard flowchart conventions. Excellent use of appropriate symbols."
              },
              {
                criterion: "Efficiency & Optimization",
                weight: 20,
                score: 16,
                maxScore: 20,
                percentage: 80,
                status: "fair",
                feedback: "Good structure but could be optimized by reducing redundant decision points."
              }
            ],
            aiInsights: {
              strengths: [
                "Excellent adherence to standard conventions and symbols",
                "Clear logical flow with well-defined decision points",
                "Strong readability with consistent labeling and formatting"
              ],
              improvements: [
                "Consider adding error handling for edge cases and invalid inputs",
                "Optimize by reducing redundant decision points in the main loop",
                "Add more descriptive comments for complex logic sections"
              ],
              summary: "This is a mock evaluation. Configure OpenRouter API key in settings for real AI analysis."
            }
          };

          addEvaluationResult(mockResult);
          setCurrentEvaluation(mockResult);
          updateFileStatus(fileId, 'completed', evaluationId);
          
          toast.success("Mock evaluation completed! Configure API key for real AI analysis.");
        }, 6000);
      }
      
    } catch (error) {
      console.error('Evaluation error:', error);
      updateFileStatus(fileId, 'failed');
      toast.error(`Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
      setProgress(0);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return FileText;
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return Image;
    return File;
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-gray-900">Upload Submission</h1>
        <p className="text-gray-500">Upload your flowchart, algorithm, or pseudocode for AI-powered evaluation</p>
      </div>

      {/* Upload Card */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Select File</CardTitle>
          <CardDescription>Upload your document in PDF, DOCX, PPTX, PNG, or JPG format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragging 
                ? "border-violet-500 bg-violet-50" 
                : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
              }
            `}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                {(() => {
                  const Icon = getFileIcon(uploadedFile.name);
                  return <Icon className="w-12 h-12 text-violet-600 mx-auto" />;
                })()}
                <div>
                  <p className="text-gray-900">{uploadedFile.name}</p>
                  <p className="text-gray-500 text-sm">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-violet-600" />
                </div>
                <div>
                  <p className="text-gray-900">Drag and drop your file here</p>
                  <p className="text-gray-500 text-sm">or click to browse</p>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg,.txt"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          {/* Rubric Selection */}
          <div className="space-y-2">
            <Label htmlFor="rubric-type">Rubric Type</Label>
            <Select value={rubricType} onValueChange={setRubricType}>
              <SelectTrigger id="rubric-type">
                <SelectValue placeholder="Select evaluation rubric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flowchart">Flowchart Evaluation</SelectItem>
                <SelectItem value="algorithm">Algorithm Evaluation</SelectItem>
                <SelectItem value="pseudocode">Pseudocode Evaluation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Configuration */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">AI Evaluation Mode</Label>
                <p className="text-xs text-gray-500 mt-1">
                  {hasApiKey() ? 'OpenRouter API configured' : 'Configure API key for real AI evaluation'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-real-ai"
                  checked={useRealAI && hasApiKey()}
                  onChange={(e) => setUseRealAI(e.target.checked)}
                  disabled={!hasApiKey()}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="use-real-ai" className="text-sm">
                  Use Real AI
                </Label>
              </div>
            </div>
            
            {!hasApiKey() && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <Settings className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Configure your OpenRouter API key in Settings to enable real AI evaluation
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            size="lg"
            disabled={!uploadedFile || !rubricType || isProcessing}
            onClick={handleSubmit}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit for Evaluation"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="border-gray-200 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900">Evaluation in Progress</p>
                  <p className="text-violet-600">{progress}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === processingStep;
                  const isComplete = index < processingStep;

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all
                          ${isActive 
                            ? "bg-violet-600 text-white animate-pulse" 
                            : isComplete 
                            ? "bg-emerald-500 text-white" 
                            : "bg-gray-200 text-gray-400"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={isActive ? "text-gray-900" : "text-gray-500"}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview Section */}
      {uploadedFile && !isProcessing && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
            <CardDescription>Preview of your uploaded document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
              {(() => {
                const Icon = getFileIcon(uploadedFile.name);
                return <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />;
              })()}
              <p className="text-gray-500">Preview not available</p>
              <p className="text-gray-400 text-sm mt-1">File will be processed upon submission</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
