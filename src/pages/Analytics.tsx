
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Image, 
  TrendingDown, 
  Calendar,
  Lightbulb,
  ThumbsUp
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { generateSmartInsights, getHistoricalData } from "@/lib/aiContentService";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Convert historical data to chart format
const prepareChartData = (platformData: Record<string, any>, key: string = "engagement") => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return days.map((day, index) => {
    const dataPoint: Record<string, any> = { name: day };
    
    Object.keys(platformData).forEach(platform => {
      if (platformData[platform][key] && platformData[platform][key][index] !== undefined) {
        dataPoint[platform] = platformData[platform][key][index];
      }
    });
    
    return dataPoint;
  });
};

const formatPlatformData = (platformData: Record<string, any>) => {
  return Object.entries(platformData).map(([name, data]) => ({
    name,
    followers: data.followers ? data.followers[data.followers.length - 1] : 0,
    engagement: data.engagement ? 
      (data.engagement.reduce((sum: number, val: number) => sum + val, 0) / data.engagement.length).toFixed(1) : 
      0,
    posts: data.posts || 0
  }));
};

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [platformData, setPlatformData] = useState<Record<string, any>>({});
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [followersData, setFollowersData] = useState<any[]>([]);
  const [platformComparison, setPlatformComparison] = useState<any[]>([]);
  const [smartInsights, setSmartInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data based on selected time period
    setIsLoading(true);
    
    setTimeout(() => {
      const data = getHistoricalData();
      setPlatformData(data);
      
      // Prepare data for charts
      setEngagementData(prepareChartData(data, "engagement"));
      setFollowersData(prepareChartData(data, "followers"));
      setPlatformComparison(formatPlatformData(data));
      
      // Generate AI insights
      setSmartInsights(generateSmartInsights(data));
      
      setIsLoading(false);
    }, 800);
  }, [timePeriod]);

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const formatChange = (change?: number) => {
    if (change === undefined) return null;
    const formattedChange = Math.abs(change).toFixed(1) + "%";
    return change >= 0 ? 
      <span className="text-green-600">+{formattedChange}</span> : 
      <span className="text-red-500">-{formattedChange}</span>;
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select 
          defaultValue="30d" 
          value={timePeriod}
          onValueChange={setTimePeriod}
        >
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
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
          
          {/* Smart Insights */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
              AI-Powered Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {smartInsights.map((insight, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {insight.label}
                    </CardTitle>
                    {getTrendIcon(insight.trend)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">{insight.value}</div>
                    {insight.change !== undefined && (
                      <p className="text-xs">{formatChange(insight.change)}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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
                <Tabs defaultValue="chart">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="chart">Chart View</TabsTrigger>
                    <TabsTrigger value="compare">Platform Comparison</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart">
                    <Tabs defaultValue="engagement">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="engagement">Engagement</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="engagement" className="pt-4">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="Instagram" 
                                stroke="#8b5cf6" 
                                activeDot={{ r: 8 }} 
                              />
                              <Line type="monotone" dataKey="Facebook" stroke="#3b82f6" />
                              <Line type="monotone" dataKey="Twitter" stroke="#0ea5e9" />
                              <Line type="monotone" dataKey="LinkedIn" stroke="#0369a1" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="followers" className="pt-4">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={followersData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="Instagram" 
                                stroke="#8b5cf6" 
                                activeDot={{ r: 8 }} 
                              />
                              <Line type="monotone" dataKey="Facebook" stroke="#3b82f6" />
                              <Line type="monotone" dataKey="Twitter" stroke="#0ea5e9" />
                              <Line type="monotone" dataKey="LinkedIn" stroke="#0369a1" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                  
                  <TabsContent value="compare">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="followers" name="Followers" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="engagement" name="Avg. Engagement" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-4">AI Insights</h3>
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
                        Consider posting more content on Fridays and Saturdays when your audience is most active. Visual content performs 30% better than text-only posts.
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
                                platform === 'Instagram' ? 'bg-gradient-to-tr from-purple-500 to-pink-500' :
                                platform === 'Facebook' ? 'bg-blue-600' :
                                platform === 'Twitter' ? 'bg-sky-400' : 'bg-blue-700'
                              }`}
                            />
                            <span>{platform}</span>
                          </div>
                          <span className="text-sm">
                            {data.followers[data.followers.length - 1].toLocaleString()} followers
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                              platform === 'Facebook' ? 'bg-blue-600' :
                              platform === 'Twitter' ? 'bg-sky-400' : 'bg-blue-700'
                            }`}
                            style={{ width: `${(data.followers[data.followers.length - 1] / 6000) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {(data.engagement.reduce((sum: number, val: number) => sum + val, 0) / 
                              data.engagement.length).toFixed(1)}% engagement
                          </span>
                          <span>{data.posts} posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Content Performance by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Images</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">65%</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Engagement</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">42%</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-500" />
                        <span>Consistency</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">78%</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Comments</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">35%</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
