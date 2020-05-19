import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionInternalState, SpeechRecognitionStatus } from "./types";
import {
  setInterimTranscript,
  setTranscript,
  setFinalTranscript,
  setStatus,
  setError,
  setPauseAfterDisconnect,
} from "./actions";

export const initialState: SpeechRecognitionInternalState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  pauseAfterDisconnect: false,
  error: undefined,
};

export const speechRecognitionReducer = reducerWithInitialState(initialState)
  .case(setTranscript, (state, transcript) => ({
    ...state,
    transcript,
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
  .case(setError, (state, error) => ({
    ...state,
    error,
  }))
  .case(setStatus, (state, status) => ({
    ...state,
    status,
  }));

export default speechRecognitionReducer;
