import './App.css';
import {useStopwatch} from 'react-timer-hook';
import {createContext, useEffect, useState} from "react";
import {Notes} from "./Notes";
import {DisplaySettings} from "./DisplaySettings";
import {LOCAL_STORAGE_KEYS, THEME} from "./constants.js";

// TODO: Make it typescript I guess
// TODO: Would be lovely to have a button that copies all this in markdown format or something.
//    Extra points: With options to format timestamps with italics (or not!)
// TODO: Make it so that even if you accidentally refresh, stuff is cached and you won't get fuq'd
// TODO: Have a way to save/load settings
// TODO: Maybe make the settings true/false/etc dropdowns instead of buttons later
// TODO: Context stuff: https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component


// TODO: Consider having a DisplaySettings Context and a FunctionSettingsContext?
export const SettingsContext = createContext({
    displayTimestampWhen: false,
    setDisplayTimestampWhen: () => {},
    displayZeroTimestamp: true,
    setDisplayZeroTimestamp: () => {},
    noteTitle: 'Notes List',
    setNoteTitle: () => {},
});

export const totalTimeToTimestamp = (time) => {
    return new Date(time * 1000).toISOString().substring(11, 19);
}

const makeNumberTwoDigitsMinimum = (number) => {
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
}

export function SettingsBlock({headerText, children}) {
    return (
        <div className='settings-block'>
            <h4>{headerText}</h4>
            {children}
        </div>
    );
}

// From: https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
const useThemeDetector = () => {
    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
    const mqListener = (e => {
        setIsDarkTheme(e.matches);
    });

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addListener(mqListener);
        return () => darkThemeMq.removeListener(mqListener);
    }, []);
    return isDarkTheme;
}


