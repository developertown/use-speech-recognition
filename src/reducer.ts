import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SpeechRecognitionState, SpeechRecognitionStatus } from "./types";
import {
  setInterimTranscript,
  setTranscript,
  setFinalTranscript,
  setListening,
  setStatus,
  setPauseAfterDisconnect,
} from "./actions";

export const initialState: SpeechRecognitionState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  listening: false,
  pauseAfterDisconnect: false,
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
  .case(setStatus, (state, status) => ({
    ...state,
    status,
  }))
  .case(setListening, (state, listening) => ({
    ...state,
    listening,
  }));

export default speechRecognitionReducer;
