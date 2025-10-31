
# RubiAI - Intelligent Rubrics-Based Evaluator

## Overview

RubiAI is an intelligent evaluation system capable of assessing flowcharts, algorithms, and pseudocode against predefined rubrics. The system provides automated, consistent, and immediate feedback without requiring user profiles or persistent data storage.

## Features

### Core Capabilities
- **Multi-Format Support**: Parses and evaluates .docx, .pptx, .pdf, .png, and .jpg files
- **AI-Powered Analysis**: Intelligent evaluation engine for computational thinking assessments
- **Rubric-Based Scoring**: Predefined rubrics ensure consistent evaluation criteria
- **Instant Feedback**: Real-time evaluation with detailed improvement suggestions
- **Language Agnostic**: Supports pseudocode in various styles and conventions
- **Stateless Operation**: No user profiles or data storage required

### Evaluation Types
1. **Flowcharts**: Visual algorithm representation evaluation
2. **Algorithms**: Code logic and efficiency assessment  
3. **Pseudocode**: Language-independent algorithm evaluation

### Technical Features
- **Robust Parser**: Handles multiple file formats seamlessly
- **Evaluation Engine**: AI-driven assessment against rubric criteria
- **LMS Integration**: Ready for learning management system integration
- **Responsive UI**: Modern, user-friendly interface built with React

## Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # System overview and capabilities
│   │   ├── UploadPage.tsx         # File upload and evaluation interface
│   │   ├── EvaluationPage.tsx     # Sample results and feedback display
│   │   ├── RubricsPage.tsx        # Rubric management and configuration
│   │   └── ui/                    # Reusable UI components
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Evaluation Process

1. **Upload File**: Select your flowchart, algorithm, or pseudocode file
   - Supported formats: PDF, DOCX, PPTX, PNG, JPG
   - Drag and drop or browse to select

2. **Choose Rubric**: Select the appropriate evaluation type:
   - Flowchart Evaluation
   - Algorithm Evaluation  
   - Pseudocode Evaluation

3. **Get Results**: Receive instant AI-powered evaluation including:
   - Overall score and grade
   - Detailed rubric breakdown
   - Performance visualization
   - Improvement recommendations

### Evaluation Criteria

The system evaluates submissions based on multiple criteria:

- **Clarity & Readability**: Symbol usage, labeling, formatting
- **Logical Flow**: Sequence, decision points, loop structures
- **Completeness**: Essential elements, edge cases, error handling
- **Syntax & Standards**: Convention adherence, proper symbols
- **Efficiency & Optimization**: Structure optimization, redundancy

## Integration

### Learning Management Systems
The system is designed for easy integration with LMS platforms:
- Stateless operation enables simple API integration
- Standardized evaluation reports
- Compatible with common educational workflows

### API Integration
Future backend integration points:
- File upload and processing endpoints
- Evaluation engine API
- Report generation services
- Rubric management endpoints

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and building

## Key Benefits

1. **No Data Storage**: Stateless evaluation system
2. **Instant Feedback**: Real-time processing and results
3. **Consistent Scoring**: AI-powered rubric adherence
4. **Multiple Formats**: Comprehensive file type support
5. **Educational Focus**: Designed for learning and assessment

## Development

### Project Structure
The application follows a component-based architecture with:
- Modular React components
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components

### Building for Production
```bash
npm run build
```

## Contributing

This project is designed as a prototype for educational evaluation systems. Future enhancements may include:
- Backend integration
- Advanced AI models
- Additional file format support
- Enhanced rubric customization
- Batch processing capabilities

## License

This project is developed as a prototype for intelligent evaluation systems in educational and organizational settings.  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  