export function App() {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch();

    localStorage.setItem("testVal", "Froggy");
    const testVal = localStorage.getItem("testVal");
    const testVal2 = localStorage.getItem("nonexistent");
    console.log(testVal);
    console.log(testVal2);


    // Get the theme from the system
    const detectedTheme = useThemeDetector();

    const getDarkTheme = () => {
        let darkModeValue = '';
        // check for a local storage value
        const lsDarkMode = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
        console.log('lsDarkMode', lsDarkMode);
        // if it's null, use System as value and then set localStorage
        if (lsDarkMode === null) {
            // No system theme yet due to just using a button to toggle
            /*
                darkModeValue = detectedTheme;
                localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, THEME.SYSTEM);
             */
            darkModeValue = THEME.DARK;
            localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, THEME.DARK);
        } else if (lsDarkMode === THEME.SYSTEM) {
            // if it's set to "system", we need to check the system's theme
            darkModeValue = detectedTheme;
        } else {
            darkModeValue = lsDarkMode;
        }
        // if not null, use whatever setting is listed
        return darkModeValue;
    }


    const darkModeToUse = getDarkTheme();
    console.log('isDarkTheme', darkModeToUse);

    // TODO: Some of this should be context and not state
    const [darkMode, setDarkMode] = useState(darkModeToUse);
    const [notes, setNotes] = useState({});
    const [newNote, setNewNote] = useState('');
    const [totalSecondsAtStart, setTotalSecondsAtStart] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState({ts: 0, num: 0});

    // state for context
    const [displayTimestampWhen, setDisplayTimestampWhen] = useState(false);
    const [displayZeroTimestamp, setDisplayZeroTimestamp] = useState(true);
    const [noteTitle, setNoteTitle] = useState('Notes List');
    // need to implement
    const [timestampOnEnter, setTimestampOnEnter] = useState(true);
    const [displayTimestampToUse, setDisplayTimestampToUse] = useState(false);
    const [totalSecondsOffset, setTotalSecondsOffset]  = useState(0);

    const contextValues = {
        displayTimestampWhen,
        setDisplayTimestampWhen,
        displayZeroTimestamp,
        setDisplayZeroTimestamp,
        noteTitle,
        setNoteTitle,
        darkMode,
        setDarkMode
    };

    function handleNoteChange(e) {
        if (newNote === '') {
            setTotalSecondsAtStart(totalSeconds);
        };
        setNewNote(e.target.value);
    }

    // WILL BE MOVED
    function handleTotalSecondsOffset(e) {
        Number(e.target.value);
        // TODO: Show error if not a number
        setTotalSecondsOffset(e.target.value);

    }


    function handleSubmit(e) {
        e.preventDefault();
        if (newNote) {
//    const noteObj = {timestamp: totalSeconds, {note: newNote}};
            const noteTotalSeconds = timestampOnEnter ? totalSeconds : totalSecondsAtStart;
            let noteListToPush = {...notes};

            // Because state can be slow, this can definitely be cheated. But in practical usage that's very unlikely.
            const noteId = `${noteTotalSeconds} (${lastTimestamp.num})`;

            // TODO: Instead of using that clumsy detail object, make an actual formatted date so less is stored
            noteListToPush[noteId] = {
                id: noteId,
                timestamp: +noteTotalSeconds + +totalSecondsOffset,
                note: newNote,
                subId: lastTimestamp.num,
                timestampOnEnter,
            };

            const isTimestampOfPrevNoteSame = noteTotalSeconds === lastTimestamp.ts;

            if (isTimestampOfPrevNoteSame) {
                setLastTimestamp({ts: noteTotalSeconds, num: (lastTimestamp.num + 1)});
            } else {
                setLastTimestamp({ts: noteTotalSeconds, num: 0});
            }
            setNotes({...noteListToPush});
            setNewNote('');
        }
    }

    // TODO: Make a setting that adds a message that the timestamps were generated with the tool

    return (
        <SettingsContext.Provider value={contextValues}>
            <div className={`app ${darkMode === THEME.DARK && 'dark-mode'}`}>
                <div className='timer-area'>
                    <h1>Media-Agnostic Relatively-TImestamped Notetaker</h1>
                    <p>Or, uh, MARTIN for short.</p>
                    <p>I'm using this for anime I watch on TV but you do you.<br />Probably also good for podcasts!</p>
                    <div className='main-timer'>
                        <span>{makeNumberTwoDigitsMinimum(hours)}</span>:
                        <span>{makeNumberTwoDigitsMinimum(minutes)}</span>:
                        <span>{makeNumberTwoDigitsMinimum(seconds)}</span>
                    </div>
                    {displayTimestampToUse && (
                        <div className='timestamp-to-record'>
                            {totalTimeToTimestamp(timestampOnEnter ? totalSeconds : totalSecondsAtStart)}
                        </div>
                    )}
                    <p>{isRunning ? 'Running' : 'Not running'}</p>
                    <div className='control-buttons'>
                        <button onClick={start}>Start</button>
                        <button onClick={pause}>Pause</button>
                        <button onClick={reset}>Reset</button>
                    </div>
                </div>
                <br />
                <div className='content-area'>
                    <form onSubmit={handleSubmit}>
                        <input type='text' name='note' value={newNote} onChange={handleNoteChange} placeholder='Type your notes here and hit enter to add them to the list.'/>
                    </form>
                    <br />
                    <h2>{noteTitle ? noteTitle : 'Notes List'}</h2>
                    <div>
                        <Notes notesObj={notes} displayZeroTimestamp={displayZeroTimestamp} totalSecondsOffset={totalSecondsOffset}/>
                    </div>
                    <br />
                    <hr />
                    <h2>Settings</h2>
                    <div className='settings-container'>
                        <div className='settings'>
                            <h3>Functional Settings</h3>
                            <p>Settings that impact how notes are taken.</p>
                            <div className='settings-grid'>
                                <SettingsBlock
                                    headerText={"When Timestamp is Recorded"}>
                                    Timestamp used is currently {timestampOnEnter ? 'set when the enter key is pressed' : 'set when you start typing a note'}.<br />
                                    <button onClick={() => {setTimestampOnEnter(!timestampOnEnter)}}>
                                        {timestampOnEnter ? 'Change it to "when I start typing"' : 'Change it to "when I press enter"'}
                                    </button>
                                </SettingsBlock>
                                <div className='settings-block'>
                                    <h4>Display Timestamp to be Recorded</h4>
                                    Display the timestamp that will be recorded under the timer. Currently, {displayTimestampToUse ? 'it is being shown' : 'it is hidden'}.<br />
                                    <button onClick={() => setDisplayTimestampToUse(!displayTimestampToUse)}>
                                        {displayTimestampToUse ? 'Hide the timestamp to use' : 'Show the timestamp to use'}
                                    </button>
                                </div>
                                <div className='settings-block'>
                                    <h4>Change Timestamp Offset</h4>
                                    Use if your timer is just a little off and you don't want to do the work of resyncing. Offsets by seconds only, and is NOT retroactive.<br />
                                    <input type='text' name='totalSecondsOffset' value={totalSecondsOffset} onChange={handleTotalSecondsOffset} />
                                </div>
                            </div>
                        </div>
                        <div className='settings'>
                            <DisplaySettings />
                        </div>
                    </div>
                </div>
            </div>
        </SettingsContext.Provider>
    );
}

export default App;
