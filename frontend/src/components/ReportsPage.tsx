import { Download, Eye, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const reports = [
  {
    id: 1,
    filename: "sorting_algorithm.pdf",
    type: "Algorithm",
    totalScore: 92,
    grade: "A",
    evaluatedOn: "Oct 31, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 2,
    filename: "flowchart_system.png",
    type: "Flowchart",
    totalScore: 85,
    grade: "B+",
    evaluatedOn: "Oct 30, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 3,
    filename: "pseudocode_search.docx",
    type: "Pseudocode",
    totalScore: 78,
    grade: "B-",
    evaluatedOn: "Oct 29, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 4,
    filename: "binary_tree.pdf",
    type: "Algorithm",
    totalScore: 88,
    grade: "A-",
    evaluatedOn: "Oct 28, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 5,
    filename: "login_flow.png",
    type: "Flowchart",
    totalScore: 91,
    grade: "A",
    evaluatedOn: "Oct 27, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 6,
    filename: "quicksort_pseudo.docx",
    type: "Pseudocode",
    totalScore: 82,
    grade: "B",
    evaluatedOn: "Oct 26, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 7,
    filename: "database_design.pdf",
    type: "Flowchart",
    totalScore: 87,
    grade: "B+",
    evaluatedOn: "Oct 25, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 8,
    filename: "merge_sort.pdf",
    type: "Algorithm",
    totalScore: 94,
    grade: "A",
    evaluatedOn: "Oct 24, 2025",
    evaluatedBy: "Dr. Sarah Johnson",
    status: "completed"
  },
];

export function ReportsPage() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 80) return "text-sky-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    if (grade.startsWith("B")) return "bg-sky-100 text-sky-700 hover:bg-sky-100";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    return "bg-red-100 text-red-700 hover:bg-red-100";
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-gray-900">Evaluation Reports</h1>
        <p className="text-gray-500">View and download all past evaluation reports</p>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input placeholder="Search by filename..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flowchart">Flowchart</SelectItem>
                <SelectItem value="algorithm">Algorithm</SelectItem>
                <SelectItem value="pseudocode">Pseudocode</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Score</SelectItem>
                <SelectItem value="lowest">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{report.filename}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3" />
                    {report.evaluatedOn}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50 shrink-0">
                  {report.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Score</p>
                  <p className={`${getScoreColor(report.totalScore)}`}>{report.totalScore}%</p>
                </div>
                <Badge className={getGradeBadge(report.grade)}>
                  Grade: {report.grade}
                </Badge>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-500 text-xs mb-1">Evaluated by</p>
                <p className="text-gray-700 text-sm">{report.evaluatedBy}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card className="border-gray-200 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
          <CardDescription>Overview of all evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Total Reports</p>
              <p className="text-gray-900 mt-1">{reports.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-gray-900 mt-1">
                {Math.round(reports.reduce((sum, r) => sum + r.totalScore, 0) / reports.length)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Highest Score</p>
              <p className="text-emerald-600 mt-1">
                {Math.max(...reports.map(r => r.totalScore))}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Most Common Type</p>
              <p className="text-gray-900 mt-1">Algorithm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
