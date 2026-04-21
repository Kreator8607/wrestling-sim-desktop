import { useState } from 'react';
import { Moon, Sun, Keyboard, RotateCcw, Save, Bell, Volume2 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    theme: theme,
    notifications: true,
    soundEffects: true,
    autoSave: true,
    autoSaveInterval: 5,
    showTutorial: false,
    language: 'pt-BR',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
      const defaults = {
        theme: 'dark',
        notifications: true,
        soundEffects: true,
        autoSave: true,
        autoSaveInterval: 5,
        showTutorial: false,
        language: 'pt-BR',
      };
      setSettings(defaults);
      localStorage.setItem('app-settings', JSON.stringify(defaults));
    }
  };

  const handleResetTutorial = () => {
    localStorage.removeItem('tutorial-completed');
    alert('Tutorial será exibido na próxima vez que você abrir o aplicativo');
  };

  const keyboardShortcuts = [
    { key: 'Ctrl+N', action: 'Novo Evento' },
    { key: 'Ctrl+S', action: 'Salvar' },
    { key: 'Ctrl+E', action: 'Editar' },
    { key: 'Ctrl+D', action: 'Deletar' },
    { key: 'F1', action: 'Ajuda' },
    { key: 'Ctrl+K', action: 'Busca Global' },
    { key: 'Ctrl+,', action: 'Configurações' },
    { key: 'Ctrl+T', action: 'Novo Lutador' },
  ];

  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no Pro Wrestling Sim</p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-sm font-medium text-green-600">Configurações salvas com sucesso!</p>
        </div>
      )}

      {/* Theme Settings */}
      <SettingCard
        icon={theme === 'dark' ? Moon : Sun}
        title="Tema"
        description="Escolha entre tema escuro ou claro"
      >
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSettings({ ...settings, theme: 'dark' });
              if (theme !== 'dark') toggleTheme();
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              settings.theme === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Moon className="w-4 h-4" />
            Escuro
          </button>
          <button
            onClick={() => {
              setSettings({ ...settings, theme: 'light' });
              if (theme !== 'light') toggleTheme();
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              settings.theme === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Sun className="w-4 h-4" />
            Claro
          </button>
        </div>
      </SettingCard>

      {/* Notifications */}
      <SettingCard
        icon={Bell}
        title="Notificações"
        description="Controle as notificações do aplicativo"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Ativar notificações</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => setSettings({ ...settings, soundEffects: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Sons de notificação</span>
          </label>
        </div>
      </SettingCard>

      {/* Auto-Save */}
      <SettingCard
        icon={Save}
        title="Auto-Save"
        description="Salve automaticamente seu progresso"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Ativar auto-save</span>
          </label>
          {settings.autoSave && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Intervalo (minutos): {settings.autoSaveInterval}
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.autoSaveInterval}
                onChange={(e) => setSettings({ ...settings, autoSaveInterval: parseInt(e.target.value) })}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </SettingCard>

      {/* Tutorial */}
      <SettingCard
        icon={Keyboard}
        title="Tutorial"
        description="Reabra o tutorial interativo"
      >
        <button
          onClick={handleResetTutorial}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Reabrir Tutorial
        </button>
      </SettingCard>

      {/* Keyboard Shortcuts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          Atalhos de Teclado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyboardShortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono font-bold">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <SettingCard
        icon={Keyboard}
        title="Idioma"
        description="Selecione o idioma do aplicativo"
      >
        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (United States)</option>
          <option value="es-ES">Español (España)</option>
        </select>
      </SettingCard>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-red-600">Zona de Perigo</h3>
        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar Todas as Configurações
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          Salvar Configurações
        </button>
      </div>

      {/* About */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">Sobre</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Aplicativo:</strong> Pro Wrestling Sim Desktop</p>
          <p><strong>Versão:</strong> 3.0.0 (em desenvolvimento)</p>
          <p><strong>Plataforma:</strong> Windows 7+</p>
          <p><strong>Desenvolvedor:</strong> Pro Wrestling Sim Team</p>
        </div>
      </div>
    </div>
  );
}
