import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Key, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import AIEvaluationService from "../services/AIEvaluationService";

export function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openrouter_api_key');
    const storedModel = localStorage.getItem('openrouter_model');
    
    if (storedKey) {
      setApiKey(storedKey);
      setConnectionStatus('success');
    } else {
      // Check if environment variable is set
      const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (envApiKey && envApiKey !== 'your_openrouter_api_key_here') {
        setConnectionStatus('success');
      }
    }
    
    if (storedModel) {
      setSelectedModel(storedModel);
    } else {
      const envModel = import.meta.env.VITE_DEFAULT_AI_MODEL;
      if (envModel) {
        setSelectedModel(envModel);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    try {
      // Save API key if provided
      if (apiKey.trim()) {
        localStorage.setItem('openrouter_api_key', apiKey.trim());
      }
      
      // Save selected model if provided
      if (selectedModel.trim()) {
        localStorage.setItem('openrouter_model', selectedModel.trim());
      }
      
      toast.success("Settings saved successfully!");
      setConnectionStatus('success');
    } catch (error) {
      toast.error("Failed to save settings");
      console.error('Error saving settings:', error);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openrouter_api_key');
    setApiKey("");
    setConnectionStatus('idle');
    setAvailableModels([]);
    toast.success("API key removed");
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const aiService = new AIEvaluationService(apiKey.trim() || undefined);
      const models = await aiService.getAvailableModels();
      
      if (models.length > 0) {
        setConnectionStatus('success');
        setAvailableModels(models);
        toast.success("Connection successful! API key is valid.");
      } else {
        setConnectionStatus('error');
        toast.error("No models available. Check your API key permissions.");
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your AI evaluation settings and API credentials</p>
      </div>

      {/* OpenRouter API Configuration */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-600" />
            <CardTitle>OpenRouter API Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure your OpenRouter API key to enable real AI-powered evaluations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Variable Status */}
          {import.meta.env.VITE_OPENROUTER_API_KEY && import.meta.env.VITE_OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  API key configured via environment variable (.env file)
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                You can override this by setting a custom API key below
              </p>
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key">Custom API Key (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Override default API key (optional)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="px-3 py-2"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model-select">AI Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic/claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="deepseek/deepseek-chat">DeepSeek Chat v3.1</SelectItem>
                <SelectItem value="nvidia/nemotron-4-340b-instruct">NemoTron Nano 9B v2</SelectItem>
                <SelectItem value="microsoft/phi-3-medium-128k-instruct">Microsoft Phi-3 Medium</SelectItem>
                <SelectItem value="google/gemma-2-9b-it">Google Gemma 2 9B</SelectItem>
                <SelectItem value="meta-llama/llama-3.2-3b-instruct">Llama 3.2 3B</SelectItem>
                <SelectItem value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</SelectItem>
                <SelectItem value="microsoft/phi-3-mini-128k-instruct">Microsoft Phi-3 Mini</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {selectedModel === 'anthropic/claude-3-haiku' && 'Fast and high-quality responses - excellent for code evaluation'}
              {selectedModel === 'deepseek/deepseek-chat' && 'Advanced reasoning model with strong coding capabilities'}
              {selectedModel === 'nvidia/nemotron-4-340b-instruct' && 'NVIDIA high-performance model for complex tasks'}
              {selectedModel === 'microsoft/phi-3-medium-128k-instruct' && 'Microsoft model with strong reasoning capabilities'}
              {selectedModel === 'google/gemma-2-9b-it' && 'Google open model with good instruction following'}
              {selectedModel === 'meta-llama/llama-3.2-3b-instruct' && 'Compact Meta model, fast inference'}
              {selectedModel === 'meta-llama/llama-3.1-8b-instruct' && 'Larger Meta model with better performance'}
              {selectedModel === 'microsoft/phi-3-mini-128k-instruct' && 'Smallest option, very fast responses'}
            </p>
          </div>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {connectionStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700">API key configured</span>
                </>
              ) : connectionStatus === 'error' ? (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">Connection failed</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-600">Not configured</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={isTestingConnection}
                className="gap-2"
              >
                {isTestingConnection ? (
                  <>Testing...</>
                ) : (
                  <>Test Connection</>
                )}
              </Button>
              {apiKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveApiKey}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Available Models */}
          {availableModels.length > 0 && (
            <div className="space-y-3">
              <Label>Available Models</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {availableModels.slice(0, 10).map((model) => (
                  <Badge key={model.id} variant="outline" className="text-xs">
                    {model.name || model.id}
                  </Badge>
                ))}
              </div>
              {availableModels.length > 10 && (
                <p className="text-xs text-gray-500">
                  And {availableModels.length - 10} more models available...
                </p>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How to get an OpenRouter API key:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">openrouter.ai <ExternalLink className="w-3 h-3" /></a></li>
              <li>Sign up for an account</li>
              <li>Navigate to the API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy and paste it here</li>
            </ol>
            <p className="text-xs text-blue-700 mt-3">
              OpenRouter provides access to multiple AI models including GPT-4, Claude, and others.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Settings */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Evaluation Information</CardTitle>
          <CardDescription>Current evaluation configuration and capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Active Model</Label>
              <div className="p-3 bg-gray-50 rounded border text-sm text-gray-600">
                {selectedModel || import.meta.env.VITE_DEFAULT_AI_MODEL || 'anthropic/claude-3.5-sonnet'}
              </div>
              <p className="text-xs text-gray-500">
                Currently selected AI model for evaluations
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Temperature</Label>
              <div className="p-3 bg-gray-50 rounded border text-sm text-gray-600">
                0.3 (Low randomness)
              </div>
              <p className="text-xs text-gray-500">
                Lower temperature for consistent evaluations
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supported File Types</Label>
            <div className="flex flex-wrap gap-2">
              {['PDF', 'DOCX', 'PPTX', 'TXT', 'PNG', 'JPG'].map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
