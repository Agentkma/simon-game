import React, { useEffect, useState } from 'react';

import { delay, isEmpty } from 'lodash';
import './App.css';

const RED = 'red';
const BLUE = 'blue';
const GREEN = 'green';
const YELLOW = 'yellow';

const colorMap = {
  0: RED,
  1: BLUE,
  2: GREEN,
  3: YELLOW,
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const generatePattern = ({ numberOfFlashes = 4 }) => {
  const patternMap = {};
  Array.from(Array(numberOfFlashes)).forEach((number, index) => {
    if (!patternMap[index]) {
      patternMap[index] = colorMap[getRandomInt(4)];
    }
  });

  return patternMap;
};

const getPlayButtonClasName = ({ isGameStarted, isPatternDisplayed }) => {
  return `play font-family ${
    isGameStarted && !isPatternDisplayed ? 'disabled' : null
  }`;
};

const getHeadingText = ({ winOrLoss }) => {
  let text;
  switch (winOrLoss) {
    case null:
      text = 'Good Luck';
      break;
    case true:
      text = 'You Won';
      break;
    default:
      text = 'Sorry, You Lost';
      break;
  }
  return text;
};
const getPlayButtonText = ({ isGameStarted, isPatternDisplayed }) => {
  let text;
  switch (true) {
    case !isGameStarted && !isPatternDisplayed:
      text = 'Start Play';
      break;
    default:
      text = 'Play';
      break;
  }
  return text;
};

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winOrLoss, setWinOrLoss] = useState(null);
  const [flash, setFlash] = useState({});
  const [pattern, setPattern] = useState({});
  const [colorsClicked, setColorsClicked] = useState([]);
  const [isPatternDisplayed, setIsPatternDisplayed] = useState(false);

  useEffect(() => {
    if (!isEmpty(pattern)) {
      setFlash({ 0: pattern[0] });
    }
  }, [pattern]);

  useEffect(() => {
    if (!isEmpty(flash)) {
      const currentPatternIndex = Number(Object.keys(flash));

      if (currentPatternIndex === Object.values(pattern).length - 1) {
        setIsPatternDisplayed((prevState) => true);
        return;
      } else if (!isPatternDisplayed) {
        const currentPatternIndex = Number(Object.keys(flash));
        delay(() => {
          setFlash((prevState) => {
            const newPatternIndex = currentPatternIndex + 1;
            // debugger;
            return { [newPatternIndex]: pattern[newPatternIndex] };
          });
        }, 500);
      }
    }
  }, [flash, pattern, isPatternDisplayed]);

  useEffect(() => {
    if (isGameStarted && winOrLoss === null) {
      const timeoutId = setTimeout(() => {
        setWinOrLoss((prevState) => false);
        setIsGameStarted(false);
        setIsPatternDisplayed(false);
        setFlash({});
        debugger;
        setPattern({});
      }, 8000);
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (winOrLoss !== null) {
      setIsGameStarted(false);
      setIsPatternDisplayed(false);
      setFlash({});
      debugger;
      setPattern({});
    }
  }, [isGameStarted, winOrLoss]);

  useEffect(() => {
    if (!!colorsClicked.length && !isEmpty(pattern) && winOrLoss === null) {
      const validateClicks = ({ pattern = {}, colorsClicked = [] }) => {
        if (colorsClicked.length < Object.values(pattern).length) {
          return null;
        }
        if (colorsClicked.length > Object.values(pattern).length) {
          return false;
        }
        const misMatches = Object.values(pattern).filter(
          (color, index) => colorsClicked[index] !== color
        );
        if (!!misMatches.length) {
          return false;
        } else {
          return true;
        }
      };
      setWinOrLoss(validateClicks({ pattern, colorsClicked }));
    }
  }, [pattern, colorsClicked, winOrLoss]);

  const getButtonControlClassName = ({ color = '' }) => {
    return `button-control ${color} ${
      Object.values(flash)[0] === color ? 'flash' : null
    }`;
  };

  const handlePlayClick = () => {
    const newPattern = generatePattern({});

    setPattern(newPattern);
    setIsGameStarted(true);
  };

  const handleColorClick = ({ color = '' }) => {
    setColorsClicked((prevState) => [...prevState, color]);
  };

  return (
    <div className='App'>
      <header className='App-header font-family'>
        Simon0.2 Classic Edition
      </header>

      <h2 className='font-family'>{getHeadingText({ winOrLoss })}</h2>

      <main className='container'>
        <section></section>
        <section className='button-container'>
          {Object.values(colorMap).map((color) => (
            <button
              disabled={isGameStarted && !isPatternDisplayed}
              className={getButtonControlClassName({
                color,
              })}
              key={color}
              onClick={() => {
                handleColorClick({ color });
              }}
            ></button>
          ))}
        </section>
        <section>
          <button
            className={getPlayButtonClasName({
              isGameStarted,
              isPatternDisplayed,
            })}
            disabled={isGameStarted && !flash}
            onClick={handlePlayClick}
          >
            {getPlayButtonText({
              isGameStarted,
              isPatternDisplayed,
              winOrLoss,
            })}
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
