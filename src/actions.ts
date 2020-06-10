import { actionCreatorFactory } from "typescript-fsa";
import { SpeechRecognitionStatus, SpeechRecognitionErrorMessage, SetTranscriptsPayload } from "./types";

const createAction = actionCreatorFactory("SPEECH_RECOGNITION");

export const reset = createAction("RESET");
export const disconnect = createAction("DISCONNECT");
export const disconnectAndReset = createAction("DISCONNECT_AND_RESET");
export const setStatus = createAction<SpeechRecognitionStatus>("SET_STATUS");
export const setErrorMessage = createAction<SpeechRecognitionErrorMessage>("SET_ERROR_MESSAGE");
export const setTranscripts = createAction<SetTranscriptsPayload>("SET_TRANSCRIPTS");
