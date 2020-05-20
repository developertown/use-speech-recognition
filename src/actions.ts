import { actionCreatorFactory } from "typescript-fsa";
import { Transcript, SpeechRecognitionStatus, SpeechRecognitionErrorMessage, SetTranscriptsPayload } from "./types";

const createAction = actionCreatorFactory("SPEECH_RECOGNITION");

export const reset = createAction("RESET");
export const disconnect = createAction<SpeechRecognitionStatus>("DISCONNECT");
export const setStatus = createAction<SpeechRecognitionStatus>("SET_STATUS");
export const setError = createAction<SpeechRecognitionErrorMessage | undefined>("SET_ERROR");
export const setErrorMessage = createAction<SpeechRecognitionErrorMessage>("SET_ERROR_MESSAGE");
// export const clearErrorMessage = createAction("CLEAR_ERROR_MESSAGE");
export const setTranscripts = createAction<SetTranscriptsPayload>("SET_TRANSCRIPTS");
export const setTranscript = createAction<Transcript>("SET_TRANSCRIPT");
export const setFinalTranscript = createAction<Transcript>("SET_FINAL_TRANSCRIPT");
export const setInterimTranscript = createAction<Transcript>("SET_INTERIM_TRANSCRIPT");
export const setPauseAfterDisconnect = createAction<boolean>("SET_PAUSE_AFTER_DISCONNECT");
