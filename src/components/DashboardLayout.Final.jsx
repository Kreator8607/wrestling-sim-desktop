import React, { useState } from 'react';
import { Home, Download, Database, Zap, Settings, LogOut, Folder, Globe, Image, Save, Plug, MessageCircle, Disc3, Award } from 'lucide-react';
import '../styles/pro-wrestling-theme.css';

export const DashboardLayout = ({ children, currentPage, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState(currentPage || 'dashboard');

  const localFiles = [
    'A World at War',
    'Then, Now & Forever Mod Mario Edition'
  ];

  const workshopFiles = [
    'Then, Now & Forever Mod Mario Edition'
  ];

  const topPromotions = [
    { name: 'World Wrestling Entertainment', logo: '🏆' },
    { name: 'All Elite Wrestling', logo: '🎯' },
    { name: 'New Japan Pro Wrestling', logo: '🔥' },
    { name: 'Pro Wrestling NOAH', logo: '🌍' },
    { name: 'World Wonder Ring Stardom', logo: '⭐' },
    { name: 'Total Nonstop Action Wrestling', logo: '⚡' },
    { name: 'DDT Pro Wrestling', logo: '🎪' },
    { name: 'All Japan Pro Wrestling', logo: '🇯🇵' },
    { name: 'Lucha Libre AAA World Wide', logo: '🔴' }
  ];

  const topWorkers = [
    { name: 'Dwayne Johnson', avatar: '👨' },
    { name: 'John Cena', avatar: '💪' },
    { name: 'Demi Bennett', avatar: '👩' },
    { name: 'Joe Anoa\'i', avatar: '👨' },
    { name: 'CM Punk', avatar: '🎸' },
    { name: 'Cody Rhodes', avatar: '👨' },
    { name: 'Rey Mysterio', avatar: '🎭' },
    { name: 'Logan Paul', avatar: '👨' },
    { name: 'Kenny Omega', avatar: '🎮' }
  ];

  const bottomButtons = [
    { label: 'SAIR PARA O MENU PRINCIPAL', icon: '🏠' },
    { label: 'COSTAS', icon: '⬅️' },
    { label: 'PRÓXIMO', icon: '➡️' }
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    onNavigate?.(menuId);
  };

  return (
    <div className="app-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-title">
          ⚡ Pro Wrestling Sim
          <span>v3.0.0</span>
        </div>
        <div className="top-bar-right">
          <button className="top-bar-button">_</button>
          <button className="top-bar-button">□</button>
          <button className="top-bar-button">✕</button>
        </div>
      </div>

      {/* Main Container */}
      <div className="app-container">
        {/* Left Sidebar */}
        <div className="sidebar-left">
          <div className="sidebar-section-title">LOCAL FILES</div>
          {localFiles.map((file, idx) => (
            <div
              key={idx}
              className={`sidebar-item ${activeMenu === `file-${idx}` ? 'active' : ''}`}
              onClick={() => handleMenuClick(`file-${idx}`)}
            >
              {file}
            </div>
          ))}

          <div className="sidebar-section-title">WORKSHOP FILES</div>
          {workshopFiles.map((file, idx) => (
            <div
              key={idx}
              className={`sidebar-item ${activeMenu === `workshop-${idx}` ? 'active' : ''}`}
              onClick={() => handleMenuClick(`workshop-${idx}`)}
            >
              {file}
            </div>
          ))}
        </div>

        {/* Center Content */}
        <div className="content-center">
          <div className="content-header">Select a Database</div>
          <div className="content-main">
            {children || (
              <div className="content-card fade-in">
                <div className="content-card-title">PRO WRESTLING SIM</div>
                <div className="content-card-text">
                  <p>Welcome to Pro Wrestling Sim v3.0.0</p>
                  <p style={{ marginTop: '10px' }}>Select a game or create a new one to get started.</p>
                  <p style={{ marginTop: '10px', fontSize: '11px', color: '#999999' }}>
                    Features: 20+ Game Systems | 5,000+ Wrestlers | 100+ Promotions | Advanced Statistics
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Top Promotions */}
        <div className="sidebar-right">
          <div className="right-panel">
            <div className="panel-title">TOP PROMOTIONS</div>
            {topPromotions.map((promo, idx) => (
              <div key={idx} className="panel-item">
                <div className="panel-item-avatar">{promo.logo}</div>
                <div className="panel-item-info">
                  <div className="panel-item-name">{promo.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Top Workers */}
          <div className="right-panel">
            <div className="panel-title">TOP WORKERS</div>
            {topWorkers.map((worker, idx) => (
              <div key={idx} className="panel-item">
                <div className="panel-item-avatar">{worker.avatar}</div>
                <div className="panel-item-info">
                  <div className="panel-item-name">{worker.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bottom-buttons">
        {bottomButtons.map((btn, idx) => (
          <button key={idx} className="bottom-button">
            <span>{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
        <button className="bottom-button" style={{ marginLeft: 'auto' }}>
          <span>📁</span>
          <span>Abrir pasta do jogo</span>
        </button>
        <button className="bottom-button">
          <span>🌍</span>
          <span>Open Worlds Folder</span>
        </button>
        <button className="bottom-button">
          <span>🖼️</span>
          <span>Open Images Folder</span>
        </button>
        <button className="bottom-button">
          <span>💾</span>
          <span>Abrir pasta de salvamentos</span>
        </button>
        <button className="bottom-button">
          <span>🔌</span>
          <span>Open Plugins Folder</span>
        </button>
        <button className="bottom-button">
          <span>💬</span>
          <span>Steam Discussion Page</span>
        </button>
        <button className="bottom-button">
          <span>🎮</span>
          <span>Discord</span>
        </button>
        <button className="bottom-button">
          <span>⭐</span>
          <span>Créditos</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;
