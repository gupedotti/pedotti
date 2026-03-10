import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Clients from './components/Clients';
import About from './components/About';
import Solutions from './components/Solutions';
import Projects from './components/Projects';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <About />
        <Solutions />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
