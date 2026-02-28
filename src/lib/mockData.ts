export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  totalBlogs: number;
}

export interface Blog {
  title: string;
  blog_content: string;
  author_id: string;
  author_name: string;
  author_username: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  blog_image: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  trending: boolean;
}

export const authors: Author[] = [];

export const blogs: Blog[] = [];

export const trendingTags = [
  { name: "AI", count: 1240 },
  { name: "Design", count: 890 },
  { name: "JavaScript", count: 756 },
  { name: "Startup", count: 634 },
  { name: "UX", count: 521 },
  { name: "React", count: 489 },
  { name: "Product", count: 412 },
  { name: "Career", count: 378 },
];

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
