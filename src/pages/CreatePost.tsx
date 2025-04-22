
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Calendar, Clock, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [suggestedHashtags, setSuggestedHashtags] = useState([
    "#marketing", "#socialmedia", "#contentcreator", "#digitalmarketing", 
    "#instagrammarketing", "#socialmediamarketing", "#branding"
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
      // We would usually show a success toast here
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Post</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Create and schedule your next social media post
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
                              Remove
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
                  <Input id="title" placeholder="Enter a title for your post" />
                </div>
                
                {/* Caption */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="caption">Caption</Label>
                    <Button variant="ghost" size="sm" className="h-auto py-0 px-2 text-xs">
                      AI Caption Suggestion
                    </Button>
                  </div>
                  <Textarea 
                    id="caption" 
                    placeholder="Write your post caption here..." 
                    className="min-h-32"
                  />
                </div>
                
                {/* Platforms */}
                <div className="space-y-2">
                  <Label htmlFor="platforms">Platforms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Post Date
                    </Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Post Time
                    </Label>
                    <Input type="time" />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Scheduling..." : "Schedule Post"}
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
                  >
                    {hashtag}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
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
