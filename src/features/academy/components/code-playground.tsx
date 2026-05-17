import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { useSubmitCode } from '../api/submit-code';

const LANGUAGES = [
  { id: 71, name: 'Python', monaco: 'python' },
  { id: 63, name: 'JavaScript', monaco: 'javascript' },
  { id: 60, name: 'Go', monaco: 'go' },
  { id: 54, name: 'C++', monaco: 'cpp' },
  { id: 50, name: 'C', monaco: 'c' },
  { id: 62, name: 'Java', monaco: 'java' },
  { id: 72, name: 'Ruby', monaco: 'ruby' },
  { id: 68, name: 'PHP', monaco: 'php' },
  { id: 51, name: 'C#', monaco: 'csharp' },
];

const DEFAULT_CODE: Record<number, string> = {
  71: 'print("Hello, World!")',
  63: 'console.log("Hello, World!");',
  60: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
  54: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!" << endl;\n\treturn 0;\n}',
  50: '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!\\n");\n\treturn 0;\n}',
  62: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
  72: 'puts "Hello, World!"',
  68: '<?php\necho "Hello, World!\\n";\n?>',
  51: 'using System;\n\nclass Program {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello, World!");\n\t}\n}',
};

export const CodePlayground = () => {
  const [languageId, setLanguageId] = useState(71);
  const [sourceCode, setSourceCode] = useState(DEFAULT_CODE[71] || '');
  const [stdin, setStdin] = useState('');

  const submitCodeMutation = useSubmitCode({
    mutationConfig: {},
  });

  const result = submitCodeMutation.data?.data;

  const handleLanguageChange = (newLangId: number) => {
    setLanguageId(newLangId);
    setSourceCode(DEFAULT_CODE[newLangId] || '');
  };

  const handleRun = () => {
    submitCodeMutation.mutate({
      data: {
        sourceCode: sourceCode,
        languageId: languageId,
        stdin: stdin || undefined,
      },
    });
  };

  const handleReset = () => {
    setSourceCode(DEFAULT_CODE[languageId] || '');
    setStdin('');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <select
            value={languageId}
            onChange={(e) => handleLanguageChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
        <button
          type="button"
          onClick={handleRun}
          disabled={submitCodeMutation.isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
        >
          {submitCodeMutation.isPending ? (
            <Spinner size="sm" />
          ) : (
            <Play className="size-4" />
          )}
          Run Code
        </button>
      </div>

      {/* Editor */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <Editor
          height="350px"
          language={
            LANGUAGES.find((l) => l.id === languageId)?.monaco || 'plaintext'
          }
          value={sourceCode}
          onChange={(value) => setSourceCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* Stdin */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gray-100 px-4 py-2">
          <span className="text-xs font-medium text-gray-600">
            Standard Input (stdin)
          </span>
        </div>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          rows={3}
          className="w-full resize-y bg-white p-4 font-mono text-sm text-gray-800 focus:outline-none"
          placeholder="Input data for your program (optional)"
        />
      </div>

      {/* Output */}
      {result && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div
            className={`flex items-center justify-between px-4 py-2 ${
              result.status_id === 3
                ? 'bg-green-100'
                : result.status_id === 6
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
            }`}
          >
            <span
              className={`text-xs font-medium ${
                result.status_id === 3
                  ? 'text-green-700'
                  : result.status_id === 6
                    ? 'text-yellow-700'
                    : 'text-red-700'
              }`}
            >
              {result.status_description}
            </span>
            <div className="flex gap-3 text-xs text-gray-500">
              {result.time && <span>Time: {result.time}s</span>}
              {result.memory && <span>Memory: {result.memory} KB</span>}
            </div>
          </div>
          <pre className="max-h-[300px] overflow-auto bg-gray-900 p-4">
            <code className="text-sm text-gray-100">
              {result.stdout ||
                result.stderr ||
                result.compile_output ||
                'No output'}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};
