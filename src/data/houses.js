import defaultTasks from './defaultTasks'
import ethansTasks from './ethansTasks'

const houses = [
  {
    id: 'home',
    label: "Todd's House",
    emoji: '🏠',
    tasks: defaultTasks,
    introNote: '💡 Feel free to light candles before you start so it smells amazing when you\'re done!',
  },
  {
    id: 'ethan',
    label: "Ethan's House",
    emoji: '🏡',
    tasks: ethansTasks,
    introNote: '💡 Feel free to light candles before you start — the lighter is in the tall hutch in the living room. Do NOT use the Tineco in bathrooms!',
  },
]

export default houses
