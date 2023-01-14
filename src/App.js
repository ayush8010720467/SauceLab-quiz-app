import Loader from "./assets/Loader.svg";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import QuesAns from "./QuesAns/QuesAns";
import axios from "axios";
import { data as staticData } from "./data";
import GameOver from "./GameOver";

function App() {
  const [isGameOver, setGameOver] = useState(false);
  const [loader, setLoaded] = useState(true);
  const [score, setScore] = useState(0);
  const [chanceCount, setChanceCount] = useState(3);
  const [isNightMode, setNightMode] = useState(false);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getData = useCallback(() => {
    axios
      .get("https://eok9ha49itquif.m.pipedream.net/")
      .then((data) => {
        setData((d) => {
          let res = [];
          data?.data?.questions.forEach((elem1) => {
            let flag = false;
            d.forEach((elem2) => {
              if (elem2.question === elem1.question) {
                flag = true;
              }
            });
            if (!flag) {
              res.push(elem1);
            }
          });
          return [...d, ...res];
        });
        setLoaded(false);
      })
      .catch((error) => {
        setData(staticData);
        setLoaded(false);
      });
  }, [setData]);

  useEffect(() => {
    if (currentIndex + 1 >= data.length) {
      getData();
    }
  }, [currentIndex, data, getData]);

  useEffect(() => {
    if (chanceCount === 0) {
      setGameOver(true);
    }
  }, [chanceCount]);
  const toggleNightMode = useCallback(() => {
    setNightMode((isNightMode) => !isNightMode);
  }, [setNightMode]);

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
    incrementScore();
    incrementCurrentIndex();
  }, [incrementScore, incrementCurrentIndex]);

  const onWrongAns = useCallback(() => {
    decrementChance();
    incrementCurrentIndex();
  }, [decrementChance, incrementCurrentIndex]);

  const restart = useCallback(() => {
    setScore(0);
    setChanceCount(3);
    setData([]);
    setLoaded(true);
    setCurrentIndex(0);
    setGameOver(false);
  }, []);

  return (
    <div className={isNightMode ? "App night" : "App"}>
      <header className="App-header">
        <div className="header-container">
          <span>Score: {score}</span>
          <span>Chances Left: {chanceCount}</span>
          <button className="btn" onClick={toggleNightMode}>
            {isNightMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>
      <main>
        <section className="quesAns">
          {loader && <img src={Loader} alt="loader" height="150" width="150" />}
          {isGameOver && <GameOver score={score} restart={restart}></GameOver>}
          {!loader && !isGameOver && data[currentIndex] && (
            <QuesAns
              question={data[currentIndex].question}
              ansSha={data[currentIndex].answerSha1}
              onCorrectAns={onCorrectAns}
              onWrongAns={onWrongAns}
            ></QuesAns>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
