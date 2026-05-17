const LoadingState = ({ label = 'Завантаження даних спільноти...' }) => (
  <div className="grid min-h-[60vh] place-items-center px-6">
    <div className="glass-card flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
      <div className="h-12 w-12 animate-spin rounded-lg border-2 border-gaming-accent border-t-gaming-success" />
      <div>
        <p className="text-base font-semibold text-gaming-text">{label}</p>
        <p className="mt-1 text-sm text-gaming-muted">Локальні JSON-дані готуються до показу.</p>
      </div>
    </div>
  </div>
)

export default LoadingState
