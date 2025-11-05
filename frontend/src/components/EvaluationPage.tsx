import { Download, RefreshCw, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Progress } from "./ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { useSession } from "../contexts/SessionContext";
import { useState } from "react";
import { toast } from "sonner";
import AIEvaluationService from "../services/AIEvaluationService";



export function ResultsPage() {
  const { currentEvaluation, evaluationResults, addEvaluationResult, uploadedFiles, setCurrentEvaluation } = useSession();
  const [isReEvaluating, setIsReEvaluating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Use current evaluation or the most recent one
  const evaluation = currentEvaluation || evaluationResults[0];
  
  if (!evaluation) {
    return (
      <div className="p-8 space-y-8">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Evaluations Yet</h2>
          <p className="text-gray-500 mb-6">Upload a file to see your evaluation results here.</p>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            Start Evaluation
          </Button>
        </div>
      </div>
    );
  }

  const radarData = evaluation.criteriaScores.map(criteria => ({
    criterion: criteria.criterion.split(' ')[0], // Shorten for display
    score: criteria.percentage,
    fullMark: 100
  }));

  // Generate HTML Report
  const generateHTMLReport = () => {
    const date = new Date(evaluation.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RubiAI Evaluation Report - ${evaluation.filename}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #1f2937; }
        .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .metadata { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metadata-item { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; }
        .metadata-item label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .metadata-item span { display: block; margin-top: 5px; font-weight: 500; }
        .score-section { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
        .score-circle { text-align: center; margin-bottom: 20px; }
        .score-value { font-size: 48px; font-weight: 700; color: #0ea5e9; }
        .score-grade { font-size: 20px; color: #6b7280; margin-top: 5px; }
        .criteria-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .criteria-table th, .criteria-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .criteria-table th { background: #f8fafc; font-weight: 600; color: #374151; }
        .status-excellent { color: #059669; font-weight: 600; }
        .status-good { color: #0ea5e9; font-weight: 600; }
        .status-fair { color: #d97706; font-weight: 600; }
        .status-poor { color: #dc2626; font-weight: 600; }
        .insights-section { background: #faf5ff; border: 1px solid #a855f7; border-radius: 12px; padding: 25px; margin: 20px 0; }
        .insights-section h3 { color: #7c3aed; margin-top: 0; }
        .insights-list { margin: 10px 0; }
        .insights-list li { margin: 8px 0; }
        .summary-text { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin-top: 15px; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; color: #6b7280; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 RubiAI Evaluation Report</h1>
        <p>Intelligent Assessment Results for ${evaluation.filename}</p>
    </div>

    <div class="metadata">
        <div class="metadata-item">
            <label>Filename</label>
            <span>${evaluation.filename}</span>
        </div>
        <div class="metadata-item">
            <label>File Type</label>
            <span>${evaluation.fileType}</span>
        </div>
        <div class="metadata-item">
            <label>Rubric Type</label>
            <span>${evaluation.rubricType.charAt(0).toUpperCase() + evaluation.rubricType.slice(1)}</span>
        </div>
        <div class="metadata-item">
            <label>Evaluated On</label>
            <span>${date}</span>
        </div>
    </div>

    <div class="score-section">
        <div class="score-circle">
            <div class="score-value">${evaluation.overallScore.percentage}%</div>
            <div class="score-grade">Grade: ${evaluation.overallScore.grade}</div>
            <p style="margin-top: 10px; color: #6b7280;">
                ${evaluation.overallScore.points} out of ${evaluation.overallScore.total} points
            </p>
        </div>
    </div>

    <h2>📊 Detailed Criteria Breakdown</h2>
    <table class="criteria-table">
        <thead>
            <tr>
                <th>Criterion</th>
                <th>Weight</th>
                <th>Score</th>
                <th>Status</th>
                <th>AI Feedback</th>
            </tr>
        </thead>
        <tbody>
            ${evaluation.criteriaScores.map(criteria => `
                <tr>
                    <td><strong>${criteria.criterion}</strong></td>
                    <td>${criteria.weight}%</td>
                    <td>${criteria.score}/${criteria.maxScore} (${criteria.percentage}%)</td>
                    <td><span class="status-${criteria.status}">${criteria.status.charAt(0).toUpperCase() + criteria.status.slice(1)}</span></td>
                    <td>${criteria.feedback}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="insights-section">
        <h3>🤖 AI Insights & Recommendations</h3>
        
        <h4>✅ Strengths Identified</h4>
        <ul class="insights-list">
            ${evaluation.aiInsights.strengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>

        <h4>🔧 Areas for Improvement</h4>
        <ul class="insights-list">
            ${evaluation.aiInsights.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
        </ul>

        <div class="summary-text">
            <h4>📝 AI Summary</h4>
            <p>${evaluation.aiInsights.summary}</p>
        </div>
    </div>

    <div class="footer">
        <p>📄 Report generated by RubiAI on ${generatedDate}</p>
        <p style="font-size: 12px; margin-top: 10px;">
            This report was generated using AI-powered evaluation technology.<br>
            For questions or support, visit <strong>github.com/Mukul2956/Rubric-AI</strong>
        </p>
    </div>
</body>
</html>`;
  };

  // Download Report Function
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      // Generate HTML report
      const htmlContent = generateHTMLReport();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      const baseFilename = evaluation.filename.replace(/\.[^/.]+$/, "");
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `RubiAI_Report_${baseFilename}_${dateStr}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("Evaluation report downloaded successfully! Open the HTML file in your browser to view or print.");
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error("Failed to download report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Re-evaluate Function
  const handleReEvaluate = async () => {
    setIsReEvaluating(true);
    try {
      // Find the original uploaded file
      const originalFile = uploadedFiles.find(file => file.evaluationId === evaluation.id);
      
      if (!originalFile) {
        toast.error("Original file not found. Please upload the file again.");
        return;
      }

      toast.info("Starting re-evaluation...");

      // Check if API key is available
      const apiKey = localStorage.getItem('openrouter_api_key') || 
                    import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
        // Perform mock re-evaluation
        const mockResult = {
          id: `eval_${Date.now()}`,
          filename: evaluation.filename,
          fileType: evaluation.fileType,
          rubricType: evaluation.rubricType,
          timestamp: new Date().toISOString(),
          overallScore: {
            points: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
            total: 100,
            percentage: Math.floor(Math.random() * 20) + 80,
            grade: 'A-'
          },
          criteriaScores: evaluation.criteriaScores.map(criteria => ({
            ...criteria,
            score: Math.max(1, criteria.score + (Math.random() * 4 - 2)), // Slight variation
            percentage: Math.max(1, criteria.percentage + (Math.random() * 4 - 2))
          })),
          aiInsights: {
            strengths: [
              "Re-evaluated content shows consistent quality",
              "Maintained strong structural elements",
              "Clear improvement in specific areas identified"
            ],
            improvements: [
              "Consider implementing feedback from previous evaluation",
              "Further optimization opportunities identified",
              "Enhanced documentation could improve clarity"
            ],
            summary: "Re-evaluation shows consistent performance with minor variations. This is a mock re-evaluation - configure OpenRouter API key for real AI analysis."
          }
        };

        // Add new evaluation result
        addEvaluationResult(mockResult);
        setCurrentEvaluation(mockResult);
        
        toast.success("Mock re-evaluation completed! Configure API key for real AI analysis.");
      } else {
        // Perform real AI re-evaluation
        const aiService = new AIEvaluationService();
        const result = await aiService.evaluate(
          originalFile.file,
          evaluation.rubricType as 'flowchart' | 'algorithm' | 'pseudocode'
        );

        const newEvaluationResult = {
          ...result,
          id: `eval_${Date.now()}`,
        };

        // Add new evaluation result
        addEvaluationResult(newEvaluationResult);
        setCurrentEvaluation(newEvaluationResult);
        
        toast.success("Re-evaluation completed successfully!");
      }
    } catch (error) {
      console.error('Error during re-evaluation:', error);
      toast.error("Re-evaluation failed. Please try again.");
    } finally {
      setIsReEvaluating(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Evaluation Results</h1>
          <p className="text-gray-500">Detailed feedback and scoring for: {evaluation.filename}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleReEvaluate}
            disabled={isReEvaluating}
          >
            <RefreshCw className={`w-4 h-4 ${isReEvaluating ? 'animate-spin' : ''}`} />
            {isReEvaluating ? 'Re-evaluating...' : 'Re-evaluate'}
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </Button>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-gray-200 lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Your evaluation summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - evaluation.overallScore.percentage / 100)}`}
                      className="text-violet-600 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-gray-900">{evaluation.overallScore.percentage}%</span>
                    <span className="text-gray-500 text-xs">Grade: {evaluation.overallScore.grade}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Points</span>
                  <span className="text-gray-900">{evaluation.overallScore.points} / {evaluation.overallScore.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Evaluated On</span>
                  <span className="text-gray-900">{new Date(evaluation.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rubric Type</span>
                  <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">
                    {evaluation.rubricType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Visual representation of your scores across criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "hsl(262, 83%, 58%)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="criterion" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(262, 83%, 58%)"
                    fill="hsl(262, 83%, 58%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Detailed Rubric Feedback</CardTitle>
          <CardDescription>AI-generated assessment for each evaluation criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Criterion</TableHead>
                <TableHead className="w-[100px]">Weight</TableHead>
                <TableHead>AI Feedback</TableHead>
                <TableHead className="w-[120px]">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluation.criteriaScores.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.status === "excellent" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : item.status === "good" ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <span>{item.criterion}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.weight}%</TableCell>
                  <TableCell>
                    <p className="text-gray-700 text-sm">{item.feedback}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={
                          item.status === "excellent" ? "text-emerald-600" :
                          item.status === "good" ? "text-sky-600" :
                          "text-amber-600"
                        }>
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <Progress 
                        value={(item.score / item.maxScore) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-900 mb-2">Strengths</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {evaluation.aiInsights.strengths.map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {evaluation.aiInsights.improvements.map((improvement, index) => (
                  <li key={index}>• {improvement}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">AI Summary</h4>
              <p className="text-gray-700 text-sm">{evaluation.aiInsights.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
