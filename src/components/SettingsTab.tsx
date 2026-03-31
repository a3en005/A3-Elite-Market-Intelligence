import React from 'react';
import { Card, Button, Badge } from './UI';
import { Settings as SettingsIcon, Bell, Shield, Smartphone, Database, RefreshCw, Trash2, Globe, Lock, Cpu, Info } from 'lucide-react';
import { TelegramConfig } from '../types';
import { motion } from 'framer-motion';

interface SettingsTabProps {
  telegram: TelegramConfig;
  onUpdateTelegram: (config: TelegramConfig) => void;
  onClearData: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ telegram, onUpdateTelegram, onClearData }) => {
  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="info">Platform Configuration</Badge>
        <h2 className="text-8xl font-display font-black tracking-tighter leading-none">System Preferences</h2>
        <p className="text-text-secondary text-3xl font-light max-w-3xl leading-relaxed">
          Tailor your institutional environment. Configure neural notifications, 
          data persistence, and security protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Telegram Section */}
        <Card 
          title="Neural Notifications" 
          icon={<Smartphone size={24} className="text-accent" />} 
          subtitle="Real-time signal delivery to your mobile device"
          className="p-12 terminal-glass rounded-[3.5rem]"
        >
          <div className="space-y-10 mt-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Bot Token</label>
                <input 
                  type="password" 
                  value={telegram.botToken}
                  onChange={(e) => onUpdateTelegram({ ...telegram, botToken: e.target.value })}
                  placeholder="123456789:ABC..."
                  className="w-full bg-white/5 border border-border rounded-3xl px-8 py-6 text-lg text-white focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">Chat ID</label>
                <input 
                  type="text" 
                  value={telegram.chatId}
                  onChange={(e) => onUpdateTelegram({ ...telegram, chatId: e.target.value })}
                  placeholder="987654321"
                  className="w-full bg-white/5 border border-border rounded-3xl px-8 py-6 text-lg text-white focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all font-bold"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-border">
              <div className="flex items-center gap-4">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="tg-enabled"
                    checked={telegram.enabled}
                    onChange={(e) => onUpdateTelegram({ ...telegram, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:border-border after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent after:peer-checked:bg-white"></div>
                </div>
                <label htmlFor="tg-enabled" className="text-lg font-bold text-white cursor-pointer">Enable Live Alerts</label>
              </div>
              <Button variant="secondary" className="px-6 py-3 text-sm">Test</Button>
            </div>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-border space-y-4">
              <div className="flex items-center gap-3 text-accent">
                <Info size={18} />
                <p className="text-xs font-black uppercase tracking-[0.3em]">Setup Protocol</p>
              </div>
              <div className="space-y-3 text-sm text-text-secondary font-medium leading-relaxed">
                <p>1. Initiate @BotFather on Telegram to generate a unique Token.</p>
                <p>2. Query @userinfobot to retrieve your secure Chat ID.</p>
                <p>3. Establish a session with your bot before activation.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data & Security Section */}
        <div className="space-y-12">
          <Card 
            title="Data Persistence" 
            icon={<Database size={24} className="text-accent" />} 
            subtitle="Manage local storage and state snapshots"
            className="p-12 terminal-glass rounded-[3.5rem]"
          >
            <div className="space-y-6 mt-10">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-border group hover:border-accent/20 transition-all">
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white tracking-tight">Local Archive</p>
                  <p className="text-sm text-text-secondary font-medium">Journal entries and settings</p>
                </div>
                <Button variant="danger" className="px-6 py-3 text-sm" onClick={onClearData}>
                  <Trash2 size={18} /> Purge
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-border group hover:border-accent/20 transition-all">
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white tracking-tight">System Cache</p>
                  <p className="text-sm text-text-secondary font-medium">Price data and analysis snapshots</p>
                </div>
                <Button variant="secondary" className="px-6 py-3 text-sm">
                  <RefreshCw size={18} /> Flush
                </Button>
              </div>
            </div>
          </Card>

          <Card 
            title="Security Protocol" 
            icon={<Lock size={24} className="text-accent" />} 
            subtitle="Encryption and access control"
            className="p-12 terminal-glass rounded-[3.5rem]"
          >
            <div className="space-y-6 mt-10">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-border">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                    <Cpu size={28} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-white tracking-tight">Neural Encryption</p>
                    <p className="text-sm text-text-secondary font-medium">AES-256 local storage encryption</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Active</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-center pt-20 space-y-3">
        <p className="text-xs text-text-secondary/40 font-black uppercase tracking-[0.5em]">A3-Elite Intelligence Platform v3.1</p>
        <p className="text-xs text-text-secondary/10 font-black uppercase tracking-[0.3em]">Institutional Grade Execution Engine</p>
      </div>
    </div>
  );
};

export default SettingsTab;
