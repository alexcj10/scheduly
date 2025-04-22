
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Image, Plus, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data
const upcomingPosts = [
  {
    id: 1,
    title: "Summer Product Launch",
    platform: "Instagram",
    scheduledFor: "2025-06-25T10:30:00",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    id: 2,
    title: "Customer Testimonial",
    platform: "Twitter",
    scheduledFor: "2025-06-27T14:00:00",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    id: 3,
    title: "Weekend Sale Announcement",
    platform: "Facebook",
    scheduledFor: "2025-06-28T09:00:00",
    imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
  },
];

const analyticsData = [
  { title: "Total Posts", value: "156", change: "+12%", isUp: true },
  { title: "Engagement Rate", value: "4.3%", change: "+0.8%", isUp: true },
  { title: "Followers", value: "8.2K", change: "+215", isUp: true },
  { title: "Best Time to Post", value: "10 AM", change: "", isUp: true },
];

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (localStorage.getItem("scheduly-authenticated") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>
      
      {/* Analytics Overview */}
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {analyticsData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            {item.change && (
              <CardContent>
                <span className={`text-sm ${item.isUp ? "text-green-500" : "text-red-500"}`}>
                  {item.change} {item.isUp ? "↑" : "↓"}
                </span>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      {/* Upcoming Posts */}
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CalendarCheck className="mr-2 h-5 w-5 text-secondary" />
        Upcoming Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="h-40 w-full bg-gray-100 relative">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {post.platform}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{post.title}</CardTitle>
              <CardDescription className="flex items-center">
                <CalendarCheck className="mr-1 h-4 w-4" />
                {formatDate(post.scheduledFor)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Post Card */}
        <Card className="flex flex-col items-center justify-center h-[262px] border-dashed">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-lg mb-2">Create New Post</CardTitle>
            <CardDescription className="text-center mb-4">
              Schedule your next social media update
            </CardDescription>
            <Button onClick={() => navigate("/create")}>Create Post</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
