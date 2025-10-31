import { useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { useRubrics } from "../contexts/RubricsContext";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";



export function RubricsPage() {
  const { rubrics, getRubricById, updateRubric, deleteRubric, addCriterion, updateCriterion, deleteCriterion } = useRubrics();
  const [selectedRubric, setSelectedRubric] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditRubricOpen, setIsEditRubricOpen] = useState(false);
  const [isEditCriterionOpen, setIsEditCriterionOpen] = useState(false);
  const [editingRubricId, setEditingRubricId] = useState<string | null>(null);
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);
  const [editRubricForm, setEditRubricForm] = useState<{ name: string; description: string; type: 'flowchart' | 'algorithm' | 'pseudocode' | 'custom'; status: 'active' | 'draft' }>({ name: '', description: '', type: 'flowchart', status: 'active' });
  const [editCriterionForm, setEditCriterionForm] = useState({ name: '', weight: 0, description: '' });

  // Handle rubric editing
  const handleEditRubric = (rubricId: string) => {
    const rubric = getRubricById(rubricId);
    if (rubric) {
      setEditingRubricId(rubricId);
      setEditRubricForm({
        name: rubric.name,
        description: rubric.description,
        type: rubric.type,
        status: rubric.status
      });
      setIsEditRubricOpen(true);
    }
  };

  const handleSaveRubric = () => {
    if (editingRubricId) {
      updateRubric(editingRubricId, editRubricForm);
      setIsEditRubricOpen(false);
      setEditingRubricId(null);
      toast.success('Rubric updated successfully!');
    }
  };

  // Handle criterion editing
  const handleEditCriterion = (criterionId: string) => {
    if (selectedRubric) {
      const rubric = getRubricById(selectedRubric);
      const criterion = rubric?.criteria.find(c => c.id === criterionId);
      if (criterion) {
        setEditingCriterionId(criterionId);
        setEditCriterionForm({
          name: criterion.name,
          weight: criterion.weight,
          description: criterion.description
        });
        setIsEditCriterionOpen(true);
      }
    }
  };

  const handleSaveCriterion = () => {
    if (selectedRubric && editingCriterionId) {
      updateCriterion(selectedRubric, editingCriterionId, editCriterionForm);
      setIsEditCriterionOpen(false);
      setEditingCriterionId(null);
      toast.success('Criterion updated successfully!');
    }
  };

  const handleDeleteCriterion = (criterionId: string) => {
    if (selectedRubric && window.confirm('Are you sure you want to delete this criterion?')) {
      deleteCriterion(selectedRubric, criterionId);
      toast.success('Criterion deleted successfully!');
    }
  };

  const handleDeleteRubric = (rubricId: string) => {
    if (window.confirm('Are you sure you want to delete this rubric?')) {
      deleteRubric(rubricId);
      if (selectedRubric === rubricId) {
        setSelectedRubric(null);
      }
      toast.success('Rubric deleted successfully!');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Rubrics Management</h1>
          <p className="text-gray-500">Create and manage evaluation rubrics and criteria</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              <Plus className="w-4 h-4" />
              Add New Rubric
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Rubric</DialogTitle>
              <DialogDescription>Create a new evaluation rubric with custom criteria</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rubric-name">Rubric Name</Label>
                <Input id="rubric-name" placeholder="e.g., Algorithm Evaluation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rubric-description">Description</Label>
                <Textarea 
                  id="rubric-description" 
                  placeholder="Describe the purpose and scope of this rubric..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rubric-type">Evaluation Type</Label>
                <Select>
                  <SelectTrigger id="rubric-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowchart">Flowchart</SelectItem>
                    <SelectItem value="algorithm">Algorithm</SelectItem>
                    <SelectItem value="pseudocode">Pseudocode</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <Save className="w-4 h-4 mr-2" />
                Create Rubric
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Rubric Dialog */}
        <Dialog open={isEditRubricOpen} onOpenChange={setIsEditRubricOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Rubric</DialogTitle>
              <DialogDescription>Modify the rubric details and settings</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-rubric-name">Rubric Name</Label>
                <Input 
                  id="edit-rubric-name" 
                  value={editRubricForm.name}
                  onChange={(e) => setEditRubricForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rubric-description">Description</Label>
                <Textarea 
                  id="edit-rubric-description" 
                  value={editRubricForm.description}
                  onChange={(e) => setEditRubricForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-rubric-type">Evaluation Type</Label>
                  <Select 
                    value={editRubricForm.type} 
                    onValueChange={(value: 'flowchart' | 'algorithm' | 'pseudocode' | 'custom') => 
                      setEditRubricForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger id="edit-rubric-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flowchart">Flowchart</SelectItem>
                      <SelectItem value="algorithm">Algorithm</SelectItem>
                      <SelectItem value="pseudocode">Pseudocode</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rubric-status">Status</Label>
                  <Select 
                    value={editRubricForm.status} 
                    onValueChange={(value: 'active' | 'draft') => 
                      setEditRubricForm(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="edit-rubric-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRubricOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRubric} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rubrics List */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Evaluation Rubrics</CardTitle>
          <CardDescription>Manage your assessment rubrics and criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rubric Name</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Total Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubrics.map((rubric) => (
                <TableRow 
                  key={rubric.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedRubric(rubric.id)}
                >
                  <TableCell>{rubric.name}</TableCell>
                  <TableCell className="text-gray-600">{rubric.criteria.length} criteria</TableCell>
                  <TableCell className="text-gray-600">{rubric.criteria.reduce((sum, c) => sum + c.weight, 0)}%</TableCell>
                  <TableCell>
                    {rubric.status === "active" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500">{new Date(rubric.lastModified).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEditRubric(rubric.id);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDeleteRubric(rubric.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Criteria Details */}
      {selectedRubric && (
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rubric Criteria</CardTitle>
                <CardDescription>Detailed criteria for {selectedRubric ? getRubricById(selectedRubric)?.name : ''}</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Criterion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Criterion</DialogTitle>
                    <DialogDescription>Define a new evaluation criterion</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="criterion-name">Criterion Name</Label>
                      <Input id="criterion-name" placeholder="e.g., Code Efficiency" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criterion-weight">Weight (%)</Label>
                      <Input id="criterion-weight" type="number" placeholder="e.g., 20" min="0" max="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criterion-description">Description</Label>
                      <Textarea 
                        id="criterion-description" 
                        placeholder="Describe what this criterion evaluates..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                      <Save className="w-4 h-4 mr-2" />
                      Add Criterion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Criterion Dialog */}
              <Dialog open={isEditCriterionOpen} onOpenChange={setIsEditCriterionOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Criterion</DialogTitle>
                    <DialogDescription>Modify the evaluation criterion</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-criterion-name">Criterion Name</Label>
                      <Input 
                        id="edit-criterion-name" 
                        value={editCriterionForm.name}
                        onChange={(e) => setEditCriterionForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-criterion-weight">Weight (%)</Label>
                      <Input 
                        id="edit-criterion-weight" 
                        type="number" 
                        min="0" 
                        max="100"
                        value={editCriterionForm.weight}
                        onChange={(e) => setEditCriterionForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-criterion-description">Description</Label>
                      <Textarea 
                        id="edit-criterion-description" 
                        value={editCriterionForm.description}
                        onChange={(e) => setEditCriterionForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditCriterionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCriterion} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedRubric && getRubricById(selectedRubric)?.criteria.map((criterion, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border border-gray-200 hover:border-violet-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{criterion.name}</h4>
                        <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">
                          {criterion.weight}%
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{criterion.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCriterion(criterion.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCriterion(criterion.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
