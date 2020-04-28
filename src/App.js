import React, { useEffect, useState } from "react";

import { delay, isEmpty } from "lodash";
import "./App.css";

const RED = "red";
const BLUE = "blue";
const GREEN = "green";
const YELLOW = "yellow";

const colorMap = {
    0: RED,
    1: BLUE,
    2: GREEN,
    3: YELLOW
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

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [winOrLoss, setWinOrLoss] = useState(null);
    const [isFlashing, setIsFlashing] = useState({});
    const [pattern, setPattern] = useState({});
    const [colorsClicked, setColorsClicked] = useState([]);
    const [patternDisplayed, setPatternDisplayed] = useState(null);

    useEffect(() => {
        if (!isEmpty(pattern)) {
            setIsFlashing({ 0: pattern[0] });
        }
    }, [pattern]);

    useEffect(() => {
        if (!isEmpty(isFlashing)) {
            const currentPatternIndex = Number(Object.keys(isFlashing));

            if (currentPatternIndex === Object.values(pattern).length - 1) {
                setPatternDisplayed(prevState => true);
                return;
            } else {
                flash({ isFlashing, pattern });
            }
        }
    }, [isFlashing]);

    useEffect(() => {
        if (gameStarted && winOrLoss === null) {
            const timeoutId = setTimeout(params => {
                setWinOrLoss(prevState => false);
            }, 8000);
            return params => {
                clearTimeout(timeoutId);
            };
        }
    }, [gameStarted, winOrLoss]);

    useEffect(() => {
        if (!!colorsClicked.length && !isEmpty(pattern) && winOrLoss === null) {
            setWinOrLoss(validateClicks({ pattern, colorsClicked }));
        }
    }, [pattern, colorsClicked, winOrLoss]);

    const flash = ({ isFlashing, pattern }) => {
        const currentPatternIndex = Number(Object.keys(isFlashing));
        delay(() => {
            setIsFlashing(prevState => {
                const newPatternIndex = currentPatternIndex + 1;
                return { [newPatternIndex]: pattern[newPatternIndex] };
            });
        }, 500);
    };

    const getButtonControlClassName = ({ color = "" }) => {
        return `button-control ${color} ${
            Object.values(isFlashing)[0] === color ? "isFlashing" : null
        }`;
    };
    const handlePlayClick = () => {
        if (!gameStarted) {
            setPattern(generatePattern({}));
            setGameStarted(true);
        } else {
            setGameStarted(false);
            setWinOrLoss(null);
        }
    };

    const handleColorClick = ({ color = "" }) => {
        setColorsClicked(prevState => [...prevState, color]);
    };

    const getHeading = ({ winOrLoss }) => {
        let text;
        switch (winOrLoss) {
            case null:
                text = "Good Luck";
                break;
            case true:
                text = "You Won";
                break;
            default:
                text = "Sorry, You Lost";
                break;
        }
        return text;
    };

    return (
        <div className="App">
            <header className="App-header font-family">
                Simon0.2 Classic Edition
            </header>

            <h2 className="font-family">{getHeading({ winOrLoss })}</h2>

            <main className="container">
                <section></section>
                <section className="button-container">
                    {Object.values(colorMap).map(color => (
                        <button
                            className={getButtonControlClassName({ color })}
                            key={color}
                            onClick={() => {
                                handleColorClick({ color });
                            }}
                        ></button>
                    ))}
                </section>
                <section>
                    <button
                        className="play font-family"
                        onClick={handlePlayClick}
                    >
                        {!gameStarted && patternDisplayed === null
                            ? "Start Play"
                            : gameStarted && patternDisplayed === null
                            ? "Please Wait"
                            : gameStarted && winOrLoss === false
                            ? "Play Again!"
                            : "Play "}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default App;
