import { useEffect, useState } from 'react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
        bg-gradient-to-br from-orange-400 to-orange-500
        hover:from-orange-500 hover:to-orange-600
        text-white rounded-full shadow-lg
        transition-all duration-300
        hover:scale-110 hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-orange-300
        z-[9998]
        flex items-center justify-center
        animate-fadeIn"
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
    >
      <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      <span className="absolute inset-0 rounded-full bg-orange-400 opacity-0 hover:opacity-20 animate-pulse" />
    </button>
  )
}
