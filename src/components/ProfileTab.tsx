import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Globe, Key, Save, Settings as SettingsIcon } from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { motion } from 'framer-motion';
import { TelegramConfig } from '../types';
import { cn } from '../lib/utils';

interface ProfileTabProps {
  telegram: TelegramConfig;
  onUpdateTelegram: (config: TelegramConfig) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ telegram, onUpdateTelegram }) => {
  const [profile, setProfile] = useState({
    name: 'Fikiraben',
    email: 'fikiraben@gmail.com',
    role: 'Elite Trader',
    avatar: 'https://picsum.photos/seed/trader/200/200',
    bio: 'Institutional order flow trader specializing in SMC and liquidity concepts.',
    location: 'London, UK',
    joined: 'March 2024'
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8 p-10 terminal-glass rounded-[2.5rem] border border-border">
        <div className="relative group">
          <img src={profile.avatar} alt="Avatar" className="w-40 h-40 rounded-[2rem] object-cover border-4 border-accent/20 group-hover:border-accent transition-all duration-500" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-2xl border-2 border-bg">
            <User size={20} />
          </div>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest text-[10px]">{profile.role}</Badge>
            <Badge variant="info" className="bg-accent/10 text-accent border-accent/20 uppercase tracking-widest text-[10px]">Verified</Badge>
          </div>
          <h2 className="text-5xl font-display tracking-tight text-white">{profile.name}</h2>
          <p className="text-text-secondary text-lg font-light max-w-md">{profile.bio}</p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-text-secondary text-sm font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Mail size={14} className="text-accent" /> {profile.email}</span>
            <span className="flex items-center gap-2"><Globe size={14} className="text-accent" /> {profile.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Telegram Integration" icon={<Key size={18} />} className="terminal-glass">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Bot Token</label>
              <input 
                type="password" 
                value={telegram.botToken}
                onChange={(e) => onUpdateTelegram({ ...telegram, botToken: e.target.value })}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent transition-all text-white font-mono"
                placeholder="Enter Bot Token"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Chat ID</label>
              <input 
                type="text" 
                value={telegram.chatId}
                onChange={(e) => onUpdateTelegram({ ...telegram, chatId: e.target.value })}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent transition-all text-white font-mono"
                placeholder="Enter Chat ID"
              />
            </div>
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border group hover:border-accent/30 transition-all">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Enable Notifications</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Receive real-time signals on Telegram</p>
              </div>
              <button 
                onClick={() => onUpdateTelegram({ ...telegram, enabled: !telegram.enabled })}
                className={cn(
                  "w-14 h-7 rounded-full transition-all relative border border-white/10",
                  telegram.enabled ? "bg-accent" : "bg-white/5"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all",
                  telegram.enabled ? "left-8" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </Card>

        <Card title="Preferences" icon={<SettingsIcon size={18} />} className="terminal-glass">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border hover:border-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-widest">Default Timezone</span>
              </div>
              <Badge variant="info" className="bg-accent/10 text-accent border-accent/20">UTC+0</Badge>
            </div>
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border hover:border-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Bell size={18} />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-widest">Sound Alerts</span>
              </div>
              <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border hover:border-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Shield size={18} />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-widest">Two-Factor Auth</span>
              </div>
              <Badge variant="info" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Setup</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button className="gap-3 px-10 py-6 rounded-2xl bg-accent hover:shadow-2xl hover:shadow-accent/40 transition-all">
          <Save size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Save Configuration</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
