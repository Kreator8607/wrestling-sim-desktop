import { useState, useEffect } from 'react';
import { Router, Route } from 'wouter';
import Home from './pages/Home';
import Booking from './pages/Booking';
import History from './pages/History';
import Rankings from './pages/Rankings';
import Titles from './pages/Titles';
import AutoSimulation from './pages/AutoSimulation';
import Injuries from './pages/Injuries';
import Navigation from './components/Navigation';

export default function App() {
  const [appVersion, setAppVersion] = useState('2.0.0');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Navigation />
        <main className="flex-1 overflow-auto">
          <Route path="/" component={Home} />
          <Route path="/booking" component={Booking} />
          <Route path="/history" component={History} />
          <Route path="/rankings" component={Rankings} />
          <Route path="/titles" component={Titles} />
          <Route path="/auto-simulation" component={AutoSimulation} />
          <Route path="/injuries" component={Injuries} />
        </main>
      </div>
    </Router>
  );
}
