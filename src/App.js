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
      <h1>Shopify Challenge - Fun with OpenAI!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <textarea
            name="prompt"
            onChange={handleChange}
            placeholder="Enter your prompt"
          />
        </label>
        <button id="submit-button" type="submit">
          Submit
        </button>
      </form>
      <div id="results">
        {openAIData.map((item) => {
          return (
            <>
              <p>Prompt: {item.prompt}</p>
              <p>Result: {item.result}</p>
            </>
          );
        })}
      </div>
    </main>
  );
}

export default App;
