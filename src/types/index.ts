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
  transcript: string; // Transcription of all speech that has been spoken into the microphone. Is equivalent to the final transcript followed by the interim transcript, separated by a space.
  interimTranscript: string; // Current word guesses before adding to transcript
  finalTranscript: string; // Completed transcript
}

export interface SpeechRecognitionInternalState extends SpeechRecognitionState {
  pauseAfterDisconnect: boolean;
}

export enum SpeechRecognitionStatus {
  READY = "ready",
  STOPPED = "stopped",
  STARTED = "started",
  ERROR = "error",
  RESET = "reset",
}

export interface SpeechRecognitionOptions {
  autoStart: boolean;
  continuous: boolean;
  interimResults: boolean;
  onResult: (final: string, interim: string) => void;
  onDisconnect: () => void;
  onStart: () => void;
}

export enum SpeechRecognitionDisconnectType {
  RESET = "RESET",
  STOP = "STOP",
}

export type Transcript = string;
