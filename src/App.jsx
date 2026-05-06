import { Routes, Route } from 'react-router-dom'
import CleanerView from './pages/CleanerView.jsx'

// Full routing wired up in Task 11.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CleanerView />} />
    </Routes>
  )
}
