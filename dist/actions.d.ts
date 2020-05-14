import { SpeechRecognitionStatus } from "./types";
export declare const setTranscript: import("typescript-fsa").ActionCreator<string>;
export declare const setStatus: import("typescript-fsa").ActionCreator<SpeechRecognitionStatus>;
export declare const setFinalTranscript: import("typescript-fsa").ActionCreator<string>;
export declare const setInterimTranscript: import("typescript-fsa").ActionCreator<string>;
export declare const setListening: import("typescript-fsa").ActionCreator<boolean>;
export declare const setPauseAfterDisconnect: import("typescript-fsa").ActionCreator<boolean>;
