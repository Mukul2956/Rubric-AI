import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { UploadPage } from "./components/UploadPage";
import { ResultsPage } from "./components/EvaluationPage";
import { RubricsPage } from "./components/RubricsPage";
import { SettingsPage } from "./components/SettingsPage";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "./contexts/SessionContext";
import { RubricsProvider } from "./contexts/RubricsContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />;
      case "upload":
        return <UploadPage />;
      case "evaluation":
        return <ResultsPage />;
      case "rubrics":
        return <RubricsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <RubricsProvider>
      <SessionProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto">
              {renderContent()}
            </main>
          </div>
          <Toaster />
        </div>
      </SessionProvider>
    </RubricsProvider>
  );
}
