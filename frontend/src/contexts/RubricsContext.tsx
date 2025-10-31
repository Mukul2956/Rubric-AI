import React, { createContext, useContext, useEffect, useState } from 'react';

// =============================================
// Type Definitions
// =============================================

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface Rubric {
  id: string;
  name: string;
  description: string;
  type: 'flowchart' | 'algorithm' | 'pseudocode' | 'custom';
  criteria: RubricCriterion[];
  status: 'active' | 'draft';
  lastModified: string;
  createdAt: string;
}

interface RubricsContextType {
  rubrics: Rubric[];
  addRubric: (rubric: Omit<Rubric, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateRubric: (id: string, updates: Partial<Rubric>) => void;
  deleteRubric: (id: string) => void;
  getRubricByType: (type: string) => Rubric | undefined;
  getRubricById: (id: string) => Rubric | undefined;
  addCriterion: (rubricId: string, criterion: Omit<RubricCriterion, 'id'>) => void;
  updateCriterion: (rubricId: string, criterionId: string, updates: Partial<RubricCriterion>) => void;
  deleteCriterion: (rubricId: string, criterionId: string) => void;
}

// =============================================
// Context Creation & Hook
// =============================================

const RubricsContext = createContext<RubricsContextType | undefined>(undefined);

export const useRubrics = () => {
  const context = useContext(RubricsContext);
  if (!context) {
    throw new Error('useRubrics must be used within a RubricsProvider');
  }
  return context;
};

// =============================================
// Default Rubrics Data
// =============================================

const getDefaultRubrics = (): Rubric[] => [
  {
    id: '1',
    name: 'Flowchart Evaluation',
    description: 'Comprehensive evaluation criteria for flowchart analysis',
    type: 'flowchart',
    status: 'active',
    createdAt: '2025-10-20T00:00:00Z',
    lastModified: '2025-10-28T00:00:00Z',
    criteria: [
      {
        id: '1-1',
        name: 'Clarity & Readability',
        weight: 20,
        description: 'Symbol usage, labeling, formatting, and overall visual clarity'
      },
      {
        id: '1-2',
        name: 'Logical Flow',
        weight: 25,
        description: 'Sequence correctness, decision points, and loop structures'
      },
      {
        id: '1-3',
        name: 'Completeness',
        weight: 20,
        description: 'Essential elements, edge cases, and error handling coverage'
      },
      {
        id: '1-4',
        name: 'Syntax & Standards',
        weight: 15,
        description: 'Convention adherence and proper symbol usage'
      },
      {
        id: '1-5',
        name: 'Efficiency & Optimization',
        weight: 20,
        description: 'Structure optimization and redundancy elimination'
      }
    ]
  },
  {
    id: '2',
    name: 'Algorithm Evaluation',
    description: 'Detailed assessment criteria for algorithm implementation',
    type: 'algorithm',
    status: 'active',
    createdAt: '2025-10-20T00:00:00Z',
    lastModified: '2025-10-25T00:00:00Z',
    criteria: [
      {
        id: '2-1',
        name: 'Clarity & Readability',
        weight: 20,
        description: 'Code structure, naming conventions, and documentation'
      },
      {
        id: '2-2',
        name: 'Logical Correctness',
        weight: 25,
        description: 'Algorithm logic validity and edge case handling'
      },
      {
        id: '2-3',
        name: 'Completeness',
        weight: 20,
        description: 'All required functionality and comprehensive error handling'
      },
      {
        id: '2-4',
        name: 'Efficiency',
        weight: 15,
        description: 'Time and space complexity optimization'
      },
      {
        id: '2-5',
        name: 'Best Practices',
        weight: 20,
        description: 'Coding standards adherence and maintainability'
      }
    ]
  },
  {
    id: '3',
    name: 'Pseudocode Evaluation',
    description: 'Assessment framework for pseudocode quality and structure',
    type: 'pseudocode',
    status: 'active',
    createdAt: '2025-10-20T00:00:00Z',
    lastModified: '2025-10-20T00:00:00Z',
    criteria: [
      {
        id: '3-1',
        name: 'Clarity & Structure',
        weight: 20,
        description: 'Clear syntax and proper indentation patterns'
      },
      {
        id: '3-2',
        name: 'Logical Flow',
        weight: 25,
        description: 'Step-by-step logic and control structure usage'
      },
      {
        id: '3-3',
        name: 'Completeness',
        weight: 20,
        description: 'All necessary steps, initialization, and termination'
      },
      {
        id: '3-4',
        name: 'Language Independence',
        weight: 15,
        description: 'Generic constructs and clear operation descriptions'
      },
      {
        id: '3-5',
        name: 'Problem Solving',
        weight: 20,
        description: 'Approach effectiveness and edge case consideration'
      }
    ]
  }
];

// =============================================
// Rubrics Provider Component
// =============================================

export const RubricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);

  // =============================================
  // Browser Storage Management
  // =============================================

  // Load rubrics from localStorage on mount
  useEffect(() => {
    try {
      const storedRubrics = localStorage.getItem('rubiai_rubrics');
      if (storedRubrics) {
        setRubrics(JSON.parse(storedRubrics));
      } else {
        // Initialize with default rubrics if none exist
        const defaultRubrics = getDefaultRubrics();
        setRubrics(defaultRubrics);
        localStorage.setItem('rubiai_rubrics', JSON.stringify(defaultRubrics));
      }
    } catch (error) {
      console.error('Error loading rubrics from storage:', error);
      // Fallback to default rubrics
      setRubrics(getDefaultRubrics());
    }
  }, []);

  // Save rubrics to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('rubiai_rubrics', JSON.stringify(rubrics));
    } catch (error) {
      console.error('Error saving rubrics to storage:', error);
    }
  }, [rubrics]);

  // =============================================
  // Rubric Management Functions
  // =============================================

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addRubric = (rubricData: Omit<Rubric, 'id' | 'createdAt' | 'lastModified'>) => {
    const newRubric: Rubric = {
      ...rubricData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setRubrics(prev => [...prev, newRubric]);
  };

  const updateRubric = (id: string, updates: Partial<Rubric>) => {
    setRubrics(prev => prev.map(rubric => 
      rubric.id === id 
        ? { ...rubric, ...updates, lastModified: new Date().toISOString() }
        : rubric
    ));
  };

  const deleteRubric = (id: string) => {
    setRubrics(prev => prev.filter(rubric => rubric.id !== id));
  };

  const getRubricByType = (type: string) => {
    return rubrics.find(rubric => rubric.type === type && rubric.status === 'active');
  };

  const getRubricById = (id: string) => {
    return rubrics.find(rubric => rubric.id === id);
  };

  // =============================================
  // Criterion Management Functions
  // =============================================

  const addCriterion = (rubricId: string, criterionData: Omit<RubricCriterion, 'id'>) => {
    const newCriterion: RubricCriterion = {
      ...criterionData,
      id: generateId(),
    };

    setRubrics(prev => prev.map(rubric => 
      rubric.id === rubricId
        ? { 
            ...rubric, 
            criteria: [...rubric.criteria, newCriterion],
            lastModified: new Date().toISOString()
          }
        : rubric
    ));
  };

  const updateCriterion = (rubricId: string, criterionId: string, updates: Partial<RubricCriterion>) => {
    setRubrics(prev => prev.map(rubric => 
      rubric.id === rubricId
        ? {
            ...rubric,
            criteria: rubric.criteria.map(criterion =>
              criterion.id === criterionId ? { ...criterion, ...updates } : criterion
            ),
            lastModified: new Date().toISOString()
          }
        : rubric
    ));
  };

  const deleteCriterion = (rubricId: string, criterionId: string) => {
    setRubrics(prev => prev.map(rubric => 
      rubric.id === rubricId
        ? {
            ...rubric,
            criteria: rubric.criteria.filter(criterion => criterion.id !== criterionId),
            lastModified: new Date().toISOString()
          }
        : rubric
    ));
  };

  // =============================================
  // Provider Value & Render
  // =============================================

  const value: RubricsContextType = {
    rubrics,
    addRubric,
    updateRubric,
    deleteRubric,
    getRubricByType,
    getRubricById,
    addCriterion,
    updateCriterion,
    deleteCriterion,
  };

  return (
    <RubricsContext.Provider value={value}>
      {children}
    </RubricsContext.Provider>
  );
};