# AI Evaluation Integration Guide

## Overview
Your RubiAI system now supports real AI-powered evaluation using OpenRouter API, which provides access to multiple state-of-the-art AI models including GPT-4, Claude, and others.

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-or-v1-...`)

### 2. Configure in RubiAI
1. Go to **Settings** in your RubiAI application
2. Paste your API key in the "OpenRouter API Configuration" section
3. Click **Save** to store the key
4. Click **Test Connection** to verify it works
5. You should see available models listed

### 3. Enable AI Evaluation
1. Go to the **Evaluate** page
2. Upload your file (PDF, DOCX, PPTX, PNG, JPG)
3. Select the appropriate rubric type
4. Check the **"Use Real AI"** checkbox in the AI Configuration section
5. Click **Submit for Evaluation**

## How It Works

### File Processing
1. **Text Files (PDF, DOCX, PPTX)**: Content is extracted and sent to AI
2. **Images (PNG, JPG)**: Converted to base64 and analyzed using vision models
3. **AI Analysis**: Content is evaluated against comprehensive rubrics
4. **Results**: Detailed feedback with scores, insights, and recommendations

### Supported Models
- **Claude 3.5 Sonnet** (Default - Recommended)
- **GPT-4 Vision** (For image analysis)
- **GPT-4 Turbo** (Text analysis)
- **And many more via OpenRouter**

### Evaluation Process
1. **File Upload**: System extracts content from your file
2. **AI Prompt**: Generates rubric-specific evaluation prompt
3. **AI Analysis**: Model analyzes content against criteria
4. **Structured Output**: Returns JSON-formatted evaluation results
5. **Session Storage**: Results stored for session duration

## Rubric-Specific Analysis

### Flowchart Evaluation
- **Clarity & Readability** (20%): Symbol usage, labeling, formatting
- **Logical Flow** (25%): Sequence, decision points, loop structures
- **Completeness** (20%): Essential elements, edge cases, error handling
- **Syntax & Standards** (15%): Convention adherence, proper symbols
- **Efficiency & Optimization** (20%): Structure optimization, redundancy

### Algorithm Evaluation
- **Clarity & Readability** (20%): Code structure, naming, comments
- **Logical Correctness** (25%): Algorithm logic, edge case handling
- **Completeness** (20%): All required functionality, error handling
- **Efficiency** (15%): Time/space complexity, optimization
- **Best Practices** (20%): Coding standards, maintainability

### Pseudocode Evaluation
- **Clarity & Structure** (20%): Clear syntax, proper indentation
- **Logical Flow** (25%): Step-by-step logic, control structures
- **Completeness** (20%): All necessary steps, initialization, termination
- **Language Independence** (15%): Generic constructs, clear operations
- **Problem Solving** (20%): Approach effectiveness, edge cases

## Cost Considerations

### OpenRouter Pricing
- **Pay-per-use**: Only charged for actual API calls
- **Model-specific pricing**: Different models have different costs
- **Typical cost**: $0.001-0.01 per evaluation (depending on model and content size)

### Optimization Tips
1. **Use appropriate models**: Claude 3.5 Sonnet for comprehensive analysis
2. **Optimize content**: Cleaner files = better analysis
3. **Batch processing**: Evaluate multiple files in sequence
4. **Monitor usage**: Check OpenRouter dashboard for usage stats

## Troubleshooting

### Common Issues
1. **"Connection Failed"**: Check API key validity and network connection
2. **"No Models Available"**: Verify API key permissions and account status
3. **"Evaluation Failed"**: Check file format and content accessibility
4. **"Rate Limited"**: Wait and retry, or check OpenRouter limits

### File-Specific Issues
- **PDF**: Ensure text is extractable (not scanned images)
- **DOCX**: Modern format preferred over older .doc files
- **Images**: Ensure flowcharts/code is clearly visible and readable
- **Size limits**: Keep files under 10MB for optimal processing

## Advanced Features

### Custom Model Selection
```javascript
// In the service, you can specify different models
const evaluation = await aiService.evaluate(
  file, 
  rubricType, 
  'anthropic/claude-3.5-sonnet' // Custom model
);
```

### Batch Processing
The system can be extended to handle multiple files:
```javascript
const evaluations = await Promise.all(
  files.map(file => aiService.evaluate(file, rubricType))
);
```

### Custom Rubrics
You can extend the service to support custom evaluation criteria by modifying the prompt generation in `AIEvaluationService.ts`.

## Security & Privacy

### Data Handling
- **No persistent storage**: Files and results not stored on servers
- **Session-only**: Data cleared when browser closes/refreshes
- **API transmission**: Files sent securely to OpenRouter for analysis
- **No sharing**: Your evaluations are private to your session

### Best Practices
1. **Secure API keys**: Store safely, don't share
2. **File sensitivity**: Be mindful of confidential content
3. **Usage monitoring**: Regularly check API usage
4. **Key rotation**: Periodically rotate API keys

## Integration with Learning Management Systems

The evaluation system can be integrated with LMS platforms:

### Webhook Support (Future)
```javascript
{
  "webhook_url": "https://your-lms.com/webhook/evaluation",
  "events": ["evaluation.completed"],
  "evaluation_result": { ... }
}
```

### Grade Passback
Results can be formatted for common LMS grade formats:
- Canvas API
- Moodle Web Services
- Blackboard REST API

## Development and Customization

### Extending File Support
Add new file type processors in `AIEvaluationService.ts`:
```javascript
private async extractNewFileType(file: File): Promise<FileContent> {
  // Implementation for new file type
}
```

### Custom AI Prompts
Modify `generateEvaluationPrompt()` to customize evaluation criteria and output format.

### Enhanced Analytics
Add evaluation analytics and progress tracking:
- Performance trends
- Common mistake patterns
- Improvement recommendations

This comprehensive AI integration makes RubiAI a powerful tool for automated educational assessment while maintaining flexibility and user control.