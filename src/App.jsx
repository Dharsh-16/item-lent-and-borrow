import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyItems } from './pages/MyItems';
import { Reminders } from './pages/Reminders';
import { Friends } from './pages/Friends';
import { Analytics } from './pages/Analytics';
import { ActivityHistory } from './pages/ActivityHistory';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<MyItems />} />
            <Route path="items/lent" element={<MyItems forcedType="lent" />} />
            <Route path="items/borrowed" element={<MyItems forcedType="borrowed" />} />
            <Route path="lent" element={<Navigate to="/items/lent" replace />} />
            <Route path="borrowed" element={<Navigate to="/items/borrowed" replace />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="friends" element={<Friends />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="activity" element={<ActivityHistory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
