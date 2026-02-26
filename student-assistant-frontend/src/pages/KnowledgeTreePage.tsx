import React, { useMemo, useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    ConnectionLineType,
    Handle,
    Position,
    type Edge,
    type Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useScheduleStore } from '../store/useScheduleStore';
import { scheduleService } from '../api/scheduleService';
import { Book, Calendar, TreePine } from 'lucide-react';
import LogDrawer from '../components/logs/LogDrawer';

// Custom Node for Subjects
const SubjectNode = ({ data }: { data: { label: string; color?: string } }) => (
    <div className={`px-4 py-2 rounded-xl border-2 border-slate-200 shadow-sm transition-all hover:shadow-md ${data.color || 'bg-white'}`}>
        <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400" />
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/50">
                <Book size={16} className="text-slate-700" />
            </div>
            <span className="font-bold text-slate-800">{data.label}</span>
        </div>
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400" />
    </div>
);

// Custom Node for Days
const DayNode = ({ data }: { data: { label: string } }) => (
    <div className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold shadow-xl border-2 border-slate-800">
        <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary-400" />
            {data.label}
        </div>
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary-500" />
    </div>
);

const nodeTypes = {
    subject: SubjectNode,
    day: DayNode,
};

const KnowledgeTreePage: React.FC = () => {
    const { subjects } = useScheduleStore();
    const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);

    const { nodes, edges } = useMemo(() => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const initialNodes: Node[] = [];
        const initialEdges: Edge[] = [];

        // Create Day Nodes
        days.forEach((day, index) => {
            const daySubjects = subjects.filter(s => s.day === day);
            if (daySubjects.length === 0) return;

            initialNodes.push({
                id: `day-${day}`,
                type: 'day',
                data: { label: day },
                position: { x: index * 300, y: 0 },
            });

            // Create Subject Nodes for this day
            daySubjects.forEach((subject, sIndex) => {
                initialNodes.push({
                    id: `subject-${subject.id}`,
                    type: 'subject',
                    data: { label: subject.name, color: subject.color },
                    position: { x: index * 300, y: 150 + sIndex * 100 },
                });

                initialEdges.push({
                    id: `e-day-${day}-subject-${subject.id}`,
                    source: `day-${day}`,
                    target: `subject-${subject.id}`,
                    type: ConnectionLineType.SmoothStep,
                    animated: true,
                    style: { stroke: '#94a3b8' },
                });
            });
        });

        return { nodes: initialNodes, edges: initialEdges };
    }, [subjects]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (node.type === 'subject') {
            const subjectId = node.id.replace('subject-', '');
            setSelectedSubject(subjectId);
        }
    }, []);

    React.useEffect(() => {
        if (subjects.length === 0) {
            const fetchSubjects = async () => {
                try {
                    const data = await scheduleService.getSubjects();
                    useScheduleStore.getState().setSubjects(data);
                } catch (_error) {
                    // silently fail or handle
                }
            };
            fetchSubjects();
        }
    }, [subjects.length]);

    return (
        <div className="h-[calc(100vh-160px)] w-full rounded-2xl border border-slate-200 bg-white overflow-hidden relative">
            <div className="absolute top-6 left-6 z-10">
                <h1 className="text-3xl font-bold text-slate-900">Knowledge Tree</h1>
                <p className="text-slate-500">Visualize your academic connections</p>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                className="bg-slate-50/50"
            >
                <Background gap={20} color="#e2e8f0" />
                <Controls />
            </ReactFlow>

            {selectedSubject && (
                <LogDrawer
                    subjectId={selectedSubject}
                    isOpen={!!selectedSubject}
                    onClose={() => setSelectedSubject(null)}
                />
            )}

            {subjects.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20">
                    <div className="text-center p-8 max-w-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <TreePine size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tree is Empty</h3>
                        <p className="text-slate-500 mb-6">Start by adding some subjects to your weekly schedule to see your knowledge tree grow.</p>
                        <a href="/schedule" className="btn btn-primary">Go to Schedule</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeTreePage;
