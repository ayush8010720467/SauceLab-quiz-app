import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import QuesAns from "./QuesAns/QuesAns";
import axios from "axios";
import { data as staticData } from "./data";

function App() {
  const [score, setScore] = useState(0);
  const [chanceCount, setChanceCount] = useState(3);
  const [isNightMode, setNightMode] = useState(false);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleNightMode = useCallback(() => {
    setNightMode((isNightMode) => !isNightMode);
  }, [setNightMode]);

  const getData = useCallback(() => {
    axios
      .get("https://eok9ha49itquif.m.pipedream.net/")
      .then((data) => {
        setData((d) => {
          return [...d, ...data?.data?.questions];
        });
      })
      .catch((error) => {
        setData(staticData);
      });
  }, [setData]);

  useEffect(() => {
    if (currentIndex + 1 >= data.length) {
      getData();
    }
  }, [currentIndex, data]);

  const incrementCurrentIndex = useCallback(() => {
    setCurrentIndex((index) => index + 1);
  }, [setCurrentIndex]);

  const incrementScore = useCallback(() => {
    setScore((score) => score + 1);
  }, [setScore]);

  const decrementChance = useCallback(() => {
    setChanceCount((chanceCount) => chanceCount - 1);
  }, [setChanceCount]);

  const onCorrectAns = useCallback(() => {
    console.log("onCorrectAns");
    incrementScore();
    incrementCurrentIndex();
  }, [incrementScore, incrementCurrentIndex]);

  const onWrongAns = useCallback(() => {
    decrementChance();
    incrementCurrentIndex();
  }, [decrementChance, incrementCurrentIndex]);

  return (
    <div className={isNightMode ? "App night" : "App"}>
      <header className="App-header">
        <span className="mr-3 mt-3">Score: {score}</span>
        <span className="mr-3 mt-3">Chances Left: {chanceCount}</span>
        <button className="mr-3 mt-3 btn" onClick={toggleNightMode}>
          {isNightMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <main>
        <section className="quesAns">
          {data[currentIndex] ? (
            <QuesAns
              question={data[currentIndex].question}
              ansSha={data[currentIndex].answerSha1}
              onCorrectAns={onCorrectAns}
              onWrongAns={onWrongAns}
            ></QuesAns>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
