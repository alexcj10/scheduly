
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  return (
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
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
          <Button className="w-full mt-2">Update Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
