

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="text-gray-900 font-medium">
          Intelligent Rubrics-Based Evaluator
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-gray-900 text-sm">Evaluation System</p>
          <p className="text-gray-500 text-xs">Ready for Analysis</p>
        </div>
      </div>
    </header>
  );
}
