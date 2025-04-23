
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar, Clock, Image, Save, Trash, Sparkles, RefreshCcw } from "lucide-react";
import { generateContentSuggestions, PlatformType } from "@/lib/aiContentService";
import { useFeedbackToast } from "@/lib/useFeedbackToast";
import { savePostForRecycling } from "@/lib/localProfile";

interface PostFormProps {
  editMode?: boolean;
  editId?: number | null;
  defaultValues?: any;
}

export function PostForm({ editMode = false, editId = null, defaultValues = {} }: PostFormProps) {
  const navigate = useNavigate();
  const { success, error, info, ai } = useFeedbackToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(defaultValues.imageUrl || null);
  const [title, setTitle] = useState(defaultValues.title || "");
  const [caption, setCaption] = useState(defaultValues.caption || "");
  const [platform, setPlatform] = useState(defaultValues.platform || "");
  const [postDate, setPostDate] = useState(defaultValues.postDate || format(new Date(), "yyyy-MM-dd"));
  const [postTime, setPostTime] = useState(defaultValues.postTime || "12:00");

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

  const generateAICaption = () => {
    if (!platform) {
      error("Platform required", "Please select a platform to generate a caption.");
      return;
    }
    
    setIsGeneratingCaption(true);
    
    try {
      setTimeout(() => {
        const suggestions = generateContentSuggestions(platform as PlatformType, title);
        setCaption(suggestions.caption);
        
        ai("AI Generated Caption", "A caption has been created based on your platform and topic.");
        setIsGeneratingCaption(false);
      }, 800);
    } catch (err) {
      console.error("Error generating caption:", err);
      error("Error", "Failed to generate caption. Please try again.");
      setIsGeneratingCaption(false);
    }
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
      const existingPosts = savedPosts ? JSON.parse(savedPosts) : [];
      
      if (editMode && editId !== null) {
        // Update existing post
        const updatedPosts = existingPosts.map((post: any) => {
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
        success("Post updated", "Your post has been updated successfully.");
      } else {
        // Create new post
        const newPost = {
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
        success("Post scheduled", `Your post will be published on ${format(scheduledDate, "PPP 'at' p")}.`);
      }
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Error saving post:", err);
      error("Error", "There was a problem saving your post. Please try again.");
      setIsSubmitting(false);
    }
  };

  const saveForRecycling = () => {
    if (!title || !platform) {
      error("Incomplete post", "Please add a title and select a platform before saving for recycling.");
      return;
    }
    
    try {
      savePostForRecycling({
        title,
        platform,
        caption,
        imageUrl: uploadedImage
      });
      
      success("Saved for recycling", "This content has been saved and can be reused later.");
    } catch (err) {
      console.error("Error saving for recycling:", err);
      error("Error", "Failed to save content for recycling.");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{editMode ? "Edit Post" : "Post Details"}</CardTitle>
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
  );
}
