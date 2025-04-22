
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Image, Plus, TrendingUp, Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface Post {
  id: number;
  title: string;
  platform: string;
  scheduledFor: string;
  imageUrl: string;
  status?: "scheduled" | "published" | "draft";
}

interface AnalyticsItem {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
}

// Mock data
const initialPosts = [
  {
    id: 1,
    title: "Summer Product Launch",
    platform: "Instagram",
    scheduledFor: "2025-06-25T10:30:00",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    status: "scheduled" as const,
  },
  {
    id: 2,
    title: "Customer Testimonial",
    platform: "Twitter",
    scheduledFor: "2025-06-27T14:00:00",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    status: "scheduled" as const,
  },
  {
    id: 3,
    title: "Weekend Sale Announcement",
    platform: "Facebook",
    scheduledFor: "2025-06-28T09:00:00",
    imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
    status: "scheduled" as const,
  },
];

const analyticsData: AnalyticsItem[] = [
  { title: "Total Posts", value: "156", change: "+12%", isUp: true },
  { title: "Engagement Rate", value: "4.3%", change: "+0.8%", isUp: true },
  { title: "Followers", value: "8.2K", change: "+215", isUp: true },
  { title: "Best Time to Post", value: "10 AM", change: "", isUp: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (localStorage.getItem("scheduly-authenticated") !== "true") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load posts from localStorage or use initial data
        const savedPosts = localStorage.getItem("scheduly-posts");
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        } else {
          setPosts(initialPosts);
          localStorage.setItem("scheduly-posts", JSON.stringify(initialPosts));
        }
        
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

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
  
  const handleDeletePost = (postId: number) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to cancel this post?")) return;
    
    try {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem("scheduly-posts", JSON.stringify(updatedPosts));
      
      toast({
        title: "Post cancelled",
        description: "Your scheduled post has been cancelled.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Could not cancel the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (postId: number) => {
    navigate(`/create?edit=${postId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

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
        {analytics.map((item, index) => (
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
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditPost(post.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card className="col-span-full p-8 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg mb-2">No Posts Yet</CardTitle>
              <CardDescription className="max-w-md mx-auto mb-6">
                You haven't scheduled any posts yet. Create your first post to get started.
              </CardDescription>
              <Button onClick={() => navigate("/create")}>Create Your First Post</Button>
            </CardContent>
          </Card>
        )}
        
        {/* Add New Post Card */}
        {posts.length > 0 && (
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
        )}
      </div>
    </DashboardLayout>
  );
}
