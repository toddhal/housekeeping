import { Routes, Route } from 'react-router-dom'

// Placeholder App — full routes wired up in Task 11.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6 font-display">Hello, House Cleaning!</div>} />
    </Routes>
  )
}
