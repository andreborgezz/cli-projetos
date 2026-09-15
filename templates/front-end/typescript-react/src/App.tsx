import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '800px' }}>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>Hello React + TypeScript!</h1>
        <p>This is a complete template with components.</p>
      </main>
      <Footer />
    </div>
  )
}

export default App
