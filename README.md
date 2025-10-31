
# RubiAI - Intelligent Rubrics-Based Evaluator

An intelligent evaluation system for flowcharts, algorithms, and pseudocode using AI-powered rubrics assessment.

## 🚀 Features

- **AI-Powered Evaluation**: Uses Claude 3 Haiku via OpenRouter API for intelligent assessment
- **Custom Rubrics**: Create, edit, and manage evaluation rubrics with browser storage
- **Multi-Format Support**: Supports PDF, DOCX, PPTX, TXT, PNG, and JPG file uploads
- **Session Management**: Stateless design with session-based data persistence
- **Modern UI**: Built with React 18, TypeScript, Vite, and TailwindCSS
- **Responsive Design**: Professional interface with custom branding and favicon

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Radix UI Components
- **AI Integration**: OpenRouter API (Claude 3 Haiku)
- **Storage**: Browser localStorage + sessionStorage
- **File Processing**: Multi-format document parsing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RubiAI.git
   cd RubiAI/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file and add your OpenRouter API key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🔑 Getting an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## 🎯 Usage

1. **Upload Files**: Drag and drop or select files (PDF, DOCX, PPTX, TXT, images)
2. **Create Rubrics**: Define evaluation criteria in the Rubrics section
3. **Start Evaluation**: Upload content and receive AI-powered feedback
4. **View Results**: Review detailed evaluations and scores
5. **Manage Data**: All data is stored locally in your browser

## 📁 Project Structure

```
RubiAI/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts for state management
│   │   ├── services/       # AI evaluation service
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets and favicon
│   └── package.json        # Dependencies and scripts
├── test_files/             # Sample test files
└── README.md
```

## 🔒 Security Notes

- The `.env` file containing your API key is automatically excluded from Git
- All evaluations are processed client-side with external AI API calls
- No sensitive data is stored on servers - everything is local to your browser

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `VITE_OPENROUTER_API_KEY` to Vercel's environment variables
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Add environment variables in Netlify's dashboard

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please create an issue on GitHub.
  