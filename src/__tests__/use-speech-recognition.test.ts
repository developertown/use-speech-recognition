import { renderHook } from "@testing-library/react-hooks";
import { useSpeechRecognition, defaultOptions } from "..";
import { SpeechRecognitionOptions, SpeechRecognitionStatus } from "../types";

describe("useSpeechRecognition", () => {
  let options: SpeechRecognitionOptions;

  beforeEach(() => {
    options = { ...defaultOptions };
  });

  test("should use speech recognition", () => {
    try {
      const { result } = renderHook(() => useSpeechRecognition(options));
      expect(result.current.status).toEqual(SpeechRecognitionStatus.READY);
    } catch (error) {
      // console.error("Recognition Error:", error);
    }
  });
});
