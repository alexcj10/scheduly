
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardTitle, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, BellRing, Mail, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, setSettings } from "@/lib/localProfile";
import { useFeedbackToast } from "@/lib/useFeedbackToast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { InspirationEngine } from "@/components/InspirationEngine";

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false);
  const [settingsState, setSettingsState] = useState(() => getSettings());
  const [saving, setSaving] = useState(false);
  const { success } = useFeedbackToast();
  
  const [aiFrequency, setAiFrequency] = useState("weekly");

  useEffect(() => {
    setSettingsState(getSettings());
    setLoaded(true);
  }, []);

  function handleSwitch(type: "emailNotif" | "pushNotif" | "aiSuggestions", value: boolean) {
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
      success("Settings Updated", "Your preferences have been saved.");
    }, 350);
  }

  if (!loaded) return null;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via email
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settingsState.emailNotif} 
                  onCheckedChange={val => handleSwitch("emailNotif", val)} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts directly to your device
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settingsState.pushNotif} 
                  onCheckedChange={val => handleSwitch("pushNotif", val)} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">AI Content Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get AI-powered content recommendations
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settingsState.aiSuggestions ?? true} 
                  onCheckedChange={val => handleSwitch("aiSuggestions", val)} 
                />
              </div>
              
              {(settingsState.aiSuggestions ?? true) && (
                <div className="pl-10 mt-2">
                  <Label className="text-sm mb-2 block">
                    Suggestion frequency
                  </Label>
                  <Select 
                    defaultValue={aiFrequency} 
                    onValueChange={setAiFrequency} 
                    value={aiFrequency}
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Only when I request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Button 
            className="w-full" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? "Updating..." : "Save Settings"}
          </Button>
        </div>
        
        <div className="space-y-6">
          <InspirationEngine />
        </div>
      </div>
    </DashboardLayout>
  );
}
