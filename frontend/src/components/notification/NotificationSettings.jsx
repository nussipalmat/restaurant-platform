const NotificationSettings = () => {
  const settingsList = [
    { key: 'push_enabled', label: 'In-App Notifications', group: 'Active', enabled: true },
    { key: 'email_order_updates', label: 'Email alerts', group: 'Future', enabled: false },
    { key: 'sms_order_updates', label: 'SMS updates', group: 'Future', enabled: false },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-0 border-4 border-black divide-y-4 divide-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {settingsList.map((setting) => (
          <div 
            key={setting.key} 
            className={`flex items-center justify-between p-6 transition-colors ${
              setting.enabled ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            <div className="pr-4">
              <p className={`text-sm font-black uppercase tracking-tighter ${
                setting.enabled ? 'text-black' : 'text-gray-400'
              }`}>
                {setting.label}
              </p>
              <div className="mt-1">
                {setting.group === 'Active' ? (
                  <span className="text-[10px] font-black text-green-600 uppercase italic">
                    ● System Online
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-2 py-0.5 border-2 border-black bg-yellow-400 text-black uppercase">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>

            <button
              disabled={!setting.enabled}
              className={`relative inline-flex h-8 w-16 items-center border-4 border-black transition-all ${
                setting.enabled 
                  ? 'bg-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]' 
                  : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 border-2 border-black bg-white transition-transform ${
                  setting.enabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-black text-white border-4 border-black text-center italic font-black uppercase text-[10px] tracking-[0.2em]">
        End of Configuration Module
      </div>
    </div>
  );
};

export default NotificationSettings;