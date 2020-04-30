import React, { useEffect, useState, useMemo } from "react";

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
    const [isGameInPlay, setIsGameInPlay] = useState(false);
    const [hasWon, setHasWon] = useState(null);
    const [isFlashing, setIsFlashing] = useState({});
    const [pattern, setPattern] = useState({});
    const [colorsClicked, setColorsClicked] = useState([]);
    const [flashPatternFinished, setFlashPatternFinished] = useState(false);

    useEffect(() => {
        if (!isEmpty(pattern)) {
            setIsFlashing({ 0: pattern[0] });
        }
    }, [pattern]);

    useEffect(() => {
        const currentPatternIndex = Number(Object.keys(isFlashing));
        if (
            !isEmpty(isFlashing) &&
            currentPatternIndex === Object.values(pattern).length - 1
        ) {
            setFlashPatternFinished(true);
        } else {
            flash({ isFlashing, pattern });
        }
    }, [isFlashing, pattern]);

    useEffect(() => {
        if (isGameInPlay && hasWon === null) {
            const timeoutId = setTimeout(params => {
                setHasWon(false);
                setIsGameInPlay(false);
            }, 8000);
            return params => {
                clearTimeout(timeoutId);
            };
        }
    }, [isGameInPlay, hasWon]);

    useEffect(() => {
        if (!isEmpty(pattern) && !!colorsClicked.length) {
            setHasWon(validateClicks({ pattern, colorsClicked }));
        }
    }, [colorsClicked, pattern]);

    const flash = ({ isFlashing, pattern }) => {
        const currentPatternIndex = Number(Object.keys(isFlashing));
        delay(() => {
            setIsFlashing(prevState => {
                const newPatternIndex = currentPatternIndex + 1;
                return { [newPatternIndex]: pattern[newPatternIndex] };
            });
        }, 500);
    };

    const getButtonControlClassName = ({ color = "", isGameInPlay }) => {
        return `button-control ${color} ${
            Object.values(isFlashing)[0] === color ? "isFlashing" : null
        } ${isGameInPlay ? null : "gameNotInPlay"}`;
    };
    const getPlayButtonClasName = ({ isGameInPlay, flashPatternFinished }) => {
        return `play font-family ${
            isGameInPlay && !flashPatternFinished ? "disabled" : null
        }  `;
    };

    const handlePlayClick = () => {
        if (!isGameInPlay) {
            setPattern(generatePattern({}));
            setIsGameInPlay(true);
        }
        if (hasWon !== null) {
            setHasWon(null);
            setIsGameInPlay(false);
            setPattern({});
        }
    };

    const handleColorClick = ({ color = "" }) => {
        if (isGameInPlay) {
            setColorsClicked(prevState => [...prevState, color]);
        }
    };

    const renderHeadingText = ({ hasWon }) => {
        let text;

        switch (hasWon) {
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
        isGameInPlay,
        flashPatternFinished,
        hasWon
    }) => {
        let text;
        switch (true) {
            case isGameInPlay && !flashPatternFinished:
                text = "Please Wait";
                break;
            case hasWon === true || hasWon === false:
                text = "Play Again!";
                break;
            default:
                text = "Play";
                break;
        }
        return text;
    };

    const memoizedPlayButtonText = useMemo(
        () =>
            renderPlayButtonText({
                isGameInPlay,
                flashPatternFinished,
                hasWon
            }),
        [isGameInPlay, flashPatternFinished, hasWon]
    );

    const memoizedHeaderText = useMemo(() => renderHeadingText({ hasWon }), [
        hasWon
    ]);

    return (
        <div className="App">
            <header className="App-header font-family">
                Simon0.2 Classic Edition
            </header>
            <main className="container">
                <section>
                    {" "}
                    <h2 className="font-family">{memoizedHeaderText}</h2>
                </section>
                <section className="button-container">
                    {Object.values(colorMap).map(color => (
                        <button
                            disabled={isGameInPlay && !flashPatternFinished}
                            className={getButtonControlClassName({
                                color,
                                isGameInPlay,
                                flashPatternFinished
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
                            isGameInPlay,
                            flashPatternFinished
                        })}
                        onClick={handlePlayClick}
                    >
                        {memoizedPlayButtonText}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default App;
