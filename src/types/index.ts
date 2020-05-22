declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    mozSpeechRecognition: unknown;
    msSpeechRecognition: unknown;
    oSpeechRecognition: unknown;
  }
}

export interface SetTranscriptsPayload {
  transcript: Transcript;
  finalTranscript: Transcript;
  interimTranscript: Transcript;
}

export type SpeechRecognitionErrorMessage = string;
export type SpeechRecognitionErrorType = string;

export interface SpeechRecognitionErrorEvent extends Error {
  error: SpeechRecognitionErrorType;
  message: SpeechRecognitionErrorMessage;
}

export interface SpeechRecognitionUtils extends SpeechRecognitionState {
  resetTranscript: () => void;
  startListening: () => void;
  stopListening: () => void;
}

export interface SpeechRecognitionState {
  error?: SpeechRecognitionErrorMessage;
  status: SpeechRecognitionStatus;
  transcript: string; // Transcription of all speech that has been spoken into the microphone. Is equivalent to the final transcript followed by the interim transcript, separated by a space.
  interimTranscript: string; // Current word guesses before adding to transcript
  finalTranscript: string; // Completed transcript
}

export interface SpeechRecognitionInternalState extends SpeechRecognitionState {
  pauseAfterRecognitionEnd: boolean;
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
  onStart: (event: Event) => void; // Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
  onEnd?: (event: Event) => void; // Fired when the speech recognition service has disconnected.
  onAudioStart?: (event: Event) => void; // Fired when the user agent has started to capture audio.
  onAudioEnd?: (event: Event) => void; // Fired when the user agent has finished capturing audio.
  onNoMatch?: (event: Event) => void; // Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
  onSoundStart?: (event: Event) => void; // Fired when any sound — recognisable speech or not — has been detected.
  onSoundEnd?: (event: Event) => void; // Fired when any sound — recognisable speech or not — has stopped being detected.
  onSpeechStart?: (event: Event) => void; // Fired when sound that is recognised by the speech recognition service as speech has been detected.
  onSpeechEnd?: (event: Event) => void; // Fired when sound that is recognised by the speech recognition service as speech has stopped being been detected.
}

export enum SpeechRecognitionDisconnectType {
  RESET = "RESET",
  STOP = "STOP",
}

export type Transcript = string;
