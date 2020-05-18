import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionInternalState, SpeechRecognitionStatus } from "./types";
import {
  setInterimTranscript,
  setTranscript,
  setFinalTranscript,
  setStatus,
  setPauseAfterDisconnect,
  setTranscriptArray,
} from "./actions";

export const initialState: SpeechRecognitionInternalState = {
  status: SpeechRecognitionStatus.READY,
  transcriptArray: [],
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  pauseAfterDisconnect: false,
};

export const speechRecognitionReducer = reducerWithInitialState(initialState)
  .case(setTranscript, (state, transcript) => ({
    ...state,
    transcript,
  }))
  .case(setTranscriptArray, (state, transcriptArray) => ({
    ...state,
    transcriptArray,
  }))
  .case(setPauseAfterDisconnect, (state, pauseAfterDisconnect) => ({
    ...state,
    pauseAfterDisconnect,
  }))
  .case(setInterimTranscript, (state, interimTranscript) => ({
    ...state,
    interimTranscript,
  }))
  .case(setFinalTranscript, (state, finalTranscript) => ({
    ...state,
    finalTranscript,
  }))
  .case(setStatus, (state, status) => ({
    ...state,
    status,
  }));

export default speechRecognitionReducer;
