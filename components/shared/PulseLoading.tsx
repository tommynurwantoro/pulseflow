export function PulseLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
            <path
              className="pulse-line"
              d="M10,50 L25,50 L30,30 L40,70 L50,20 L60,80 L70,40 L75,50 L90,50"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="200"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Pulseflow
        </h1>
        <p className="text-slate-500 mt-2 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
