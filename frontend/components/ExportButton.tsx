import { useState } from 'react';
import { Task } from '@/types/task';
import { downloadFile } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  tasks: Task[];
  onExport: (format: 'json' | 'csv') => string;
  className?: string;
}

export function ExportButton({ tasks, onExport, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const handleExport = () => {
    // Warn user if there are a large number of tasks
    if (tasks.length > 10000) {
      const confirmLargeExport = window.confirm(
        `You are about to export ${tasks.length} tasks. This may take a moment and could impact browser performance. Do you want to continue?`
      );
      if (!confirmLargeExport) {
        return;
      }
    } else if (tasks.length > 1000) {
      const confirmMediumExport = window.confirm(
        `You are about to export ${tasks.length} tasks. This may take a moment. Do you want to continue?`
      );
      if (!confirmMediumExport) {
        return;
      }
    }

    setIsExporting(true);
    try {
      const exportData = onExport(exportFormat);
      const extension = exportFormat === 'json' ? 'json' : 'csv';
      const mimeType = exportFormat === 'json' ? 'application/json' : 'text/csv';

      downloadFile(
        exportData,
        `tasks-${new Date().toISOString().split('T')[0]}.${extension}`,
        mimeType
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="flex items-center gap-2">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
        <button
          onClick={handleExport}
          disabled={isExporting || tasks.length === 0}
          className={cn(
            "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm",
            isExporting || tasks.length === 0 ? "opacity-75 cursor-not-allowed" : ""
          )}
        >
          {isExporting ? 'Exporting...' : tasks.length === 0 ? 'No Tasks to Export' : 'Export Tasks'}
        </button>
      </div>
    </div>
  );
}