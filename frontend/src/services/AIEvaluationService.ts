// AI Evaluation Service using OpenRouter API

export interface EvaluationConfig {
  apiKey: string;
  model?: string;
  rubricType: 'flowchart' | 'algorithm' | 'pseudocode';
}

export interface FileContent {
  text?: string;
  imageData?: string;
  fileName: string;
  fileType: string;
}

class AIEvaluationService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private defaultModel: string;

  constructor(apiKey?: string) {
    // Priority: provided apiKey > user settings > environment variable
    this.apiKey = apiKey || this.getApiKey();
    this.defaultModel = this.getDefaultModel();
  }

  private getApiKey(): string {
    // 1. Check user settings first
    const userApiKey = localStorage.getItem('openrouter_api_key');
    if (userApiKey) {
      return userApiKey;
    }

    // 2. Fall back to environment variable
    const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (envApiKey && envApiKey !== 'your_openrouter_api_key_here') {
      return envApiKey;
    }

    throw new Error('No OpenRouter API key found. Please configure in Settings or .env file.');
  }

  private getDefaultModel(): string {
    // 1. Check user settings first
    const userModel = localStorage.getItem('openrouter_model');
    if (userModel) {
      return userModel;
    }

    // 2. Fall back to environment variable
    const envModel = import.meta.env.VITE_DEFAULT_AI_MODEL;
    if (envModel) {
      return envModel;
    }

    // 3. Default fallback
    return 'anthropic/claude-3.5-sonnet';
  }

  public updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
  }

  public updateModel(newModel: string): void {
    this.defaultModel = newModel;
  }

  /**
   * Extract text content from various file types
   */
  async extractFileContent(file: File): Promise<FileContent> {
    const fileName = file.name;
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      return this.extractPDFText(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractDocxText(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return this.extractPptxText(file);
    } else if (fileType.startsWith('image/')) {
      return this.extractImageContent(file);
    } else if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
      return this.extractTextContent(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Extract text from PDF using PDF.js (client-side)
   */
  private async extractPDFText(file: File): Promise<FileContent> {
    // Note: You'll need to install pdf-parse or pdfjs-dist
    // For now, return placeholder - implement with actual PDF parsing
    return {
      text: "PDF text extraction would be implemented here using pdf-parse or similar library",
      fileName: file.name,
      fileType: file.type
    };
  }

  /**
   * Extract text from DOCX files
   */
  private async extractDocxText(file: File): Promise<FileContent> {
    // Note: You'll need to install mammoth or similar library
    // For now, return placeholder
    return {
      text: "DOCX text extraction would be implemented here using mammoth.js",
      fileName: file.name,
      fileType: file.type
    };
  }

  /**
   * Extract text from PPTX files
   */
  private async extractPptxText(file: File): Promise<FileContent> {
    // Note: You'll need to install a PPTX parsing library
    return {
      text: "PPTX text extraction would be implemented here",
      fileName: file.name,
      fileType: file.type
    };
  }

  /**
   * Convert image to base64 for AI analysis
   */
  private async extractImageContent(file: File): Promise<FileContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve({
          imageData: base64,
          fileName: file.name,
          fileType: file.type
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract text from plain text files
   */
  private async extractTextContent(file: File): Promise<FileContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve({
          text: text,
          fileName: file.name,
          fileType: file.type
        });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Get rubric from browser storage
   */
  private getRubricFromStorage(rubricType: string) {
    try {
      const storedRubrics = localStorage.getItem('rubiai_rubrics');
      if (storedRubrics) {
        const rubrics = JSON.parse(storedRubrics);
        return rubrics.find((rubric: any) => rubric.type === rubricType && rubric.status === 'active');
      }
    } catch (error) {
      console.error('Error loading rubrics from storage:', error);
    }
    return null;
  }

  /**
   * Generate evaluation prompt based on rubric type
   */
  private generateEvaluationPrompt(rubricType: string, content: FileContent): string {
    const basePrompt = `You are an expert evaluator for computational thinking and algorithm design. 
    Analyze the provided ${rubricType} and provide a comprehensive evaluation.`;

    // Try to get rubric from browser storage first
    const storedRubric = this.getRubricFromStorage(rubricType);
    
    let rubric;
    if (storedRubric) {
      // Use rubric from storage
      rubric = {
        criteria: storedRubric.criteria.map((c: any) => `${c.name} (${c.weight}%): ${c.description}`),
        specificInstructions: `Evaluate based on the custom ${rubricType} rubric criteria defined by the user.`
      };
    } else {
      // Fallback to default hardcoded rubrics
      const defaultRubricCriteria = {
        flowchart: {
          criteria: [
            'Clarity & Readability (20%): Symbol usage, labeling, formatting',
            'Logical Flow (25%): Sequence, decision points, loop structures', 
            'Completeness (20%): Essential elements, edge cases, error handling',
            'Syntax & Standards (15%): Convention adherence, proper symbols',
            'Efficiency & Optimization (20%): Structure optimization, redundancy'
          ],
          specificInstructions: 'Focus on flowchart symbols, flow direction, decision logic, and overall algorithm structure.'
        },
        algorithm: {
          criteria: [
            'Clarity & Readability (20%): Code structure, naming, comments',
            'Logical Correctness (25%): Algorithm logic, edge case handling',
            'Completeness (20%): All required functionality, error handling',
            'Efficiency (15%): Time/space complexity, optimization',
            'Best Practices (20%): Coding standards, maintainability'
          ],
          specificInstructions: 'Evaluate the algorithm for correctness, efficiency, and adherence to best practices.'
        },
        pseudocode: {
          criteria: [
            'Clarity & Structure (20%): Clear syntax, proper indentation',
            'Logical Flow (25%): Step-by-step logic, control structures',
            'Completeness (20%): All necessary steps, initialization, termination',
            'Language Independence (15%): Generic constructs, clear operations',
            'Problem Solving (20%): Approach effectiveness, edge cases'
          ],
          specificInstructions: 'Focus on the logical structure and problem-solving approach, independent of specific programming languages.'
        }
      };
      
      rubric = defaultRubricCriteria[rubricType as keyof typeof defaultRubricCriteria];
    }
    
    return `${basePrompt}

RUBRIC CRITERIA:
${rubric.criteria.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

EVALUATION INSTRUCTIONS:
${rubric.specificInstructions}

Please provide your evaluation in the following JSON format:
{
  "overallScore": {
    "points": <total_points_earned>,
    "total": 100,
    "percentage": <percentage_score>,
    "grade": "<letter_grade>"
  },
  "criteriaScores": [
    {
      "criterion": "<criterion_name>",
      "weight": <weight_percentage>,
      "score": <points_earned>,
      "maxScore": <max_points>,
      "percentage": <criterion_percentage>,
      "status": "<excellent|good|fair|poor>",
      "feedback": "<detailed_feedback>"
    }
  ],
  "aiInsights": {
    "strengths": ["<strength1>", "<strength2>", ...],
    "improvements": ["<improvement1>", "<improvement2>", ...],
    "summary": "<overall_summary>"
  }
}

CONTENT TO EVALUATE:
${content.text || 'Image content - analyze the visual flowchart/algorithm/pseudocode'}`;
  }

  /**
   * Call OpenRouter API for evaluation
   */
  async evaluateContent(
    fileContent: FileContent, 
    rubricType: 'flowchart' | 'algorithm' | 'pseudocode',
    model?: string
  ): Promise<any> {
    const prompt = this.generateEvaluationPrompt(rubricType, fileContent);
    
    const messages = [];
    
    if (fileContent.imageData) {
      // For image content, use vision-capable models
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: fileContent.imageData
            }
          }
        ]
      });
    } else {
      // For text content
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    const requestBody = {
      model: model || this.defaultModel,
      messages: messages,
      max_tokens: 4000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'RubiAI Evaluator'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const evaluationResult = JSON.parse(data.choices[0].message.content);
      
      return evaluationResult;
    } catch (error) {
      console.error('AI Evaluation Error:', error);
      throw error;
    }
  }

  /**
   * Main evaluation function
   */
  async evaluate(
    file: File, 
    rubricType: 'flowchart' | 'algorithm' | 'pseudocode',
    model?: string
  ): Promise<any> {
    try {
      // Step 1: Extract content from file
      const fileContent = await this.extractFileContent(file);
      
      // Step 2: Evaluate with AI
      const evaluation = await this.evaluateContent(fileContent, rubricType, model);
      
      // Step 3: Add metadata
      return {
        ...evaluation,
        id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        fileType: file.type,
        rubricType,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Evaluation failed:', error);
      throw error;
    }
  }

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }
}

export default AIEvaluationService;