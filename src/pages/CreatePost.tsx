
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Calendar, Clock, Image, Save, Trash } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Types
interface Post {
  id: number;
  title: string;
  platform: string;
  scheduledFor: string;
  imageUrl: string;
  caption?: string;
  status?: "scheduled" | "published" | "draft";
}

export default function CreatePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postTime, setPostTime] = useState("");
  const [suggestedHashtags, setSuggestedHashtags] = useState([
    "#marketing", "#socialmedia", "#contentcreator", "#digitalmarketing", 
    "#instagrammarketing", "#socialmediamarketing", "#branding"
  ]);

  useEffect(() => {
    // Check if we're in edit mode
    const params = new URLSearchParams(location.search);
    const editPostId = params.get('edit');
    
    if (editPostId) {
      setIsLoading(true);
      setEditMode(true);
      setEditId(Number(editPostId));
      
      // Get posts from localStorage
      const savedPosts = localStorage.getItem("scheduly-posts");
      if (savedPosts) {
        const posts: Post[] = JSON.parse(savedPosts);
        const postToEdit = posts.find(post => post.id === Number(editPostId));
        
        if (postToEdit) {
          // Populate form fields
          setTitle(postToEdit.title);
          setUploadedImage(postToEdit.imageUrl);
          setPlatform(postToEdit.platform);
          setCaption(postToEdit.caption || "");
          
          // Parse the date and time
          const scheduledDate = new Date(postToEdit.scheduledFor);
          setPostDate(format(scheduledDate, "yyyy-MM-dd"));
          setPostTime(format(scheduledDate, "HH:mm"));
        } else {
          // Post not found
          toast({
            title: "Post not found",
            description: "The post you're trying to edit couldn't be found.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      }
      setIsLoading(false);
    } else {
      // Set default values for new post
      const today = new Date();
      setPostDate(format(today, "yyyy-MM-dd"));
      setPostTime("12:00");
    }
  }, [location, navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (!platform) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (!postDate || !postTime) {
      toast({
        title: "Schedule required",
        description: "Please select when you want to publish your post.",
        variant: "destructive",
      });
      return false;
    }

    if (!uploadedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image for your post.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create scheduled date
      const scheduledDate = new Date(`${postDate}T${postTime}`);
      
      // Get existing posts
      const savedPosts = localStorage.getItem("scheduly-posts");
      const existingPosts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
      
      if (editMode && editId !== null) {
        // Update existing post
        const updatedPosts = existingPosts.map(post => {
          if (post.id === editId) {
            return {
              ...post,
              title,
              platform,
              caption,
              scheduledFor: scheduledDate.toISOString(),
              imageUrl: uploadedImage || post.imageUrl,
            };
          }
          return post;
        });
        
        localStorage.setItem("scheduly-posts", JSON.stringify(updatedPosts));
        
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully.",
        });
      } else {
        // Create new post
        const newPost: Post = {
          id: Date.now(),
          title,
          platform,
          caption,
          scheduledFor: scheduledDate.toISOString(),
          imageUrl: uploadedImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          status: "scheduled",
        };
        
        const updatedPosts = [...existingPosts, newPost];
        localStorage.setItem("scheduly-posts", JSON.stringify(updatedPosts));
        
        toast({
          title: "Post scheduled",
          description: `Your post will be published on ${format(scheduledDate, "PPP 'at' p")}.`,
        });
      }
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your post. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const generateMoreHashtags = () => {
    // In a real app, this would call an AI service
    const allHashtags = [
      "#marketing", "#socialmedia", "#contentcreator", "#digitalmarketing", 
      "#instagrammarketing", "#socialmediamarketing", "#branding", "#business",
      "#entrepreneur", "#onlinemarketing", "#marketingdigital", "#marketingstrategy",
      "#smallbusiness", "#contentmarketing", "#content", "#smm", "#viral", "#trending",
      "#seo", "#instagram", "#facebook", "#twitter", "#linkedin", "#tiktok"
    ];
    
    // Randomly select 7 hashtags
    const newHashtags = [...allHashtags]
      .sort(() => 0.5 - Math.random())
      .slice(0, 7);
    
    setSuggestedHashtags(newHashtags);
    
    toast({
      title: "Hashtags generated",
      description: "New hashtag suggestions are ready for your post.",
    });
  };
  
  const addHashtagToCaption = (hashtag: string) => {
    setCaption(prev => prev + " " + hashtag);
    toast({
      description: `Added ${hashtag} to your caption.`,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {editMode ? "Edit Post" : "Create Post"}
          </h1>
        </div>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {editMode ? "Edit Post" : "Create Post"}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  {editMode 
                    ? "Update your scheduled social media post" 
                    : "Create and schedule your next social media post"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Post Type */}
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <Tabs defaultValue="image" className="w-full">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="image">Image</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="carousel">Carousel</TabsTrigger>
                      <TabsTrigger value="text">Text Only</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="image" className="pt-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        {uploadedImage ? (
                          <div className="relative">
                            <img 
                              src={uploadedImage} 
                              alt="Upload preview" 
                              className="max-h-64 mx-auto rounded-lg"
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setUploadedImage(null)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Image className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <span className="text-primary font-medium">Click to upload</span> or drag and drop
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                            <Input 
                              id="image-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageUpload}
                            />
                          </>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="video" className="pt-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <Image className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <Label htmlFor="video-upload" className="cursor-pointer">
                          <span className="text-primary font-medium">Click to upload</span> or drag and drop
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV up to 100MB
                        </p>
                        <Input id="video-upload" type="file" accept="video/*" className="hidden" />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="carousel">
                      <p className="text-sm text-gray-500 pt-2">
                        Upload multiple images for a carousel post
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="text">
                      <p className="text-sm text-gray-500 pt-2">
                        Create a text-only post without media
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Post Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a title for your post" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                {/* Caption */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="caption">Caption</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto py-0 px-2 text-xs"
                      type="button"
                      onClick={() => {
                        toast({
                          title: "AI Caption Suggestion",
                          description: "This feature will be available soon.",
                        });
                      }}
                    >
                      AI Caption Suggestion
                    </Button>
                  </div>
                  <Textarea 
                    id="caption" 
                    placeholder="Write your post caption here..." 
                    className="min-h-32"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                
                {/* Platforms */}
                <div className="space-y-2">
                  <Label htmlFor="platforms">Platforms</Label>
                  <Select 
                    value={platform} 
                    onValueChange={setPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Pinterest">Pinterest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Post Date
                    </Label>
                    <Input 
                      type="date" 
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Post Time
                    </Label>
                    <Input 
                      type="time" 
                      value={postTime}
                      onChange={(e) => setPostTime(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 
                    (editMode ? "Saving..." : "Scheduling...") : 
                    (editMode ? "Save Changes" : "Schedule Post")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          {/* Hashtag Suggestions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Suggested Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestedHashtags.map((hashtag, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => addHashtagToCaption(hashtag)}
                  >
                    {hashtag}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                size="sm"
                onClick={generateMoreHashtags}
              >
                Generate More Hashtags
              </Button>
            </CardContent>
          </Card>
          
          {/* Best Times to Post */}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
