import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "Building APIs" },
    position: { x: 400, y: 50 },
    draggable: false,
    dragHandle: null,
    dragNode: false,
    style: {
      background: "#ffe082",
      padding: 10,
      borderRadius: 5,
      fontWeight: "bold",
    },
  },
  {
    id: "2",
    data: { label: "Learn the Basics" },
    position: { x: 150, y: 200 },
    style: { background: "#fff59d" },
  },
  {
    id: "3",
    data: { label: "Different API Styles" },
    position: { x: 400, y: 200 },
    style: { background: "#fff59d" },
  },
  {
    id: "4",
    data: { label: "API Security" },
    position: { x: 650, y: 200 },
    style: { background: "#81d4fa" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e1-4", source: "1", target: "4", animated: true },
];

export default function RoadmapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomActivationKeyCode={null}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
