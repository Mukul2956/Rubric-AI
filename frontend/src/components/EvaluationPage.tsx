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



export function ResultsPage() {
  const { currentEvaluation, evaluationResults } = useSession();
  
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

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Evaluation Results</h1>
          <p className="text-gray-500">Detailed feedback and scoring for: {evaluation.filename}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Re-evaluate
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Download className="w-4 h-4" />
            Download Report
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
