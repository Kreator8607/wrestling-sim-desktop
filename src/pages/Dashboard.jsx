import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Trophy, Zap, Calendar, AlertCircle } from 'lucide-react';
import { WrestlerAvatar, PromotionLogo } from '../utils/avatarGenerator';
import { AudioSystem } from '../utils/audioSystem';

/**
 * Enhanced Dashboard with Avatars and Animations
 */
export default function EnhancedDashboard() {
  const [wrestlers, setWrestlers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalWrestlers: 0,
    totalPromotions: 0,
    averageQuality: 0,
  });

  useEffect(() => {
    // Initialize audio system
    AudioSystem.init();

    // Load sample data
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Sample wrestlers with avatars
    const sampleWrestlers = [
      {
        id: 1,
        name: 'Roman Reigns',
        wrestling: 92,
        entertainment: 88,
        starPower: 98,
        intimidation: 95,
        sexAppeal: 85,
      },
      {
        id: 2,
        name: 'The Rock',
        wrestling: 88,
        entertainment: 95,
        starPower: 99,
        intimidation: 90,
        sexAppeal: 92,
      },
      {
        id: 3,
        name: 'John Cena',
        wrestling: 85,
        entertainment: 92,
        starPower: 96,
        intimidation: 88,
        sexAppeal: 90,
      },
      {
        id: 4,
        name: 'Undertaker',
        wrestling: 90,
        entertainment: 85,
        starPower: 95,
        intimidation: 99,
        sexAppeal: 75,
      },
      {
        id: 5,
        name: 'Stone Cold',
        wrestling: 88,
        entertainment: 98,
        starPower: 97,
        intimidation: 92,
        sexAppeal: 88,
      },
    ];

    const samplePromotions = [
      { id: 1, name: 'WWE', country: 'USA', wrestlers: 500, titles: 15 },
      { id: 2, name: 'AEW', country: 'USA', wrestlers: 300, titles: 10 },
      { id: 3, name: 'NJPW', country: 'Japan', wrestlers: 250, titles: 12 },
      { id: 4, name: 'TNA', country: 'USA', wrestlers: 150, titles: 8 },
      { id: 5, name: 'ROH', country: 'USA', wrestlers: 120, titles: 7 },
    ];

    setWrestlers(sampleWrestlers);
    setPromotions(samplePromotions);

    // Calculate stats
    setStats({
      totalMatches: 1250,
      totalWrestlers: 5000,
      totalPromotions: 100,
      averageQuality: 8.5,
    });

    // Play welcome sound
    AudioSystem.playSuccess();
  };

  const handleWrestlerClick = (wrestler) => {
    AudioSystem.playClick();
    console.log('Clicked wrestler:', wrestler);
  };

  const handlePromotionClick = (promotion) => {
    AudioSystem.playClick();
    console.log('Clicked promotion:', promotion);
  };

  return (
    <div className="page-enter p-6 space-y-6">
      {/* Header */}
      <div className="slide-in-up">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao Pro Wrestling Sim v3.0.0</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Zap}
          label="Total Matches"
          value={stats.totalMatches}
          trend="+12%"
        />
        <StatCard
          icon={Users}
          label="Total Wrestlers"
          value={stats.totalWrestlers}
          trend="+64%"
        />
        <StatCard
          icon={Trophy}
          label="Promotions"
          value={stats.totalPromotions}
          trend="+72%"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Quality"
          value={stats.averageQuality}
          trend="+5%"
        />
      </div>

      {/* Top Wrestlers with Avatars */}
      <div className="bg-card border border-border rounded-lg p-6 hover-lift">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Top Wrestlers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {wrestlers.map((wrestler) => (
            <div
              key={wrestler.id}
              className="hover-scale cursor-pointer transition-transform"
              onClick={() => handleWrestlerClick(wrestler)}
            >
              <div className="bg-secondary rounded-lg p-4 text-center hover:bg-secondary/80 transition-colors">
                <WrestlerAvatar wrestler={wrestler} size={80} className="mx-auto mb-3" />
                <h3 className="font-semibold text-foreground truncate">{wrestler.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Rating: {Math.round((wrestler.wrestling + wrestler.entertainment + wrestler.starPower + wrestler.intimidation + wrestler.sexAppeal) / 5)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions with Logos */}
      <div className="bg-card border border-border rounded-lg p-6 hover-lift">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Top Promotions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="hover-scale cursor-pointer transition-transform"
              onClick={() => handlePromotionClick(promotion)}
            >
              <div className="bg-secondary rounded-lg p-4 text-center hover:bg-secondary/80 transition-colors">
                <PromotionLogo promotion={promotion} size={80} className="mx-auto mb-3" />
                <h3 className="font-semibold text-foreground truncate">{promotion.name}</h3>
                <p className="text-sm text-muted-foreground">{promotion.wrestlers} wrestlers</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-card border border-border rounded-lg p-6 hover-lift">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Recent Events
        </h2>

        <div className="space-y-3">
          <EventItem
            title="WrestleMania 40"
            promotion="WWE"
            date="March 2024"
            matches={12}
          />
          <EventItem
            title="Dynamite Special"
            promotion="AEW"
            date="March 2024"
            matches={8}
          />
          <EventItem
            title="Wrestle Kingdom 18"
            promotion="NJPW"
            date="March 2024"
            matches={10}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          label="Create Event"
          icon={Calendar}
          onClick={() => AudioSystem.playClick()}
        />
        <QuickActionButton
          label="Simulate Match"
          icon={Zap}
          onClick={() => AudioSystem.playMatchStart()}
        />
        <QuickActionButton
          label="View Rankings"
          icon={TrendingUp}
          onClick={() => AudioSystem.playClick()}
        />
        <QuickActionButton
          label="Manage Wrestlers"
          icon={Users}
          onClick={() => AudioSystem.playClick()}
        />
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-lift transition-all">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

/**
 * Event Item Component
 */
function EventItem({ title, promotion, date, matches }) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer hover-scale">
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {promotion} • {date}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">{matches}</p>
        <p className="text-xs text-muted-foreground">matches</p>
      </div>
    </div>
  );
}

/**
 * Quick Action Button Component
 */
function QuickActionButton({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="button-press bg-primary text-primary-foreground rounded-lg p-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold"
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}
