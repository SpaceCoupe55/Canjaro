import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

console.log('main.jsx loaded')

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderFallback = (error) => {
  root.render(
    <React.StrictMode>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-4">App failed to load</h1>
          <pre className="text-sm text-left bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{String(error && (error.message || error))}</pre>
          <p className="mt-4 text-sm text-gray-600">Check the terminal for full stack trace.</p>
        </div>
      </div>
    </React.StrictMode>
  )
}

// Dynamically import App so we can catch module/runtime errors and show a helpful page
import('./App.jsx')
  .then((module) => {
    const App = module.default
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
  .catch((err) => {
    console.error('Failed to load App:', err)
    renderFallback(err)
  })