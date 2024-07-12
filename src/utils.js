import {useEffect, useState} from "react";
import {LOCAL_STORAGE_KEYS, THEME} from "./constants.js";

/**
 * Detects the system theme.
 * @link https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
 * @returns {boolean}
 */
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

/**
 * Checks to see if localStorage has a value and uses that.
 * Otherwise, default to dark mode (for now).
 * @returns {string|boolean}
 */
export const getDarkTheme = () => {
    let darkModeValue;

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

/**
 * Toggle Dark Mode between Light and Dark. Will not be useful after transition to
 * select boxes. This method doesn't do the state toggling (only the local storage toggling,
 * which is kind of weird and needs to be rewritten, but it does provides the item to toggle to.
 * @param currentMode string - The current mode to be toggled, Light or Dark.
 */
export const toggleDarkMode = (currentMode) => {
    let newDarkModeVal;

    if (currentMode === THEME.DARK) {
        newDarkModeVal = THEME.LIGHT;
        localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, THEME.LIGHT);
    } else {
        newDarkModeVal = THEME.DARK;
        localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, THEME.DARK);
    }

    return newDarkModeVal;
}