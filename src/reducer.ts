import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionStatus, SpeechRecognitionState } from "./types";
import { setStatus, setTranscripts, setErrorMessage, disconnect, disconnectAndReset, reset } from "./actions";

export const initialState: SpeechRecognitionState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
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
  .case(disconnect, (state) => ({
    ...state,
    status: SpeechRecognitionStatus.STOPPED,
    error: undefined,
  }))
  .case(disconnectAndReset, (state) => ({
    ...state,
    status: SpeechRecognitionStatus.RESET,
    transcript: "",
    finalTranscript: "",
    interimTranscript: "",
    error: undefined,
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
