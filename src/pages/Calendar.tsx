
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for the calendar
const mockEvents = [
  {
    id: 1,
    title: "Summer Product Launch",
    platform: "Instagram",
    time: "10:30 AM",
    day: 25,
    status: "scheduled",
  },
  {
    id: 2,
    title: "Customer Testimonial",
    platform: "Twitter",
    time: "2:00 PM",
    day: 27,
    status: "scheduled",
  },
  {
    id: 3,
    title: "Weekend Sale Announcement",
    platform: "Facebook",
    time: "9:00 AM",
    day: 28,
    status: "scheduled",
  },
  {
    id: 4,
    title: "New Product Teaser",
    platform: "Instagram",
    time: "3:30 PM",
    day: 15,
    status: "published",
  },
  {
    id: 5,
    title: "Company Update",
    platform: "LinkedIn",
    time: "11:00 AM",
    day: 20,
    status: "published",
  },
];

// Helper function to create calendar days
const generateCalendarDays = (month = 6, year = 2025) => {
  // Get the first day of the month
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Get the number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Create an array of calendar days
  const days = [];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: "", isEmpty: true });
  }
  
  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const eventsForDay = mockEvents.filter(event => event.day === i);
    days.push({ day: i, isEmpty: false, events: eventsForDay });
  }
  
  return days;
};

const calendarDays = generateCalendarDays();
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <Button onClick={() => navigate("/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>June 2025</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                &lt;
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                &gt;
              </Button>
              <Select defaultValue="month">
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {weekdays.map((day, index) => (
              <div key={index} className="text-center p-2 font-medium text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-24 border rounded-md p-1 relative ${
                  day.isEmpty ? 'bg-gray-50 border-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {!day.isEmpty && (
                  <>
                    <div className="text-xs font-medium p-1">
                      {day.day}
                    </div>
                    <div className="space-y-1 mt-1">
                      {day.events?.map((event) => (
                        <div 
                          key={event.id} 
                          className={`text-xs p-1 rounded-sm truncate ${
                            event.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                          title={event.title}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-[10px] flex justify-between">
                            <span>{event.platform}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                      
                      {day.events?.length === 0 && day.day && (
                        <button 
                          className="w-full h-full absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          onClick={() => navigate("/create")}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">Published</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents
              .filter(event => event.status === 'scheduled')
              .map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="text-sm text-gray-500">
                      {event.platform} • June {event.day}, 2025 • {event.time}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
