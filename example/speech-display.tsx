import * as React from "react";
import { PropsWithChildren } from "react";
import cn from "classnames";
import { useSpeechRecognition } from "../src";
import { SpeechRecognitionStatus } from "../src/types";

const Grid: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "100%", gridRowGap: "1rem", gridColumnGap: "1rem" }}>
    {children}
  </div>
);

export const SpeechDisplay: React.FC<{}> = () => {
  const {
    error,
    finalTranscript,
    transcript,
    interimTranscript,
    status,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();
  const color = cn({
    blue: status === SpeechRecognitionStatus.READY,
    green: status === SpeechRecognitionStatus.STARTED,
    orange: status === SpeechRecognitionStatus.STOPPED,
    red: status === SpeechRecognitionStatus.ERROR,
    black: status === SpeechRecognitionStatus.RESET,
  });

  const resultBox = {
    border: "1px solid #bbb",
    display: "flex",
    width: "30rem",
    padding: "1rem",
    margin: ".25rem 0 .5rem",
    "border-radius": "3px",
    "min-height": "56px",
    "justify-content": "center",
    "align-items": "center",
    "background-color": "#eee",
    "text-align": "center",
    "font-weight": "bold",
    "font-size": "1rem",
  };

  return (
    <>
      <style></style>
      <div style={{ padding: "1rem" }}>
        <h1>Speech Recognition</h1>

        <Grid>
          <div>
            <div className="status">
              Status: <span style={{ color }}>{status}</span>
            </div>
            <div className="result">
              Result (Final Transcript):
              <div style={resultBox}>{finalTranscript}</div>
            </div>

            <div className="result">
              Result (Transcript):
              <div style={resultBox}>{transcript}</div>
            </div>

            <div className="result">
              Result (Interim Transcript):
              <div style={resultBox}>{interimTranscript}</div>
            </div>
          </div>

          {error && (
            <div className="error" style={{ color: "red" }}>
              Error: {error}
            </div>
          )}

          <div>
            <button onClick={startListening}>Start Listening</button>
          </div>
          <div>
            <button onClick={stopListening}>Stop Listening</button>
          </div>
          <div>
            <button onClick={resetTranscript}>Reset Transcript</button>
          </div>
        </Grid>
      </div>
    </>
  );
};
