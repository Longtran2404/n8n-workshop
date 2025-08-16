import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component for workflow preview
const WorkflowNode = ({ data }: { data: any }) => {
  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trigger':
        return '⚡';
      case 'action':
        return '🔧';
      case 'condition':
        return '🔀';
      case 'loop':
        return '🔄';
      case 'email':
        return '📧';
      case 'database':
        return '🗄️';
      case 'api':
        return '🌐';
      case 'csv':
        return '📊';
      case 'schedule':
        return '⏰';
      default:
        return '📦';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trigger':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'action':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'condition':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'loop':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 ${getNodeColor(data.type)}`}>
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getNodeIcon(data.type)}</span>
        <div>
          <div className="font-bold text-sm">{data.label || data.name}</div>
          <div className="text-xs opacity-75">{data.type}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

interface WorkflowPreviewProps {
  workflow: any;
}

export function WorkflowPreview({ workflow }: WorkflowPreviewProps) {
  // Convert workflow data to ReactFlow format
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!workflow || !workflow.nodes) {
      // Default sample workflow if no data
      const sampleNodes = [
        {
          id: '1',
          type: 'workflowNode',
          position: { x: 100, y: 100 },
          data: { label: 'Start', name: 'Start', type: 'trigger' },
        },
        {
          id: '2',
          type: 'workflowNode',
          position: { x: 300, y: 100 },
          data: { label: 'Process', name: 'Process', type: 'action' },
        },
        {
          id: '3',
          type: 'workflowNode',
          position: { x: 500, y: 100 },
          data: { label: 'End', name: 'End', type: 'action' },
        },
      ];

      const sampleEdges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ];

      return { initialNodes: sampleNodes, initialEdges: sampleEdges };
    }

    // Convert workflow nodes
    if (Array.isArray(workflow.nodes)) {
      workflow.nodes.forEach((node: any, index: number) => {
        nodes.push({
          id: node.id || String(index + 1),
          type: 'workflowNode',
          position: node.position || { 
            x: 150 + (index % 3) * 200, 
            y: 100 + Math.floor(index / 3) * 150 
          },
          data: {
            label: node.name || node.label || `Node ${index + 1}`,
            name: node.name || node.label || `Node ${index + 1}`,
            type: node.type || 'action',
            ...node
          },
        });
      });
    }

    // Convert connections/edges
    if (workflow.connections) {
      Object.entries(workflow.connections).forEach(([sourceId, targets]: [string, any]) => {
        if (Array.isArray(targets)) {
          targets.forEach((target: any, index: number) => {
            if (typeof target === 'string') {
              edges.push({
                id: `e${sourceId}-${target}`,
                source: sourceId,
                target: target,
              });
            } else if (typeof target === 'object' && target.node) {
              edges.push({
                id: `e${sourceId}-${target.node}`,
                source: sourceId,
                target: target.node,
              });
            }
          });
        } else if (typeof targets === 'object') {
          Object.values(targets).forEach((targetArray: any) => {
            if (Array.isArray(targetArray)) {
              targetArray.forEach((target: any) => {
                edges.push({
                  id: `e${sourceId}-${target}`,
                  source: sourceId,
                  target: String(target),
                });
              });
            }
          });
        }
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [workflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-96 w-full bg-gray-50 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
