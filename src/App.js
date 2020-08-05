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

const getButtonControlClassName = ({ color = '', isFlashing }) => {
  return `button-control ${color} ${
    Object.values(isFlashing)[0] === color ? 'isFlashing' : null
  }`;
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
  const [isFlashing, setIsFlashing] = useState({});
  const [pattern, setPattern] = useState({});
  const [colorsClicked, setColorsClicked] = useState([]);
  const [isPatternDisplayed, setIsPatternDisplayed] = useState(false);

  useEffect(() => {
    if (!isEmpty(pattern)) {
      setIsFlashing({ 0: pattern[0] });
    }
  }, [pattern]);

  useEffect(() => {
    if (!isEmpty(isFlashing)) {
      const currentPatternIndex = Number(Object.keys(isFlashing));

      if (currentPatternIndex === Object.values(pattern).length - 1) {
        setIsPatternDisplayed((prevState) => true);
        return;
      } else {
        const flash = ({ isFlashing, pattern }) => {
          const currentPatternIndex = Number(Object.keys(isFlashing));
          delay(() => {
            setIsFlashing((prevState) => {
              const newPatternIndex = currentPatternIndex + 1;
              return { [newPatternIndex]: pattern[newPatternIndex] };
            });
          }, 500);
        };
        flash({ isFlashing, pattern });
      }
    }
  }, [isFlashing, pattern]);

  useEffect(() => {
    if (isGameStarted && winOrLoss === null) {
      const timeoutId = setTimeout(() => {
        setWinOrLoss((prevState) => false);
        setIsGameStarted(false);
        setIsPatternDisplayed(false);
        setIsFlashing(false);
        setPattern({});
      }, 8000);
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (winOrLoss !== null) {
      setIsGameStarted(false);
      setIsPatternDisplayed(false);
      setIsFlashing(false);
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
                isFlashing,
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
            disabled={isGameStarted && !isFlashing}
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
