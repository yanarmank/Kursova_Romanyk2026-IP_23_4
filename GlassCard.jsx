import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useThemeSettings } from '../../context/ThemeContext'

const GlassCard = ({ children, className, delay = 0 }) => {
  const { themeSettings } = useThemeSettings()

  if (!themeSettings.animatedCards) {
    return <div className={clsx('glass-card', className)}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: 'easeOut' }}
      className={clsx('glass-card', className)}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
