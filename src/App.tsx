import { useRef, useState } from "react";
import Button from "./components/Button";
import { Message, MessageProps } from "./components/Chat";
import { Input } from "./components/Inputs";
import { backendUrl } from "./util/const";
import { File as FileIcon, Paperclip, XCircle } from "@phosphor-icons/react";
import ErrorDialog from "./components/ErrorDialog";
function App() {
  const [state, setState] = useState<MessageProps[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  async function sendData() {
    setError(null);
    console.log("starting..req");
    const newState: MessageProps[] = [
      ...state,
      { content: prompt, role: "user" },
    ];
    setState(newState);
    setLoading(true);
    const formData = new FormData();
    formData.append("csv", file as File);
    formData.append(
      "data",
      JSON.stringify(newState.map(({ role, content }) => ({ role, content })))
    );
    const res = await fetch(`${backendUrl}/generate-data`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok && data) {
      setError(data.error);
    }
    if (!data) {
      setError("Data extraction failed...");
      setLoading(false);
      return;
    }
    if (!data.messages) {
      setError("Data extraction failed...");
      setLoading(false);
      return;
    }
    const messages = data.messages;
    const fetchedState = [];
    let i = 0;
    for (const msg of messages) {
      if (i < newState.length) {
        fetchedState.push({ ...newState[i], ...msg }); // re insert table field for earlier reference..
      } else {
        fetchedState.push({ ...msg });
      }
      i += 1;
    }
    setState(fetchedState);
    setLoading(false);
  }
  return (
    <div className="p-4 font-sans mx-16  min-h-screen">
      <h1 className="text-5xl font-bold">ExdaAI</h1>
      <div className="p-2 my-4 flex flex-col gap-6">
        {state.map((props, i) => (
          <Message {...props} key={i} />
        ))}
        {error && (
          <ErrorDialog>
            <p> {error} </p>
          </ErrorDialog>
        )}
      </div>
      <div className="h-8 md:h-32"></div>
      <div className=" px-4 pb-4 pt-0  fixed bottom-0 left-0 w-full bg-neutral-800  ">
        <div className="px-16 flex gap-x-4  justify-between items-center w-full">
          <Input
            ref={inputRef}
            type="file"
            id="csv"
            className="hidden"
            placeholder="csv..."
            onChange={(e) => {
              console.log(e.target.files);
              if (e.target.files) setFile(e.target.files[0]);
            }}
          />
          {!file && (
            <label
              htmlFor="csv"
              className="border-2 p-4  rounded-md flex items-center justify-center w-min bg-neutral-600 border-neutral-700"
            >
              <Paperclip className="text-3xl font-bold text-neutral-400 fill-current" />
            </label>
          )}
          {file && (
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-full flex items-end justify-end">
                <button
                  onClick={() => {
                    setFile(null);

                    console.log("ref exists..", inputRef.current);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                  className=" flex items-center justify-center bg-transparent w-6 h-6  rounded-full"
                >
                  <XCircle className="text-neutral-400 text-3xl" />
                </button>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <FileIcon className="text-neutral-400 text-2xl"></FileIcon>
                <p>{file.name}</p>
              </div>
            </div>
          )}
          <Input
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            placeholder="Test stuff and whatnot..."
          />
          <Button
            onClick={sendData}
            disabled={!file || prompt.length < 10 || loading}
          >
            {" "}
            Send{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
