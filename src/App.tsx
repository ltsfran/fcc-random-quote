import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'failure' | 'success'

interface Quote {
  id: number
  quote: string
  author: string
}

interface QuoteDTO {
  quotes: Quote[]
  total: number
  skip: number
  limit: number
}

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}

const COLORS = [
  '#16a085',
  '#27ae60',
  '#2c3e50',
  '#f39c12',
  '#e74c3c',
  '#9b59b6',
  '#FB6964',
  '#342224',
  '#472E32',
  '#BDBB99',
  '#77B1A9',
  '#73A857'
]

export default function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [quoteGroup, setQuoteGroup] = useState<Quote[]>([])

  useEffect(() => {
    const fetchQuotes = async () => {
      setStatus('loading')
      try {
        const response = await fetch('https://dummyjson.com/quotes')
        const data = (await response.json()) as QuoteDTO
        const randomQuotes = shuffle(data.quotes)
        setQuoteGroup(randomQuotes)
        setStatus('success')
      } catch (error) {
        setStatus('failure')
        if (error instanceof Error) {
          setErrorMessage(error.message)
        }
        setErrorMessage('Could not fetch quotes')
      }
    }

    fetchQuotes().catch(console.error)
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClick = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === quoteGroup.length - 1) {
        return 0
      }
      return prevIndex + 1
    })
    setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)])
  }

  const [currentColor, setCurrentColor] = useState(COLORS[0])

  if (status === 'idle' || status === 'loading')
    return (
      <div className="flex min-h-dvh w-full flex-wrap items-center justify-center bg-[#2c3e50]">
        <div className="text-white">Loading...</div>
      </div>
    )
  if (status === 'failure')
    return (
      <div className="flex min-h-dvh w-full flex-wrap items-center justify-center bg-[#2c3e50]">
        <div>{errorMessage}</div>
      </div>
    )

  return (
    <div
      className="flex min-h-dvh w-full flex-wrap items-center justify-center transition-all duration-500"
      style={{ backgroundColor: currentColor, color: currentColor }}
    >
      <div
        id="quote-box"
        className="w-full max-w-[550px] rounded-sm bg-white px-12 py-10 transition-all duration-500"
        style={{ color: currentColor }}
      >
        <div id="text" className="text-3xl">
          {quoteGroup[currentIndex].quote}
        </div>
        <div id="author">- {quoteGroup[currentIndex].author}</div>
        <div className="mt-2 flex w-full flex-wrap items-center justify-between">
          <a id="tweet-quote" href="twitter.com/intent/tweet">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>
          <button
            id="new-quote"
            onClick={handleClick}
            className="rounded p-2 text-xs text-white transition-all duration-500"
            style={{ backgroundColor: currentColor }}
          >
            New quote
          </button>
        </div>
      </div>
    </div>
  )
}
