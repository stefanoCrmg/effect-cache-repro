import { createGlobalTheme, createTheme, createThemeContract, globalStyle } from "@vanilla-extract/css"
import { colors } from "./tokens"

// Define our global theme tokens
export const vars = createGlobalTheme(":root", {
  space: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },
  colors: {
    current: colors.current,
    transparent: colors.transparent,
    white: colors.white,
    black: colors.black,
    gray50: colors.gray[50],
    gray100: colors.gray[100],
    gray200: colors.gray[200],
    gray300: colors.gray[300],
    gray400: colors.gray[400],
    gray500: colors.gray[500],
    gray600: colors.gray[600],
    gray700: colors.gray[700],
    gray800: colors.gray[800],
    gray900: colors.gray[900],
    gray950: colors.gray[950],
    amber50: colors.amber[50],
    amber100: colors.amber[100],
    amber200: colors.amber[200],
    amber300: colors.amber[300],
    amber400: colors.amber[400],
    amber500: colors.amber[500],
    amber600: colors.amber[600],
    amber700: colors.amber[700],
    amber800: colors.amber[800],
    amber900: colors.amber[900],
    amber950: colors.amber[950],
  },
  fontSizes: {
    small: "0.875rem",
    base: "1rem",
    large: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  fonts: {
    body: "'Inter', system-ui, -apple-system, sans-serif",
  },
})

// Theme contract for light/dark mode
const themeContract = createThemeContract({
  colors: {
    background: null,
    foreground: null,
    primary: null,
    muted: null,
    border: null,
  },
})

export const lightTheme = createTheme(themeContract, {
  colors: {
    background: vars.colors.white,
    foreground: vars.colors.gray900,
    primary: vars.colors.amber500,
    muted: vars.colors.gray600,
    border: vars.colors.gray200,
  },
})

export const darkTheme = createTheme(themeContract, {
  colors: {
    background: vars.colors.gray900,
    foreground: vars.colors.gray50,
    primary: vars.colors.amber400,
    muted: vars.colors.gray400,
    border: vars.colors.gray700,
  },
})

// Global styles
globalStyle("html, body", {
  fontFamily: vars.fonts.body,
  margin: 0,
  padding: 0,
  backgroundColor: themeContract.colors.background,
  color: themeContract.colors.foreground,
})

globalStyle("html", {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
})

export type Theme = typeof themeContract
