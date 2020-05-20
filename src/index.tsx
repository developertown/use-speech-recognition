import { speechRecognitionReducer, initialState } from "./reducer";
import { useEffect, useCallback, useReducer, useMemo } from "react";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionUtils,
  SpeechRecognitionDisconnectType,
  SpeechRecognitionStatus,
  SpeechRecognitionInternalState,
} from "./types";

import {
  setPauseAfterDisconnect,
  setTranscripts,
  setStatus,
  disconnect as disconnectAction,
  setErrorMessage,
} from "./actions";
import { ERROR_NO_RECOGNITION_SUPPORT } from "./constants";
import { ReducerBuilder } from "typescript-fsa-reducers";

export const defaultOptions: SpeechRecognitionOptions = {
  autoStart: false,
  continuous: false,
  interimResults: true,
  onResult: () => {},
  onDisconnect: () => {},
  onStart: () => {},
};

function concatTranscripts(...parts: string[]) {
  return parts
    .map((t) => t.trim())
    .join(" ")
    .trim();
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = defaultOptions): SpeechRecognitionUtils {
  const [
    { error, status, pauseAfterDisconnect, interimTranscript, finalTranscript, transcript },
    dispatch,
  ] = useReducer<ReducerBuilder<SpeechRecognitionInternalState>>(speechRecognitionReducer, initialState);

  const recognition = useMemo(() => {
    const BrowserSpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition);

    if (BrowserSpeechRecognition) {
      const rec = new BrowserSpeechRecognition();
      rec.continuous = options.continuous !== false;
      rec.interimResults = options.interimResults;
      rec.onresult = updateTranscript;
      rec.onend = onRecognitionDisconnect;
      rec.onerror = onRecognitionError;
      return rec;
    } else {
      throw new Error(ERROR_NO_RECOGNITION_SUPPORT);
    }
  }, []);

  const disconnect = useCallback(
    (disconnectType: SpeechRecognitionDisconnectType) => {
      if (recognition) {
        switch (disconnectType) {
          case SpeechRecognitionDisconnectType.RESET:
            recognition.abort();
            dispatch(disconnectAction(SpeechRecognitionStatus.RESET));
            break;
          case SpeechRecognitionDisconnectType.STOP:
          default:
            recognition.stop();
            // dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
            dispatch(disconnectAction(SpeechRecognitionStatus.STOPPED));
        }
      }
    },
    [recognition],
  );

  const resetTranscript = useCallback(() => {
    disconnect(SpeechRecognitionDisconnectType.RESET);
  }, [disconnect]);

  const startListening = useCallback(() => {
    if (status !== SpeechRecognitionStatus.STARTED) {
      if (!recognition.continuous) {
        resetTranscript();
      }

      try {
        recognition.start();
        dispatch(setStatus(SpeechRecognitionStatus.STARTED));
      } catch (DOMException) {
        // Tried to start recognition after it has already started - safe to swallow this error
      }
    }
  }, [status, recognition, resetTranscript]);

  const stopListening = useCallback(() => {
    disconnect(SpeechRecognitionDisconnectType.STOP);
  }, [disconnect]);

  const updateTranscript = useCallback(
    (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final = concatTranscripts(final, event.results[i][0].transcript);
        } else {
          interim = concatTranscripts(interim, event.results[i][0].transcript);
        }
      }

      dispatch(
        setTranscripts({
          transcript: concatTranscripts(final, interim),
          interimTranscript: interim,
          finalTranscript: final,
        }),
      );

      if (options.onResult) {
        options.onResult(final, interim);
      }
    },
    [options],
  );

  const onRecognitionDisconnect = useCallback(() => {
    if (pauseAfterDisconnect) {
      dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
    } else if (recognition) {
      if (recognition.continuous) {
        startListening();
      } else {
        dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
      }
    }
    dispatch(setPauseAfterDisconnect(false));
  }, [pauseAfterDisconnect, recognition, startListening]);

  const onRecognitionError = useCallback(({ error, message }) => {
    dispatch(setErrorMessage(`${error}: ${message}`));
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults;
      recognition.onresult = updateTranscript;
      recognition.onend = onRecognitionDisconnect;
      recognition.onerror = onRecognitionError;
    }
  }, [
    onRecognitionDisconnect,
    onRecognitionError,
    updateTranscript,
    recognition,
    options.continuous,
    options.interimResults,
  ]);

  useEffect(() => {
    if (options?.autoStart) {
      startListening();
    }

    return () => {
      if (status === SpeechRecognitionStatus.STARTED) {
        stopListening();
      }
    };
  }, [status, options.autoStart]);

  return {
    error,
    transcript,
    interimTranscript,
    finalTranscript,
    status,
    resetTranscript,
    startListening,
    stopListening,
  };
}
