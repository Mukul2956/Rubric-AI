import React, { createContext, useContext, useEffect, useState } from 'react';

// =============================================
// Type Definitions
// =============================================

export interface EvaluationResult {
  id: string;
  filename: string;
  fileType: string;
  rubricType: string;
  timestamp: string;
  overallScore: {
    points: number;
    total: number;
    percentage: number;
    grade: string;
  };
  criteriaScores: Array<{
    criterion: string;
    weight: number;
    score: number;
    maxScore: number;
    percentage: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    feedback: string;
  }>;
  aiInsights: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}

export interface UploadedFile {
  id: string;
  file: File;
  rubricType: string;
  uploadTime: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  evaluationId?: string;
}

interface SessionContextType {
  evaluationResults: EvaluationResult[];
  uploadedFiles: UploadedFile[];
  currentEvaluation: EvaluationResult | null;
  addEvaluationResult: (result: EvaluationResult) => void;
  addUploadedFile: (file: UploadedFile) => void;
  updateFileStatus: (fileId: string, status: UploadedFile['status'], evaluationId?: string) => void;
  setCurrentEvaluation: (result: EvaluationResult | null) => void;
  clearSession: () => void;
  getEvaluationById: (id: string) => EvaluationResult | undefined;
}

// =============================================
// Context Creation & Hook
// =============================================

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// =============================================
// Session Provider Component
// =============================================

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);

  // =============================================
  // Session Storage Management
  // =============================================

  // Load data from sessionStorage on mount
  useEffect(() => {
    try {
      const storedResults = sessionStorage.getItem('rubiai_evaluation_results');
      const storedFiles = sessionStorage.getItem('rubiai_uploaded_files');
      const storedCurrent = sessionStorage.getItem('rubiai_current_evaluation');

      if (storedResults) {
        setEvaluationResults(JSON.parse(storedResults));
      }
      if (storedFiles) {
        // Note: Files can't be serialized, so we only store metadata
        setUploadedFiles(JSON.parse(storedFiles));
      }
      if (storedCurrent) {
        setCurrentEvaluation(JSON.parse(storedCurrent));
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  }, []);

  // Save data to sessionStorage whenever state changes
  useEffect(() => {
    try {
      sessionStorage.setItem('rubiai_evaluation_results', JSON.stringify(evaluationResults));
    } catch (error) {
      console.error('Error saving evaluation results:', error);
    }
  }, [evaluationResults]);

  useEffect(() => {
    try {
      // Only save file metadata, not the actual File object
      const fileMetadata = uploadedFiles.map(({ file, ...metadata }) => ({
        ...metadata,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }));
      sessionStorage.setItem('rubiai_uploaded_files', JSON.stringify(fileMetadata));
    } catch (error) {
      console.error('Error saving uploaded files:', error);
    }
  }, [uploadedFiles]);

  useEffect(() => {
    try {
      if (currentEvaluation) {
        sessionStorage.setItem('rubiai_current_evaluation', JSON.stringify(currentEvaluation));
      } else {
        sessionStorage.removeItem('rubiai_current_evaluation');
      }
    } catch (error) {
      console.error('Error saving current evaluation:', error);
    }
  }, [currentEvaluation]);

  // =============================================
  // Context Methods
  // =============================================

  const addEvaluationResult = (result: EvaluationResult) => {
    setEvaluationResults(prev => {
      const updated = [result, ...prev];
      return updated.slice(0, 50); // Keep only last 50 evaluations
    });
  };

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => {
      const updated = [file, ...prev];
      return updated.slice(0, 20); // Keep only last 20 files
    });
  };

  const updateFileStatus = (fileId: string, status: UploadedFile['status'], evaluationId?: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, status, evaluationId }
          : file
      )
    );
  };

  const clearSession = () => {
    setEvaluationResults([]);
    setUploadedFiles([]);
    setCurrentEvaluation(null);
    sessionStorage.removeItem('rubiai_evaluation_results');
    sessionStorage.removeItem('rubiai_uploaded_files');
    sessionStorage.removeItem('rubiai_current_evaluation');
  };

  const getEvaluationById = (id: string) => {
    return evaluationResults.find(result => result.id === id);
  };

  // =============================================
  // Provider Value & Render
  // =============================================

  const value: SessionContextType = {
    evaluationResults,
    uploadedFiles,
    currentEvaluation,
    addEvaluationResult,
    addUploadedFile,
    updateFileStatus,
    setCurrentEvaluation,
    clearSession,
    getEvaluationById,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};