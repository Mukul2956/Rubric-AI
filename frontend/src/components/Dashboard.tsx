import { TrendingUp, FileCheck, Clock, Star, MessageSquare } from "lucide-react";
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { useSession } from "../contexts/SessionContext";



interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { evaluationResults, uploadedFiles } = useSession();

  const sessionStats = {
    totalEvaluations: evaluationResults.length,
    averageScore: evaluationResults.length > 0 
      ? Math.round(evaluationResults.reduce((sum, result) => sum + result.overallScore.percentage, 0) / evaluationResults.length)
      : 0,
    pendingUploads: uploadedFiles.filter(file => file.status === 'processing').length,
    completedEvaluations: uploadedFiles.filter(file => file.status === 'completed').length,
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-gray-900">RubiAI Evaluator</h1>
        <p className="text-gray-500">
          {evaluationResults.length > 0 
            ? `Current session: ${evaluationResults.length} evaluation${evaluationResults.length !== 1 ? 's' : ''} completed`
            : "Intelligent evaluation system for flowcharts, algorithms, and pseudocode"
          }
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Session Evaluations</CardTitle>
            <FileCheck className="w-4 h-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{sessionStats.totalEvaluations}</div>
            <p className="text-xs text-gray-500 mt-1">
              This session
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Average Score</CardTitle>
            <Star className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {sessionStats.averageScore > 0 ? `${sessionStats.averageScore}%` : '--'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Session average
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Processing</CardTitle>
            <Clock className="w-4 h-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{sessionStats.pendingUploads}</div>
            <p className="text-xs text-gray-500 mt-1">
              Files in queue
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Completed</CardTitle>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{sessionStats.completedEvaluations}</div>
            <p className="text-xs text-gray-500 mt-1">
              Files evaluated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Features */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>System Capabilities</CardTitle>
          <CardDescription>Advanced features for intelligent evaluation</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Multi-Format Parser</h3>
              <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, PPTX, TXT, PNG, and JPG formats for comprehensive document analysis.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rubric-Based Evaluation</h3>
              <p className="text-sm text-gray-500 mt-1">Predefined rubrics ensure consistent and accurate assessment criteria.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Instant Feedback</h3>
              <p className="text-sm text-gray-500 mt-1">Real-time evaluation with detailed feedback and improvement suggestions.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Language Agnostic</h3>
              <p className="text-sm text-gray-500 mt-1">Evaluates pseudocode written in different styles and conventions.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">LMS Integration</h3>
              <p className="text-sm text-gray-500 mt-1">Seamless integration with learning management systems for educational use.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Data Storage</h3>
              <p className="text-sm text-gray-500 mt-1">Stateless evaluation - no user profiles or persistent data storage required.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to evaluate your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 font-semibold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Upload Your File</h3>
              <p className="text-sm text-gray-500">Choose your flowchart, algorithm, or pseudocode file in supported formats.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 font-semibold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Select Rubric</h3>
              <p className="text-sm text-gray-500">Choose the appropriate evaluation rubric for your submission type.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 font-semibold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Get Instant Feedback</h3>
              <p className="text-sm text-gray-500">Receive detailed evaluation results and improvement suggestions.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={() => onNavigate?.('upload')}
            >
              Start Evaluation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Session Evaluations */}
      {evaluationResults.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Recent Evaluations</CardTitle>
            <CardDescription>Your latest evaluation results from this session</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationResults.slice(0, 5).map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.filename}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">
                        {result.rubricType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={
                        result.overallScore.percentage >= 85 ? "text-emerald-600" : 
                        result.overallScore.percentage >= 70 ? "text-amber-600" : 
                        "text-red-600"
                      }>
                        {result.overallScore.percentage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        result.overallScore.percentage >= 85 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : 
                        result.overallScore.percentage >= 70 ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : 
                        "bg-red-100 text-red-700 hover:bg-red-100"
                      }>
                        {result.overallScore.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onNavigate?.('evaluation')}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
