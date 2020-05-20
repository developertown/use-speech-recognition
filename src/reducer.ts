import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionInternalState, SpeechRecognitionStatus } from "./types";
import {
  setInterimTranscript,
  setTranscript,
  setFinalTranscript,
  setStatus,
  setError,
  setPauseAfterRecognitionEnd,
  setTranscripts,
  setErrorMessage,
  disconnect,
  reset,
  pause,
} from "./actions";

export const initialState: SpeechRecognitionInternalState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  pauseAfterRecognitionEnd: false,
  error: undefined,
};

export const speechRecognitionReducer = reducerWithInitialState(initialState)
  .case(reset, (state) => ({
    ...state,
    transcript: "",
    finalTranscript: "",
    interimTranscript: "",
    error: undefined,
  }))
  .case(pause, (state) => ({
    ...state,
    status: SpeechRecognitionStatus.STOPPED,
    pauseAfterRecognitionEnd: false,
  }))
  .case(disconnect, (state, status) => ({
    ...state,
    status,
    transcript: "",
    finalTranscript: "",
    interimTranscript: "",
    error: undefined,
    pauseAfterRecognitionEnd: status === SpeechRecognitionStatus.RESET ? false : true,
  }))
  .case(setTranscript, (state, transcript) => ({
    ...state,
    transcript,
  }))
  .case(setTranscripts, (state, { transcript, finalTranscript, interimTranscript }) => ({
    ...state,
    transcript,
    finalTranscript,
    interimTranscript,
  }))
  .case(setPauseAfterRecognitionEnd, (state, pauseAfterRecognitionEnd) => ({
    ...state,
    pauseAfterRecognitionEnd,
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
  .case(setErrorMessage, (state, error) => ({
    ...state,
    error,
    status: SpeechRecognitionStatus.ERROR,
  }))
  .case(setStatus, (state, status) => ({
    ...state,
    status,
  }));

export default speechRecognitionReducer;
