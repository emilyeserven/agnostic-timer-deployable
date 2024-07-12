// From: https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
import {useEffect, useState} from "react";
import {LOCAL_STORAGE_KEYS, THEME} from "./constants.js";

export const useThemeDetector = () => {
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

export const getDarkTheme = () => {
    let darkModeValue = '';

    // Get the theme from the system
    const detectedTheme = useThemeDetector();

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