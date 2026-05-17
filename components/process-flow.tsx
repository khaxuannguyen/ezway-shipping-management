import React from "react";

type FlowStatus = "completed" | "active" | "pending" | "problem";

export interface FlowNode {
  id: string;
  title: string;
  subtitle?: string;
  status?: FlowStatus;
  items?: string[];
}

function statusClasses(status?: FlowStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    case "active":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "problem":
      return "bg-red-50 border-red-200 text-red-800";
    default:
      return "bg-white border-slate-200 text-slate-900";
  }
}

export function ProcessFlow({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="w-full overflow-x-auto bg-slate-50 p-4 rounded-lg">
      <div className="inline-flex items-center gap-6 px-2">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div
              className={`min-w-[220px] p-4 rounded-xl border shadow-sm ${statusClasses(node.status)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{node.title}</div>
                  {node.subtitle && (
                    <div className="text-xs text-slate-500 mt-1">
                      {node.subtitle}
                    </div>
                  )}
                  {node.items && node.items.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-slate-600">
                      {node.items.map((it, i) => (
                        <li key={i} className="truncate">
                          • {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div className="flex items-center">
                <svg
                  className="h-6 w-16"
                  viewBox="0 0 100 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12 H88"
                    stroke="#CBD5E1"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M86 6 L98 12 L86 18"
                    stroke="#CBD5E1"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProcessFlow;
