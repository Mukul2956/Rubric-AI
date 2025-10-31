# RubiAI API Specification

## Overview
This document outlines the REST API endpoints required for the RubiAI backend system. The system is designed to be stateless with no user profiles or persistent data storage.

## Base URL
```
https://api.rubiai.com/v1
```

## Authentication
- No user authentication required (stateless system)
- Optional API key for rate limiting and usage tracking
- Header: `X-API-Key: your-api-key`

## Endpoints

### 1. File Upload and Evaluation

#### POST /evaluate
Upload and evaluate a document against specified rubrics.

**Request:**
```http
POST /evaluate
Content-Type: multipart/form-data

Parameters:
- file: File (required) - Document to evaluate (.pdf, .docx, .pptx, .png, .jpg)
- rubric_type: String (required) - Type of evaluation ("flowchart", "algorithm", "pseudocode")
- options: JSON (optional) - Additional evaluation parameters
```

**Response:**
```json
{
  "evaluation_id": "eval_123456789",
  "status": "completed",
  "timestamp": "2025-10-31T10:30:00Z",
  "file_info": {
    "filename": "sorting_algorithm.pdf",
    "size": 2048,
    "type": "pdf"
  },
  "rubric_type": "algorithm",
  "overall_score": {
    "points": 87,
    "total": 100,
    "percentage": 87,
    "grade": "A-"
  },
  "criteria_scores": [
    {
      "criterion": "Clarity & Readability",
      "weight": 20,
      "score": 18,
      "max_score": 20,
      "percentage": 90,
      "status": "excellent"
    }
  ],
  "detailed_feedback": {
    "strengths": [
      "Excellent adherence to standard conventions",
      "Clear logical flow with well-defined decision points"
    ],
    "improvements": [
      "Consider adding error handling for edge cases",
      "Optimize by reducing redundant decision points"
    ],
    "ai_insights": "The algorithm demonstrates strong logical thinking..."
  },
  "processing_time": 2.5
}
```

### 2. Evaluation Status Check

#### GET /evaluate/{evaluation_id}/status
Check the status of a processing evaluation.

**Response:**
```json
{
  "evaluation_id": "eval_123456789",
  "status": "processing", // "processing", "completed", "failed"
  "progress": 65,
  "current_step": "Evaluating content",
  "estimated_completion": "2025-10-31T10:32:30Z"
}
```

### 3. Rubric Management

#### GET /rubrics
Get available evaluation rubrics.

**Response:**
```json
{
  "rubrics": [
    {
      "id": "flowchart_v1",
      "name": "Flowchart Evaluation",
      "description": "Standard flowchart assessment rubric",
      "criteria": [
        {
          "name": "Clarity & Readability",
          "weight": 20,
          "description": "Symbol usage, labeling, formatting"
        }
      ]
    }
  ]
}
```

#### GET /rubrics/{rubric_id}
Get detailed information about a specific rubric.

### 4. Report Generation

#### GET /evaluate/{evaluation_id}/report
Generate and download evaluation report.

**Query Parameters:**
- format: String ("pdf", "json", "html") - Report format

**Response:**
- PDF/HTML: Binary report file
- JSON: Structured evaluation data

### 5. System Health

#### GET /health
Check system status and capabilities.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "supported_formats": ["pdf", "docx", "pptx", "png", "jpg"],
  "available_rubrics": ["flowchart", "algorithm", "pseudocode"],
  "processing_queue": {
    "active": 3,
    "pending": 12
  },
  "average_processing_time": 3.2
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "Unsupported file format. Please upload PDF, DOCX, PPTX, PNG, or JPG files.",
    "details": {
      "supported_formats": ["pdf", "docx", "pptx", "png", "jpg"]
    }
  }
}
```

### Common Error Codes
- `INVALID_FILE_FORMAT` - Unsupported file type
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_RUBRIC_TYPE` - Unknown rubric type
- `PROCESSING_FAILED` - Evaluation engine error
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Processing Flow

1. **File Upload**: Client uploads file with rubric selection
2. **Validation**: System validates file format and rubric type
3. **Parsing**: Document parser extracts content and structure
4. **Evaluation**: AI engine assesses content against rubric criteria
5. **Report Generation**: System generates detailed feedback and scoring
6. **Response**: Client receives evaluation results

## File Processing Requirements

### Supported File Types
- **PDF**: Text and image extraction
- **DOCX**: Document structure and content parsing
- **PPTX**: Slide content and flowchart extraction
- **PNG/JPG**: OCR and image recognition for flowcharts

### Size Limitations
- Maximum file size: 10MB
- Processing timeout: 30 seconds
- Batch processing: Not supported (single file per request)

## Security Considerations

- Input validation for all file uploads
- Virus scanning for uploaded files
- Rate limiting per IP address
- No persistent storage of user files
- Temporary file cleanup after processing

## Performance Requirements

- Average processing time: < 5 seconds
- Concurrent evaluations: 50+ simultaneous
- Availability: 99.9% uptime
- Response time: < 200ms for status checks

## Integration Guidelines

### LMS Integration
The API is designed for easy integration with Learning Management Systems:

```javascript
// Example integration
const evaluateSubmission = async (file, rubricType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('rubric_type', rubricType);
  
  const response = await fetch('/api/v1/evaluate', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your-api-key'
    },
    body: formData
  });
  
  return response.json();
};
```

### Webhook Support (Future Enhancement)
Optional webhook notifications for long-running evaluations:

```json
{
  "webhook_url": "https://your-system.com/webhook/evaluation",
  "events": ["evaluation.completed", "evaluation.failed"]
}
```

## Monitoring and Analytics

### Metrics Tracked
- Evaluation requests per minute
- Average processing time
- Success/failure rates
- File type distribution
- Rubric usage statistics

### Logging
- Request/response logging
- Error tracking and alerting
- Performance monitoring
- Security event logging