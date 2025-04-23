
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { generateHashtags, PlatformType } from "@/lib/aiContentService";
import { useFeedbackToast } from "@/lib/useFeedbackToast";

interface HashtagSuggestionsProps {
  platform: string;
  title: string;
  onHashtagClick: (hashtag: string) => void;
}

export function HashtagSuggestions({ platform, title, onHashtagClick }: HashtagSuggestionsProps) {
  const { ai, error } = useFeedbackToast();
  const [suggestedHashtags, setSuggestedHashtags] = useState([
    "#marketing", "#socialmedia", "#contentcreator", "#digitalmarketing", 
    "#instagrammarketing", "#socialmediamarketing", "#branding"
  ]);

  const generateMoreHashtags = () => {
    if (!platform) {
      error("Platform required", "Please select a platform to generate hashtags.");
      return;
    }
    
    if (!title) {
      error("Topic required", "Please enter a post title or topic for hashtag generation.");
      return;
    }
    
    try {
      const newHashtags = generateHashtags(platform as PlatformType, title);
      setSuggestedHashtags(newHashtags);
      
      ai("AI Hashtags Generated", "New hashtag suggestions are ready for your post.");
    } catch (err) {
      console.error("Error generating hashtags:", err);
      error("Error", "Failed to generate hashtags. Please try again.");
    }
  };

  return (
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
              onClick={() => onHashtagClick(hashtag)}
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
          disabled={!title || !platform}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Generate More Hashtags
        </Button>
      </CardContent>
    </Card>
  );
}
