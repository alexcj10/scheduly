
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, setProfile, UserProfile } from "@/lib/localProfile";
import { useFeedbackToast } from "@/lib/useFeedbackToast";

export default function Account() {
  const [profile, setProfileState] = useState<UserProfile>(() => getProfile());
  const [saving, setSaving] = useState(false);
  const { success } = useFeedbackToast();

  useEffect(() => {
    setProfileState(getProfile());
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfileState(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setProfile(profile);
      setSaving(false);
      success("Profile Updated", "Your account details have been saved.");
    }, 400);
  }

  return (
    <DashboardLayout>
      <div className="py-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex bg-secondary/50 text-secondary p-3 rounded-full">
            <User className="w-6 h-6 text-secondary" />
          </span>
          <h2 className="text-2xl font-bold text-secondary">Account</h2>
        </div>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="font-medium text-sm">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className="mt-1"
                value={profile.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="email" className="font-medium text-sm">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="jane@email.com"
                className="mt-1"
                value={profile.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="bio" className="font-medium text-sm">Bio</label>
              <Input
                id="bio"
                type="text"
                placeholder="Short bio..."
                className="mt-1"
                value={profile.bio}
                onChange={handleChange}
                autoComplete="off"
                disabled={saving}
              />
            </div>
            <Button className="w-full mt-2" type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
