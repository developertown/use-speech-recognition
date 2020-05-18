declare global {
    interface Window {
        webkitSpeechRecognition: unknown;
        mozSpeechRecognition: unknown;
        msSpeechRecognition: unknown;
        oSpeechRecognition: unknown;
    }
}
export interface SpeechRecognitionUtils extends SpeechRecognitionState {
    resetTranscript: () => void;
    startListening: () => void;
    stopListening: () => void;
}
export interface SpeechRecognitionState {
    status: SpeechRecognitionStatus;
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
}
export interface SpeechRecognitionInternalState extends SpeechRecognitionState {
    pauseAfterDisconnect: boolean;
}
export declare enum SpeechRecognitionStatus {
    READY = "ready",
    STOPPED = "stopped",
    STARTED = "started",
    ERROR = "error",
    RESET = "reset"
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
    RESET = "RESET",
    STOP = "STOP"
}
export declare type Transcript = string;
