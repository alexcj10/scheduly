
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

const placeholderImages = [
  "photo-1649972904349-6e44c42644a7",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1518770660439-4636190af475",
  "photo-1461749280684-dccba630e2f6",
  "photo-1486312338219-ce68d2c6f44d",
  "photo-1581091226825-a6a2a5aee158",
  "photo-1531297484001-80022131f5a1",
  "photo-1487058792275-0ad4aaf24ca7",
];

export default function MediaLibrary() {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex bg-primary/10 text-primary p-3 rounded-full">
          <Image className="w-6 h-6 text-primary" />
        </span>
        <h2 className="text-2xl font-bold text-primary">Media Library</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {placeholderImages.map((name) => (
          <Card key={name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-2 flex flex-col gap-2">
              <img
                src={`https://images.unsplash.com/${name}?auto=format&fit=crop&w=400&q=80`}
                alt="Media"
                className="w-full h-40 object-cover rounded"
                loading="lazy"
              />
              <span className="text-xs text-gray-500 break-all">{name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
