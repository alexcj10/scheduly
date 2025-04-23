
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getRecycledPosts } from "@/lib/localProfile";

interface Post {
  id: number;
  title: string;
  platform: string;
  scheduledFor: string;
  imageUrl: string;
  caption?: string;
  status?: "scheduled" | "published" | "draft";
}

interface ContentRecyclingProps {
  onPostSelect: (post: Post) => void;
}

export function ContentRecycling({ onPostSelect }: ContentRecyclingProps) {
  const [recycledPosts, setRecycledPosts] = useState<Post[]>([]);

  useEffect(() => {
    const recycledData = getRecycledPosts();
    setRecycledPosts(recycledData.slice(0, 3));
  }, []);

  if (recycledPosts.length === 0) return null;

  return (
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
              onClick={() => onPostSelect(post)}
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
  );
}
