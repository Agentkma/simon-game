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
                setIsPatternDisplayed(prevState => true);
                return;
            } else {
                flash({ isFlashing, pattern });
            }
        }
    }, [isFlashing]);

    useEffect(() => {
        if (isGameStarted && winOrLoss === null) {
            const timeoutId = setTimeout(params => {
                setWinOrLoss(prevState => false);
            }, 8000);
            return params => {
                clearTimeout(timeoutId);
            };
        }
    }, [isGameStarted, winOrLoss]);

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

    const getButtonControlClassName = ({
        color = "",
        isGameStarted,
        isPatternDisplayed
    }) => {
        return `button-control ${color} ${
            Object.values(isFlashing)[0] === color ? "isFlashing" : null
        }`;
    };
    const getPlayButtonClasName = ({ isGameStarted, isPatternDisplayed }) => {
        return `play font-family ${
            isGameStarted && !isPatternDisplayed ? "disabled" : null
        }`;
    };

    const handlePlayClick = () => {
        if (!isGameStarted) {
            setPattern(generatePattern({}));
            setIsGameStarted(true);
        } else {
            setIsGameStarted(false);
            setWinOrLoss(null);
        }
    };

    const handleColorClick = ({ color = "" }) => {
        setColorsClicked(prevState => [...prevState, color]);
    };

    const renderHeadingText = ({ winOrLoss }) => {
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

    const renderPlayButtonText = ({
        isGameStarted,
        isPatternDisplayed,
        winOrLoss
    }) => {
        let text;
        switch (true) {
            case !isGameStarted && !isPatternDisplayed:
                text = "Start Play";
                break;
            case isGameStarted && !isPatternDisplayed:
                text = "Please Wait";
                break;
            case isGameStarted && winOrLoss === false:
                text = "Play Again!";
                break;
            default:
                text = "Play";
                break;
        }
        return text;
    };

    return (
        <div className="App">
            <header className="App-header font-family">
                Simon0.2 Classic Edition
            </header>

            <h2 className="font-family">{renderHeadingText({ winOrLoss })}</h2>

            <main className="container">
                <section></section>
                <section className="button-container">
                    {Object.values(colorMap).map(color => (
                        <button
                            disabled={isGameStarted && !isPatternDisplayed}
                            className={getButtonControlClassName({
                                color,
                                isGameStarted,
                                isPatternDisplayed
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
                            isPatternDisplayed
                        })}
                        onClick={handlePlayClick}
                    >
                        {renderPlayButtonText({
                            isGameStarted,
                            isPatternDisplayed,
                            winOrLoss
                        })}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default App;
