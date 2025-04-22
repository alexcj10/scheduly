
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function Account() {
  return (
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
            <Input id="name" type="text" placeholder="Jane Doe" className="mt-1" defaultValue="Jane Doe" />
          </div>
          <div>
            <label htmlFor="email" className="font-medium text-sm">Email</label>
            <Input id="email" type="email" placeholder="jane@email.com" className="mt-1" defaultValue="jane@email.com" />
          </div>
          <div>
            <label htmlFor="bio" className="font-medium text-sm">Bio</label>
            <Input id="bio" type="text" placeholder="Short bio..." className="mt-1" defaultValue="Social media enthusiast!" />
          </div>
          <Button className="w-full mt-2" type="button">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
