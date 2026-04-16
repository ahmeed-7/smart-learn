import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecording, setHasRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(blob);
                setHasRecording(true);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (_err) {
            console.error('Microphone access denied');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="glass-card p-6 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-slate-800">
                <Mic size={20} className="text-primary-500" />
                Voice Recording
            </h2>
            <p className="text-sm text-slate-500">
                Record your lecture or thoughts for AI analysis.
            </p>

            <div className="flex items-center gap-4">
                {!isRecording ? (
                    <button
                        type="button"
                        onClick={startRecording}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                    >
                        <Mic size={18} />
                        {hasRecording ? 'Re-record' : 'Start Recording'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors shadow-lg animate-pulse"
                    >
                        <Square size={18} />
                        Stop Recording
                    </button>
                )}

                {isRecording && (
                    <div className="flex items-center gap-2 text-red-500 font-mono text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        <span>{formatTime(duration)}</span>
                    </div>
                )}

                {hasRecording && !isRecording && (
                    <span className="text-sm text-emerald-600 font-semibold">
                        ✓ Recording saved ({formatTime(duration)})
                    </span>
                )}
            </div>
        </div>
    );
};

export default AudioRecorder;
