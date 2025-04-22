
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, setSettings } from "@/lib/localProfile";
import { useFeedbackToast } from "@/lib/useFeedbackToast";

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false);
  const [settingsState, setSettingsState] = useState(() => getSettings());
  const [saving, setSaving] = useState(false);
  const { success } = useFeedbackToast();

  useEffect(() => {
    setSettingsState(getSettings());
    setLoaded(true);
  }, []);

  function handleSwitch(type: "emailNotif" | "pushNotif", value: boolean) {
    setSettingsState(prev => ({
      ...prev,
      [type]: value
    }));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSettings(settingsState);
      setSaving(false);
      success("Settings Updated", "Your notification preferences have been saved.");
    }, 350);
  }

  if (!loaded) return null;

  return (
    <DashboardLayout>
      <div className="py-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex bg-tertiary/20 text-tertiary p-3 rounded-full">
            <Settings className="w-6 h-6 text-tertiary" />
          </span>
          <h2 className="text-2xl font-bold text-tertiary">Settings</h2>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch checked={settingsState.emailNotif} onCheckedChange={val => handleSwitch("emailNotif", val)} />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <Switch checked={settingsState.pushNotif} onCheckedChange={val => handleSwitch("pushNotif", val)} />
            </div>
            <Button className="w-full mt-2" onClick={handleSave} disabled={saving}>
              {saving ? "Updating..." : "Update Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
