import { speechRecognitionReducer, initialState } from "./reducer";
import { useEffect, useCallback, useReducer, useMemo } from "react";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionUtils,
  SpeechRecognitionDisconnectType,
  SpeechRecognitionStatus,
  SpeechRecognitionState,
} from "./types";

import {
  setTranscripts,
  setStatus,
  disconnect as disconnectAction,
  setErrorMessage,
  disconnectAndReset,
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

export function useSpeechRecognition(userOptions: Partial<SpeechRecognitionOptions> = {}): SpeechRecognitionUtils {
  const [{ error, status, interimTranscript, finalTranscript, transcript }, dispatch] = useReducer<
    ReducerBuilder<SpeechRecognitionState>
  >(speechRecognitionReducer, initialState);

  const options = useMemo(
    () => ({
      ...defaultOptions,
      ...userOptions,
    }),
    [userOptions],
  );

  const recognition = useMemo(() => {
    const BrowserSpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition);

    if (BrowserSpeechRecognition) {
      return new BrowserSpeechRecognition();
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
            dispatch(disconnectAndReset());
            break;
          case SpeechRecognitionDisconnectType.STOP:
          default:
            recognition.stop();
            dispatch(disconnectAction());
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
        options.onResult(final, interim, event);
      }
    },
    [options],
  );

  const onRecognitionError = useCallback(({ error, message }) => {
    dispatch(setErrorMessage(`${error}: ${message}`));
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults;
      recognition.onresult = updateTranscript;
      recognition.onend = options.onEnd || null;
      recognition.onerror = onRecognitionError;
      recognition.onstart = options.onStart;
      recognition.onaudioend = (e) => {
        options.onAudioEnd && options.onAudioEnd(e);
        // At this point the recognition is already stopped, but we need to update the status:
        stopListening();
      };
    }
  }, [onRecognitionError, updateTranscript, recognition, options.continuous, options.interimResults]);

  useEffect(() => {
    if (options.autoStart) {
      startListening();
    }
  }, [options.autoStart, startListening]);

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
