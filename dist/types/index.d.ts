export interface SpeechRecognitionUtils {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    status: SpeechRecognitionStatus;
    recognition?: SpeechRecognition;
    resetTranscript: () => void;
    startListening: () => void;
    stopListening: () => void;
    abortListening: () => void;
}
export interface SpeechRecognitionState {
    status: SpeechRecognitionStatus;
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    pauseAfterDisconnect: boolean;
}
export declare enum SpeechRecognitionStatus {
    READY = "ready",
    STOPPED = "stopped",
    STARTED = "started",
    ERROR = "error",
    RESET = "reset",
    ABORTED = "aborted"
}
export interface SpeechRecognitionOptions {
    autoStart: boolean;
    continuous: boolean;
    interimResults: boolean;
    onResult: (final: string, interim: string) => void;
    onDisconnect: () => void;
    onStart: () => void;
}
export declare enum SpeechRecognitionDisconnectType {
    ABORT = "ABORT",
    RESET = "RESET",
    STOP = "STOP"
}
export declare type Transcript = string;
