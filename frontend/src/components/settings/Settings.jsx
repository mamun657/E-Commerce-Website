import { useEffect, useMemo, useState } from 'react';
import { Shield, MapPin, CreditCard, Bell, Globe2, Eye, Smartphone, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

const STORAGE_KEY = 'accountSettingsPrefs';

const defaultPrefs = {
  notifications: { email: true, push: false },
  privacyPublicProfile: true,
  language: 'en',
  region: 'BDT',
};

const settingsList = [
  {
    id: 'login',
    title: 'Login & Security',
    description: 'Change password, manage phone/email',
    icon: Shield,
    action: 'Manage access',
  },
  {
    id: 'addresses',
    title: 'Addresses',
    description: 'Shipping address management',
    icon: MapPin,
    action: 'Edit addresses',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Payment methods placeholder',
    icon: CreditCard,
    action: 'Manage payments',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Email and push preferences',
    icon: Bell,
    action: 'Edit preferences',
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Language and currency preference',
    icon: Globe2,
    action: 'Choose language',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Profile visibility toggle',
    icon: Eye,
    action: 'Adjust privacy',
  },
  {
    id: 'devices',
    title: 'Devices & Sessions',
    description: 'Review active sessions',
    icon: Smartphone,
    action: 'View devices',
  },
  {
    id: 'danger',
    title: 'Danger Zone',
    description: 'Logout or delete account',
    icon: AlertTriangle,
    action: 'Open actions',
  },
];

const readPrefs = () => {
  if (typeof window === 'undefined') return defaultPrefs;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
  } catch (error) {
    console.warn('Failed to parse settings prefs', error);
    return defaultPrefs;
  }
};

const SettingsCard = ({ title, description, icon: Icon, action, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-4 py-4 text-left shadow-[0_20px_80px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-[0_25px_90px_-20px_rgba(34,211,238,0.35)]"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300/90 transition group-hover:text-cyan-200">
      {action}
    </span>
  </button>
);

const SettingsModal = ({ settingId, onClose, prefs, setPrefs }) => {
  const setting = useMemo(() => settingsList.find((s) => s.id === settingId), [settingId]);
  if (!setting) return null;
  const Icon = setting.icon;

  const toggleNotif = (key) => setPrefs((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));
  const updateLanguage = (value) => setPrefs((prev) => ({ ...prev, language: value }));
  const updateRegion = (value) => setPrefs((prev) => ({ ...prev, region: value }));
  const togglePrivacy = () => setPrefs((prev) => ({ ...prev, privacyPublicProfile: !prev.privacyPublicProfile }));

  const renderContent = () => {
    switch (setting.id) {
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium">Email alerts</p>
                <p className="text-sm text-muted-foreground">Orders, promos, and account updates</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.notifications.email}
                onChange={() => toggleNotif('email')}
                className="h-4 w-4 accent-cyan-400"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium">Push notifications</p>
                <p className="text-sm text-muted-foreground">Realtime alerts (placeholder)</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.notifications.push}
                onChange={() => toggleNotif('push')}
                className="h-4 w-4 accent-cyan-400"
              />
            </div>
          </div>
        );
      case 'login':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Login & Security</h3>
            <p className="text-sm text-muted-foreground">Manage password, phone, and email. (Placeholder UI)</p>
            <Button variant="gradient" className="w-full" onClick={() => alert('Change password placeholder')}>
              Change password
            </Button>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Addresses</h3>
            <p className="text-sm text-muted-foreground">Add or edit your shipping addresses. (Placeholder UI)</p>
            <Button variant="outline" className="w-full" onClick={() => alert('Manage addresses placeholder')}>
              Manage addresses
            </Button>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payments</h3>
            <p className="text-sm text-muted-foreground">Store cards or wallets here. (Placeholder UI)</p>
            <Button variant="outline" className="w-full" onClick={() => alert('Add payment method placeholder')}>
              Add payment method
            </Button>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Language & Region</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Language</label>
              <select
                value={prefs.language}
                onChange={(e) => updateLanguage(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-white/5 px-3 py-2 text-foreground"
              >
                <option value="en">English (EN)</option>
                <option value="bn">Bangla (BN)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Currency / Region</label>
              <select
                value={prefs.region}
                onChange={(e) => updateRegion(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-white/5 px-3 py-2 text-foreground"
              >
                <option value="BDT">BDT — Bangladeshi Taka</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy</h3>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium">Public profile</p>
                <p className="text-sm text-muted-foreground">Allow others to view your profile basics</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.privacyPublicProfile}
                onChange={togglePrivacy}
                className="h-4 w-4 accent-cyan-400"
              />
            </div>
          </div>
        );
      case 'devices':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Devices & Sessions</h3>
            <div className="rounded-lg border border-border/60 bg-white/5 p-4">
              <p className="text-sm text-muted-foreground">Session list placeholder. Show current device and recent sessions here.</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => alert('Sign out all (placeholder)')}>
              Sign out all
            </Button>
          </div>
        );
      case 'danger':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <Button variant="outline" className="w-full" onClick={() => alert('Logout placeholder')}>
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => alert('Delete account placeholder')}>
              <AlertTriangle size={16} className="mr-2" /> Delete account
            </Button>
          </div>
        );
      default:
        return (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Feature coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
        <div className="flex items-center gap-3 mb-4">
          {Icon ? <Icon size={18} className="text-cyan-300" /> : null}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{setting.title}</p>
            <p className="text-2xl font-semibold text-foreground">{setting.description}</p>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export const Settings = () => {
  const [prefs, setPrefs] = useState(readPrefs);
  const [openSetting, setOpenSetting] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        {settingsList.map((setting) => (
          <SettingsCard
            key={setting.id}
            title={setting.title}
            description={setting.description}
            icon={setting.icon}
            action={setting.action}
            onClick={() => setOpenSetting(setting.id)}
          />
        ))}
      </div>

      {openSetting && (
        <SettingsModal
          settingId={openSetting}
          onClose={() => setOpenSetting(null)}
          prefs={prefs}
          setPrefs={setPrefs}
        />
      )}
    </div>
  );
};

export default Settings;
