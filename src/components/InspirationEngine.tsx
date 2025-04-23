import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, BookmarkPlus, Star, ThumbsUp, Lightbulb, RefreshCcw } from "lucide-react";
import { useFeedbackToast } from "@/lib/useFeedbackToast";
import { getTrendingTopics, ContentRecommendation, generateContentSuggestions } from "@/lib/aiContentService";
import { ContentIdea, addContentIdea, getContentIdeas, updateContentIdea } from "@/lib/localProfile";

type PlatformType = "Instagram" | "Facebook" | "Twitter" | "LinkedIn" | "Pinterest";

export function InspirationEngine() {
  const [activeTab, setActiveTab] = useState("trending");
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<ContentIdea[]>([]);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, info, ai } = useFeedbackToast();

  // Load trending topics and saved ideas on mount
  useEffect(() => {
    setTrendingTopics(getTrendingTopics());
    setSavedIdeas(getContentIdeas().filter(idea => idea.saved));
  }, []);

  const handleTopicSearch = () => {
    if (!searchTopic.trim()) {
      error("Please enter a topic", "Enter a topic to generate content ideas");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // In a real app, this would make an API call to an AI service
      try {
        const platforms: PlatformType[] = ["Instagram", "Facebook", "Twitter", "LinkedIn"];
        
        const newRecommendations = platforms.map(platform => {
          return generateContentSuggestions(platform, searchTopic);
        });
        
        setRecommendations(newRecommendations);
        ai("Content Ideas Generated", `${newRecommendations.length} ideas created for "${searchTopic}"`);
      } catch (error) {
        console.error("Error generating recommendations:", error);
        error("Failed to generate ideas", "Please try again later");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const saveIdea = (platform: string, title: string, description: string) => {
    try {
      addContentIdea({
        title,
        description,
        platform,
        type: Math.random() > 0.5 ? "Image" : "Video",
        saved: true
      });
      
      // Refresh saved ideas
      setSavedIdeas(getContentIdeas().filter(idea => idea.saved));
      
      success("Idea saved", "The content idea has been saved to your library");
    } catch (error) {
      console.error("Error saving idea:", error);
      error("Error saving idea", "Please try again");
    }
  };

  const toggleSaved = (id: string, currentSaved: boolean) => {
    try {
      updateContentIdea(id, { saved: !currentSaved });
      
      // Refresh saved ideas
      setSavedIdeas(getContentIdeas().filter(idea => idea.saved));
      
      info(
        currentSaved ? "Idea removed from saved" : "Idea saved", 
        currentSaved ? "The idea has been removed from your saved ideas" : "The idea has been saved"
      );
    } catch (error) {
      console.error("Error updating idea:", error);
      error("Error updating idea", "Please try again");
    }
  };

  const refreshTrendingTopics = () => {
    setTrendingTopics(getTrendingTopics());
    info("Topics refreshed", "Trending topics have been updated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          Content Inspiration Engine
        </CardTitle>
        <CardDescription>
          Get AI-powered content ideas tailored to your audience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="generate">
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="saved">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="py-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 text-sm py-1.5"
                  onClick={() => {
                    setSearchTopic(topic);
                    setActiveTab("generate");
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshTrendingTopics}
                className="gap-2"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="py-4 space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a topic (e.g. sustainable fashion)"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleTopicSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-4 mt-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{rec.platform} Post</h4>
                        <p className="text-sm text-gray-500">Best time: {rec.bestTimeToPost}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-1"
                        onClick={() => saveIdea(rec.platform, searchTopic, rec.caption)}
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        Save
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <p className="text-sm">{rec.caption}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {rec.hashtags.slice(0, 5).map((hashtag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                    <p>Enter a topic and click "Generate" to get content ideas</p>
                  </div>
                )
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="py-4">
            {savedIdeas.length > 0 ? (
              <div className="space-y-3">
                {savedIdeas.map((idea) => (
                  <div key={idea.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{idea.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{idea.platform}</Badge>
                          <Badge variant="outline" className="text-xs">{idea.type}</Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={idea.saved ? "default" : "outline"}
                        className="gap-1"
                        onClick={() => toggleSaved(idea.id, idea.saved)}
                      >
                        <Star className="h-3.5 w-3.5" fill={idea.saved ? "currentColor" : "none"} />
                        {idea.saved ? "Saved" : "Save"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{idea.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookmarkPlus className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>You don't have any saved ideas yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-2">
        <p className="text-xs text-gray-500 w-full text-center">
          Content suggestions are powered by AI and tailored to your audience's engagement history
        </p>
      </CardFooter>
    </Card>
  );
}
