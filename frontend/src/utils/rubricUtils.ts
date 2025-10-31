// Utility functions for rubrics integration

export interface RubricForAI {
  criteria: string[];
  specificInstructions: string;
}

/**
 * Get rubric data formatted for AI evaluation service
 */
export const getRubricForEvaluation = (rubricType: string): RubricForAI | null => {
  try {
    const storedRubrics = localStorage.getItem('rubiai_rubrics');
    if (storedRubrics) {
      const rubrics = JSON.parse(storedRubrics);
      const rubric = rubrics.find((r: any) => r.type === rubricType && r.status === 'active');
      
      if (rubric) {
        return {
          criteria: rubric.criteria.map((c: any) => `${c.name} (${c.weight}%): ${c.description}`),
          specificInstructions: rubric.description || `Evaluate based on the custom ${rubricType} rubric criteria.`
        };
      }
    }
  } catch (error) {
    console.error('Error loading rubric for evaluation:', error);
  }
  
  return null;
};

/**
 * Check if custom rubrics are available for a given type
 */
export const hasCustomRubric = (rubricType: string): boolean => {
  try {
    const storedRubrics = localStorage.getItem('rubiai_rubrics');
    if (storedRubrics) {
      const rubrics = JSON.parse(storedRubrics);
      return rubrics.some((r: any) => r.type === rubricType && r.status === 'active');
    }
  } catch (error) {
    console.error('Error checking for custom rubric:', error);
  }
  
  return false;
};