
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Calendar, Clock, Image, Save, Trash, Sparkles, RefreshCcw, ThumbsUp, MessageSquare, Lightbulb } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFeedbackToast } from "@/lib/useFeedbackToast";
import { format } from "date-fns";
import { generateContentSuggestions, generateHashtags, PlatformType } from "@/lib/aiContentService";
import { savePostForRecycling } from "@/lib/localProfile";

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
  const { success, error, info, ai } = useFeedbackToast();
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
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [recycledPosts, setRecycledPosts] = useState<Post[]>([]);

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
          
          // Generate platform-specific hashtags
          if (postToEdit.platform) {
            generateMoreHashtags(postToEdit.title);
          }
        } else {
          // Post not found
          toast.error("Post not found", "The post you're trying to edit couldn't be found.");
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
    
    // Load recycled posts
    const recycledData = localStorage.getItem("scheduly-recycled-posts");
    if (recycledData) {
      setRecycledPosts(JSON.parse(recycledData).slice(0, 3));
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
      error("Title required", "Please enter a title for your post.");
      return false;
    }

    if (!platform) {
      error("Platform required", "Please select at least one platform for your post.");
      return false;
    }

    if (!postDate || !postTime) {
      error("Schedule required", "Please select when you want to publish your post.");
      return false;
    }

    if (!uploadedImage) {
      error("Image required", "Please upload an image for your post.");
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
        
        toast.success("Post updated", "Your post has been updated successfully.");
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
        
        toast.success("Post scheduled", `Your post will be published on ${format(scheduledDate, "PPP 'at' p")}.`);
      }
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving post:", error);
      error("Error", "There was a problem saving your post. Please try again.");
      setIsSubmitting(false);
    }
  };

  const generateAICaption = () => {
    if (!platform) {
      toast.error("Platform required", "Please select a platform to generate a caption.");
      return;
    }
    
    setIsGeneratingCaption(true);
    
    try {
      // In real app, this would call an AI service via API
      setTimeout(() => {
        const suggestions = generateContentSuggestions(platform as PlatformType, title);
        setCaption(suggestions.caption);
        setSuggestedHashtags(suggestions.hashtags);
        
        ai("AI Generated Caption", "A caption has been created based on your platform and topic.");
        setIsGeneratingCaption(false);
      }, 800);
    } catch (error) {
      console.error("Error generating caption:", error);
      toast.error("Error", "Failed to generate caption. Please try again.");
      setIsGeneratingCaption(false);
    }
  };

  const generateMoreHashtags = (topic: string = title) => {
    if (!platform) {
      toast.error("Platform required", "Please select a platform to generate hashtags.");
      return;
    }
    
    if (!topic) {
      toast.error("Topic required", "Please enter a post title or topic for hashtag generation.");
      return;
    }
    
    // Generate hashtags based on platform and topic
    try {
      const newHashtags = generateHashtags(platform as PlatformType, topic);
      setSuggestedHashtags(newHashtags);
      
      ai("AI Hashtags Generated", "New hashtag suggestions are ready for your post.");
    } catch (error) {
      console.error("Error generating hashtags:", error);
      toast.error("Error", "Failed to generate hashtags. Please try again.");
    }
  };
  
  const addHashtagToCaption = (hashtag: string) => {
    setCaption(prev => prev + " " + hashtag);
    toast.info("Hashtag Added", `Added ${hashtag} to your caption.`);
  };
  
  const useRecycledPost = (post: Post) => {
    setTitle(post.title);
    setCaption(post.caption || "");
    setPlatform(post.platform);
    setUploadedImage(post.imageUrl);
    
    // Generate new hashtags based on the recycled post
    if (post.platform) {
      generateMoreHashtags(post.title);
    }
    
    ai("Content Recycled", "The post has been loaded for recycling. Update as needed before scheduling.");
  };
  
  const saveForRecycling = () => {
    if (!title || !platform) {
      toast.error("Incomplete post", "Please add a title and select a platform before saving for recycling.");
      return;
    }
    
    try {
      savePostForRecycling({
        title,
        platform,
        caption,
        imageUrl: uploadedImage
      });
      
      toast.success("Saved for recycling", "This content has been saved and can be reused later.");
    } catch (error) {
      console.error("Error saving for recycling:", error);
      toast.error("Error", "Failed to save content for recycling.");
    }
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
                      className="h-auto py-0 px-2 text-xs flex items-center gap-1"
                      type="button"
                      onClick={generateAICaption}
                      disabled={isGeneratingCaption || !platform}
                    >
                      {isGeneratingCaption ? (
                        <>
                          <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-primary animate-spin mr-1"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" /> 
                          AI Caption Suggestion
                        </>
                      )}
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
                    onValueChange={(value) => {
                      setPlatform(value);
                      // Generate platform-specific hashtags when platform changes
                      if (title) {
                        generateMoreHashtags(title);
                      }
                    }}
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
              
              <CardFooter className="flex flex-wrap justify-between gap-3">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={saveForRecycling}
                    className="flex items-center"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Save for Recycling
                  </Button>
                </div>
                <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
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
          {/* Content Recycling */}
          {recycledPosts.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Recycle Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recycledPosts.map((post, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => useRecycledPost(post)}
                    >
                      <div className="flex gap-3 items-start">
                        {post.imageUrl && (
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm">{post.title}</h4>
                          <p className="text-xs text-gray-500">{post.platform}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Click on a post to reuse its content
                </p>
              </CardContent>
            </Card>
          )}
        
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
                onClick={() => generateMoreHashtags()}
                disabled={!title || !platform}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
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
