import React, { useState } from 'react';
import { Menu, X, Settings, Home, Trophy, Users, Zap, Database, HelpCircle, Github, Download, Disc3, LogOut } from 'lucide-react';
import '../styles/diagonal-background.css';

export const DashboardLayout = ({ children, currentPage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'NOVO JOGO',
      description: 'Iniciar um novo mundo de jogo.',
      icon: Home
    },
    {
      id: 'load-game',
      title: 'CARREGAR JOGO',
      description: 'Carregar um jogo salvo anteriormente.',
      icon: Download
    },
    {
      id: 'database',
      title: 'EDITAR BANCO DE DADOS',
      description: 'Editar ou criar mundos de jogo e gerenciar mods.',
      icon: Database
    },
    {
      id: 'office',
      title: 'OFICINA',
      description: 'Navegar e baixar mods e mundos de jogo feitos pela comunidade.',
      icon: Zap
    },
    {
      id: 'settings',
      title: 'CONFIGURAÇÕES',
      description: 'Ajustar configurações e preferências do jogo.',
      icon: Settings
    },
    {
      id: 'exit',
      title: 'SAIR',
      description: 'Sair do jogo.',
      icon: LogOut
    }
  ];

  const bottomButtons = [
    { label: 'Abrir pasta do jogo', icon: '📁' },
    { label: 'Open Worlds Folder', icon: '🌍' },
    { label: 'Open Images Folder', icon: '🖼️' },
    { label: 'Abrir pasta de salvamentos', icon: '💾' },
    { label: 'Open Plugins Folder', icon: '🔌' },
    { label: 'Steam Discussion Page', icon: '💬' },
    { label: 'Discord', icon: '🎮' },
    { label: 'Créditos', icon: '⭐' }
  ];

  return (
    <div>
      {/* Diagonal Background */}
      <div className="diagonal-background"></div>

      {/* Version Badge */}
      <div className="version-badge">
        Version 3.0.0
      </div>

      {/* Main App Container */}
      <div className="app-container">
        {/* Sidebar Menu */}
        <div className="sidebar-menu">
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ color: '#cc0000', fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>
              ⚡ Pro Wrestling Sim
            </h1>
            <p style={{ color: '#999999', fontSize: '11px' }}>v3.0.0</p>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={16} />
                  <span className="menu-item-title">{item.title}</span>
                </div>
                <div className="menu-item-description">{item.description}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {children}
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* What's New Section */}
          <div className="panel-section">
            <div className="panel-title">📰 What's New</div>
            <div className="panel-content">
              <div className="panel-item">
                • Booking and Hiring improvements for AI promotions
              </div>
              <div className="panel-item">
                • More translations!
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="panel-section">
            <div className="panel-title">✨ Features</div>
            <div className="panel-content">
              <div className="panel-item">
                • 20+ Game Features
              </div>
              <div className="panel-item">
                • 5,000+ Wrestlers
              </div>
              <div className="panel-item">
                • 100+ Promotions
              </div>
              <div className="panel-item">
                • Advanced Statistics
              </div>
              <div className="panel-item">
                • Achievement System
              </div>
            </div>
          </div>

          {/* Enable Plugins Section */}
          <div className="panel-section">
            <div className="panel-title">🔌 Enable Plugins</div>
            <div style={{ marginTop: '10px' }}>
              <select style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #cc0000',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bottom-buttons">
        {bottomButtons.map((btn, idx) => (
          <button
            key={idx}
            className="bottom-button"
            onClick={() => console.log(`Clicked: ${btn.label}`)}
          >
            <span>{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;
