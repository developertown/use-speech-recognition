import { SpeechRecognitionOptions, SpeechRecognitionUtils } from "./types";
declare global {
    interface Window {
        webkitSpeechRecognition: unknown;
        mozSpeechRecognition: unknown;
        msSpeechRecognition: unknown;
        oSpeechRecognition: unknown;
    }
}
export declare const defaultOptions: SpeechRecognitionOptions;
export declare function useSpeechRecognition(options?: SpeechRecognitionOptions): SpeechRecognitionUtils;
