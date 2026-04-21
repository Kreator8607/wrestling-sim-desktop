import { useState, useEffect } from 'react';
import { ChevronRight, X, CheckCircle } from 'lucide-react';

export function InteractiveTutorial() {
  const [isOpen, setIsOpen] = useState(() => {
    const completed = localStorage.getItem('tutorial-completed');
    return !completed;
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Pro Wrestling Sim!',
      description: 'Este é um simulador profissional de wrestling. Vamos te mostrar como começar.',
      target: null,
      action: 'Próximo',
    },
    {
      id: 'booking',
      title: 'Criar Eventos',
      description: 'Use a seção "Booking" para criar novos eventos de wrestling com múltiplos matches.',
      target: 'booking',
      action: 'Próximo',
    },
    {
      id: 'simulation',
      title: 'Simular Matches',
      description: 'Cada match é simulado com base nos atributos dos lutadores e tática escolhida.',
      target: 'auto',
      action: 'Próximo',
    },
    {
      id: 'rankings',
      title: 'Acompanhar Rankings',
      description: 'Veja o ranking dos lutadores em tempo real na seção "Rankings".',
      target: 'rankings',
      action: 'Próximo',
    },
    {
      id: 'titles',
      title: 'Gerenciar Títulos',
      description: 'Gerencie campeonatos e histórico de reinados na seção "Títulos".',
      target: 'titles',
      action: 'Próximo',
    },
    {
      id: 'achievements',
      title: 'Desbloqueie Achievements',
      description: 'Complete objetivos e desbloqueie achievements para ganhar pontos.',
      target: 'achievements',
      action: 'Próximo',
    },
    {
      id: 'career',
      title: 'Modo Carreira',
      description: 'Acompanhe a carreira de um lutador específico e complete seus objetivos.',
      target: 'career',
      action: 'Próximo',
    },
    {
      id: 'stats',
      title: 'Estatísticas Avançadas',
      description: 'Analise dados detalhados e métricas de desempenho na seção "Estatísticas".',
      target: 'stats',
      action: 'Concluir',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Tutorial Card - Responsive for 1024x768 */}
      <div className="absolute bottom-4 right-4 w-full max-w-sm sm:w-96 bg-card border border-border rounded-lg shadow-2xl pointer-events-auto mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-bold text-lg">{step.title}</h3>
            <p className="text-xs text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-foreground">{step.description}</p>

          {/* Tips */}
          {step.id === 'welcome' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">💡 Dica:</p>
              <p className="text-xs text-muted-foreground">
                Você pode pular este tutorial a qualquer momento. Para reabrir, acesse as configurações.
              </p>
            </div>
          )}

          {step.id === 'simulation' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">⚡ Dica:</p>
              <p className="text-xs text-muted-foreground">
                Use "Auto Simulação" para simular múltiplos eventos automaticamente.
              </p>
            </div>
          )}

          {step.id === 'achievements' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">🏆 Dica:</p>
              <p className="text-xs text-muted-foreground">
                Desbloqueie achievements para ganhar pontos e desbloquear novas funcionalidades.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={handleSkip}
            className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            Pular
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {step.action}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicators - Responsive */}
      <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-auto flex-wrap max-w-xs">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentStep
                ? 'bg-primary w-6'
                : idx < currentStep
                ? 'bg-green-500'
                : 'bg-secondary'
            }`}
            title={`Passo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
