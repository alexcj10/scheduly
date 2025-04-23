
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BestPostTimes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Best Times to Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Instagram</span>
            </div>
            <span className="text-sm font-medium">10:00 AM - 2:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Facebook</span>
            </div>
            <span className="text-sm font-medium">1:00 PM - 4:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-sky-400 mr-2"></div>
              <span>Twitter</span>
            </div>
            <span className="text-sm font-medium">8:00 AM - 12:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-700 mr-2"></div>
              <span>LinkedIn</span>
            </div>
            <span className="text-sm font-medium">9:00 AM - 11:00 AM</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            These recommendations are based on your audience's activity patterns and historical engagement data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
