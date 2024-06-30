import {SettingsContext, totalTimeToTimestamp} from "./App";
import {useContext} from "react";

export function Notes({notesObj, displayZeroTimestamp}) {
    const {displayTimestampWhen} = useContext(SettingsContext);

    // TODO: Add way to nudge the offset time a bit
    const notesList = [];
    for (let note in notesObj) {
        const item = notesObj[note];
        const timestampNumbers = totalTimeToTimestamp(item.timestamp);
        const timestampPostfix = item.timestampOnEnter ? 's' : 'e';
        // TODO: Note this appears weird when pasted into Obsidian... make a markdown mode?
        let timestampFragment = (
            <>
                <b>{timestampNumbers}: </b>
            </>
        );
        if (displayTimestampWhen) {
            timestampFragment = (
                <>
                    <b>{timestampNumbers}</b>{timestampPostfix}<b>: </b>
                </>
            );
        }

        notesList.push(
            <li key={item.id}>
                {displayZeroTimestamp ? timestampFragment : ''}{item.note}
            </li>
        );
    }

    return (
        <>
            <i>{notesList.length === 0 && 'Notes will appear in this area!'}</i>
            <ul>
                {notesList}
            </ul>
        </>
    );
}