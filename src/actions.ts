import { actionCreatorFactory } from "typescript-fsa";
import { Transcript, SpeechRecognitionStatus } from "./types";

const createAction = actionCreatorFactory("SPEECH_RECOGNITION");

export const setStatus = createAction<SpeechRecognitionStatus>("SET_STATUS");
export const setTranscript = createAction<Transcript>("SET_TRANSCRIPT");
export const setTranscriptArray = createAction<Transcript[]>("SET_TRANSCRIPT_ARRAY");
export const setFinalTranscript = createAction<Transcript>("SET_FINAL_TRANSCRIPT");
export const setInterimTranscript = createAction<Transcript>("SET_INTERIM_TRANSCRIPT");
export const setPauseAfterDisconnect = createAction<boolean>("SET_PAUSE_AFTER_DISCONNECT");
