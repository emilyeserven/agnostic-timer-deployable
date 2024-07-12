import {SettingsBlock, SettingsContext} from "./App";
import {useContext} from "react";
import {toggleDarkMode} from "./utils.js";

export function DisplaySettings() {
    const {
        displayTimestampWhen,
        setDisplayTimestampWhen,
        displayZeroTimestamp,
        setDisplayZeroTimestamp,
        noteTitle,
        setNoteTitle,
        darkMode,
        setDarkMode
    } = useContext(SettingsContext);



    return (
        <>
            <h3>Display Settings</h3>
            <p>Settings that mostly impact how the list is displayed. Can be easily used to customize so you can paste into your notes for permanent notage.</p>
            <div className='settings-grid'>
                <SettingsBlock
                    headerText={"Display when timestamp was recorded?"}>
                    This currently {displayTimestampWhen ? 'is shown' : 'is not shown'}.<br />
                    {displayTimestampWhen && (
                        <i>
                            Timestamps recorded when you started to type a note are indicated with an "s".<br />
                            Timestamps recorded when you hit the enter key are indicated with an "e".
                        </i>
                    )}
                    <button onClick={() => {setDisplayTimestampWhen(!displayTimestampWhen)}}>{displayTimestampWhen ? 'Hide this' : 'Show this'}</button>
                </SettingsBlock>
                <SettingsBlock
                    headerText={"Display timestamps that are at 0?"}>
                    This currently {displayZeroTimestamp ? 'is shown' : 'is not shown'}.<br />
                    <button onClick={() => {setDisplayZeroTimestamp(!displayZeroTimestamp)}}>{displayZeroTimestamp ? 'Hide this' : 'Show this'}</button>
                </SettingsBlock>
                <SettingsBlock
                    headerText={"Change Header Text"}>
                    <input type='text' name='noteTitle' value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                </SettingsBlock>
                <SettingsBlock
                    headerText={"Dark mode?"}>
                    Theme is currently {darkMode}.<br />
                    <button onClick={() => {setDarkMode(toggleDarkMode(darkMode))}}>Set to other mode</button>
                </SettingsBlock>
            </div>
        </>
    )
}