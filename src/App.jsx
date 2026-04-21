import { useState, useEffect } from 'react';
import { Router, Route } from 'wouter';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import History from './pages/History';
import Rankings from './pages/Rankings';
import Titles from './pages/Titles';
import AutoSimulation from './pages/AutoSimulation';
import Injuries from './pages/Injuries';
import Achievements from './pages/Achievements';
import CareerMode from './pages/CareerMode';
import Customization from './pages/Customization';
import AdvancedStats from './pages/AdvancedStats';
import Settings from './pages/Settings';
import BackupRecovery from './pages/BackupRecovery';
import ContentManagement from './pages/ContentManagement';
import DashboardLayout from './components/DashboardLayout';
import { ThemeProvider } from './components/ThemeProvider';
import { InteractiveTutorial } from './components/InteractiveTutorial';

export default function App() {
  const [appVersion, setAppVersion] = useState('3.0.0');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <DashboardLayout>
          <Route path="/" component={Dashboard} />
          <Route path="/booking" component={Booking} />
          <Route path="/history" component={History} />
          <Route path="/rankings" component={Rankings} />
          <Route path="/titles" component={Titles} />
          <Route path="/auto-simulation" component={AutoSimulation} />
          <Route path="/injuries" component={Injuries} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/career-mode" component={CareerMode} />
          <Route path="/customization" component={Customization} />
          <Route path="/advanced-stats" component={AdvancedStats} />
          <Route path="/settings" component={Settings} />
          <Route path="/backup-recovery" component={BackupRecovery} />
          <Route path="/content-management" component={ContentManagement} />
        </DashboardLayout>
      </Router>
      <InteractiveTutorial />
    </ThemeProvider>
  );
}
