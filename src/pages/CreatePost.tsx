
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useFeedbackToast } from "@/lib/useFeedbackToast";
import { PostForm } from "@/components/post/PostForm";
import { HashtagSuggestions } from "@/components/post/HashtagSuggestions";
import { BestPostTimes } from "@/components/post/BestPostTimes";
import { ContentRecycling } from "@/components/post/ContentRecycling";

interface PostValues {
  platform?: string;
  title?: string;
  caption?: string;
  imageUrl?: string;
  postDate?: string;
  postTime?: string;
  [key: string]: any;
}

export default function CreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [defaultValues, setDefaultValues] = useState<PostValues>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { error } = useFeedbackToast();

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
        const posts = JSON.parse(savedPosts);
        const postToEdit = posts.find((post: any) => post.id === Number(editPostId));
        
        if (postToEdit) {
          setDefaultValues(postToEdit);
        } else {
          error("Post not found", "The post you're trying to edit couldn't be found.");
          navigate("/dashboard");
        }
      }
      setIsLoading(false);
    }
  }, [location, navigate, error]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {editMode ? "Edit Post" : "Create Post"}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostForm 
            editMode={editMode}
            editId={editId}
            defaultValues={defaultValues}
          />
        </div>
        
        <div>
          <ContentRecycling 
            onPostSelect={(post) => setDefaultValues(post)}
          />
          <HashtagSuggestions 
            platform={defaultValues.platform || ""}
            title={defaultValues.title || ""}
            onHashtagClick={(hashtag) => {
              const currentCaption = defaultValues.caption || "";
              setDefaultValues({
                ...defaultValues,
                caption: currentCaption + " " + hashtag
              });
            }}
          />
          <BestPostTimes />
        </div>
      </div>
    </DashboardLayout>
  );
}
