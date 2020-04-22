import React, { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
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
    const patternArray = Array.from(Array(numberOfFlashes)).map(
        () => colorMap[getRandomInt(4)]
    );
    return patternArray;
};

const validateClicks = ({ pattern = [], colorsClicked = [] }) => {
    if (pattern.length !== colorsClicked.length) {
        return false;
    }
    const misMatches = pattern.filter(
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
    const [isFlashing, setIsFlashing] = useState(null);
    const [pattern, setPattern] = useState([]);
    const [colorsClicked, setColorsClicked] = useState([]);
    const [patternDisplayed, setPatternDisplayed] = useState(null);

    useEffect(() => {
        if (!!pattern.length) {
            startFlashSequence({ pattern });
        }
    }, [pattern]);

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
        if (!!colorsClicked.length && !!pattern.length && winOrLoss === null) {
            setWinOrLoss(validateClicks({ pattern, colorsClicked }));
        }
    }, [pattern, colorsClicked, winOrLoss]);

    const startFlashSequence = ({ pattern }) => {
        return pattern.forEach((color, index) => {
            const timeoutId = setTimeout(params => {
                setIsFlashing(prevState => color);
                if (index === pattern.length - 1) {
                    setPatternDisplayed(true);
                }
            }, 500);
            return params => {
                clearTimeout(timeoutId);
            };
        });
    };

    // LET use a patter of 4 flashes

    // 4 square button with 4 colors
    // the app will make a succession of color flashes in a pattern on these buttons
    // that the user must then repeat by clicking on them
    // need user input / click on these
    // after clicking there is a sucess or fail message for the user...

    // we need a way to generate the button flashes, assume random pattern
    // we need a way to store that generated pattern so we can tell if user correctly clicked/followed the pattern
    // then need to validate their pattern and present the success or fail messaging/visuals
    // then we need to reset our state...this could be auto or manual through a play now button

    const getClassName = ({ color = "" }) => {
        return `${color} ${isFlashing === color ? "isFlashing" : null}`;
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

    return (
        <div className="App">
            <header className="App-header font-family">
                Dispatch Health: Interview Code Challenge
            </header>

            <h2 className="font-family">
                {winOrLoss === null
                    ? "Good Luck"
                    : winOrLoss
                    ? "You Won!"
                    : "Sorry, You Lost :("}
            </h2>

            <main className="container">
                <section></section>
                <section className="button-container">
                    {Object.values(colorMap).map(color => (
                        <button
                            className={getClassName({ color })}
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
