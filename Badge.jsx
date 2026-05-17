import clsx from 'clsx'

const variantClasses = {
  accent: 'border-publishing-burgundy/30 bg-publishing-burgundy/10 text-publishing-burgundy',
  success: 'border-publishing-success/30 bg-publishing-success/10 text-publishing-success',
  warning: 'border-publishing-gold/40 bg-publishing-gold/10 text-publishing-gold',
  danger: 'border-publishing-danger/30 bg-publishing-danger/10 text-publishing-danger',
  cyan: 'border-publishing-cyan/30 bg-publishing-cyan/10 text-publishing-cyan',
  muted: 'border-publishing-muted/30 bg-publishing-panel text-publishing-muted',
}

const Badge = ({ children, variant = 'muted', className }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
)

export default Badge