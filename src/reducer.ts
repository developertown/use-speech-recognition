import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionInternalState, SpeechRecognitionStatus } from "./types";
import { setStatus, setTranscripts, setErrorMessage, disconnect, disconnectAndReset, reset, pause } from "./actions";

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
    status: SpeechRecognitionStatus.STOPPED,
    error: undefined,
    pauseAfterRecognitionEnd: true,
  }))
  .case(disconnectAndReset, (state) => ({
    ...state,
    status: SpeechRecognitionStatus.RESET,
    transcript: "",
    finalTranscript: "",
    interimTranscript: "",
    error: undefined,
    pauseAfterRecognitionEnd: false,
  }))
  .case(setTranscripts, (state, { transcript, finalTranscript, interimTranscript }) => ({
    ...state,
    transcript,
    finalTranscript,
    interimTranscript,
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
