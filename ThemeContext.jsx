import { createContext, useContext, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState({
    compactMode: false,
    animatedCards: true,
    highContrast: false,
  })

  const updateThemeSetting = (key, value) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }))
  }

  const value = useMemo(() => ({ themeSettings, updateThemeSetting }), [themeSettings])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useThemeSettings = () => useContext(ThemeContext)