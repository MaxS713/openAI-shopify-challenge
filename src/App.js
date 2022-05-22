import React, {useState, useEffect} from "react";
import "./App.css";

function App() {
  const [currentEngine, setCurrentEngine] = useState("text-curie-001");

  const [promptData, setPromptData] = useState({
    prompt: "",
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  const [openAIData, setOpenAIData] = useState([]);

  function handleChange(event) {
    let input = {
      ...promptData,
      [event.target.name]: event.target.value,
    };
    setPromptData(input);
  }

  function handleEngineChange(event) {
    setCurrentEngine(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.target.prompt.value = "";
    let fetchData = await fetch(
      `https://api.openai.com/v1/engines/${currentEngine}/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
        },
        body: JSON.stringify(promptData),
      }
    );
    fetchData = await fetchData.json();
    setOpenAIData([
      ...openAIData,
      {prompt: promptData.prompt, result: fetchData.choices[0].text},
    ]);
  }

  const examplesArray = [
    "Hello AI, how are you today?",
    "Translate this into French: ...",
    "Summarize this for a second-grade student: ...",
    "Who is Batman?",
    "How many pounds are in a kilogram?",
    "Brainstorm some ideas combining VR and fitness.",
    "Write a tagline for an ice cream shop.",
  ];

  const [randomPlaceHolder, setRandomPlaceHolder] = useState(
    "Hello AI, how are you today?"
  );

  function changeExamplePlaceholder() {
    setRandomPlaceHolder(
      examplesArray[Math.floor(Math.random() * examplesArray.length)]
    );
  }

  useEffect(() => {
    setInterval(changeExamplePlaceholder, 5000);
  }, []);

  return (
    <main>
      <header>
        <h1>Shopify Challenge - Fun with Open AI!</h1>
        <div id="engine-choice">
          Change Engine:&nbsp;
          <select onChange={handleEngineChange}>
            <option title="Most capable GPT-3 model." value="text-davinci-002">
              text-davinci-002
            </option>
            <option
              title="Very capable, faster and lower cost than Davinci."
              value="text-curie-001"
            >
              text-curie-001
            </option>
            <option
              title="Capable of straightforward tasks, very fast, and lower cost."
              value="text-babbage-001"
            >
              text-babbage-001
            </option>
            <option
              title="Capable of very simple tasks, fastest and lowest cost."
              value="text-ada-001"
            >
              text-ada-001
            </option>
          </select>
        </div>
      </header>
      <form onSubmit={handleSubmit}>
        <label>Enter a prompt for the Open AI:</label>
        <textarea
          name="prompt"
          onChange={handleChange}
          placeholder={`Example: "${randomPlaceHolder}"`}
        />
        <button id="submit-button" type="submit">
          Submit
        </button>
      </form>
      <div id="results">
        {openAIData.map((item) => {
          return (
            <div className="result-item">
              <p>
                <span>Prompt:</span> {item.prompt}
              </p>
              <p>
                <span>Result:</span> {item.result}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
