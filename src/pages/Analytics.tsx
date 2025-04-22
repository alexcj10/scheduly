
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, MessageSquare, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock chart component - in a real app this would use a chart library like recharts
const Chart = ({ data, color = "#5271FF" }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  
  return (
    <div className="w-full h-40 flex items-end gap-1">
      {data.map((value, index) => (
        <div 
          key={index} 
          className="flex-1 rounded-t-sm transition-all hover:opacity-80"
          style={{ 
            height: `${(value / max) * 100}%`, 
            backgroundColor: color, 
            minWidth: '4px'
          }}
          title={`Value: ${value}`}
        />
      ))}
    </div>
  );
};

// Mock data
const engagementData = {
  likes: [45, 52, 38, 65, 73, 42, 58],
  comments: [12, 18, 8, 15, 22, 14, 16],
  shares: [8, 10, 6, 14, 18, 9, 12]
};

const platformData = {
  instagram: { followers: 5240, engagement: 4.3, posts: 124 },
  facebook: { followers: 3850, engagement: 2.1, posts: 98 },
  twitter: { followers: 2780, engagement: 3.8, posts: 156 },
  linkedin: { followers: 1560, engagement: 1.7, posts: 45 }
};

const topPosts = [
  { id: 1, title: "Summer Collection Launch", likes: 345, comments: 42, shares: 28, platform: "Instagram", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
  { id: 2, title: "Customer Success Story", likes: 278, comments: 35, shares: 19, platform: "Facebook", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
  { id: 3, title: "Product Tutorial", likes: 198, comments: 27, shares: 14, platform: "Instagram", imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db" }
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,548</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Followers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,230</div>
            <p className="text-xs text-muted-foreground">
              +215 new followers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16.8</div>
            <p className="text-xs text-muted-foreground">
              +2.3 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Posts
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 new posts
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>
              Engagement trends over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="likes">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="likes">Likes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="shares">Shares</TabsTrigger>
              </TabsList>
              
              <TabsContent value="likes" className="mt-4">
                <Chart data={engagementData.likes} color="#5271FF" />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="mt-4">
                <Chart data={engagementData.comments} color="#8B5CF6" />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </TabsContent>
              
              <TabsContent value="shares" className="mt-4">
                <Chart data={engagementData.shares} color="#10B981" />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-4">Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 text-green-800 rounded-md">
                  <p className="font-medium">Positive Trend</p>
                  <p className="text-xs mt-1">
                    Your engagement has increased by 18% compared to the previous period. Your weekend posts are performing particularly well.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
                  <p className="font-medium">Recommendation</p>
                  <p className="text-xs mt-1">
                    Consider posting more content on Fridays and Saturdays when your audience is most active.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {/* Platform Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(platformData).map(([platform, data]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            platform === 'instagram' ? 'bg-gradient-to-tr from-purple-500 to-pink-500' :
                            platform === 'facebook' ? 'bg-blue-600' :
                            platform === 'twitter' ? 'bg-sky-400' : 'bg-blue-700'
                          }`}
                        />
                        <span className="capitalize">{platform}</span>
                      </div>
                      <span className="text-sm">{data.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          platform === 'facebook' ? 'bg-blue-600' :
                          platform === 'twitter' ? 'bg-sky-400' : 'bg-blue-700'
                        }`}
                        style={{ width: `${(data.followers / 6000) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{data.engagement}% engagement</span>
                      <span>{data.posts} posts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium truncate">{post.title}</h4>
                      <p className="text-xs text-gray-500 mb-1">{post.platform}</p>
                      <div className="flex gap-3 text-xs">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
