import React, {useState} from "react";
import "./App.css";

function App() {
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

  async function handleSubmit(event) {
    event.preventDefault();
    let fetchData = await fetch(
      "https://api.openai.com/v1/engines/text-curie-001/completions",
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

  return (
    <main>
      <header>
        <h1>Shopify Challenge - Fun with Open AI!</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label>Enter a prompt for the Open AI to complete:</label>
        <textarea
          name="prompt"
          onChange={handleChange}
          placeholder="Enter your prompt"
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
