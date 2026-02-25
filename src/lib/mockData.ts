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
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  featured?: boolean;
  trending?: boolean;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Elena Voss",
    username: "elenavoss",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    bio: "Writer & design thinker exploring the intersection of technology and creativity.",
    followers: 12400,
    following: 340,
    totalBlogs: 89,
  },
  {
    id: "2",
    name: "Marcus Chen",
    username: "marcuschen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "Full-stack developer writing about modern web architecture.",
    followers: 8700,
    following: 210,
    totalBlogs: 56,
  },
  {
    id: "3",
    name: "Aria Nakamura",
    username: "arianakamura",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "UX researcher and storyteller. Building better digital experiences.",
    followers: 15200,
    following: 180,
    totalBlogs: 124,
  },
  {
    id: "4",
    name: "James Okafor",
    username: "jamesokafor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "Startup founder & product strategist sharing lessons learned.",
    followers: 22100,
    following: 95,
    totalBlogs: 67,
  },
  {
    id: "5",
    name: "Sophie Laurent",
    username: "sophielaurent",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    bio: "AI researcher making machine learning accessible to everyone.",
    followers: 31000,
    following: 150,
    totalBlogs: 43,
  },
];

export const blogs: Blog[] = [
  {
    id: "1",
    title: "The Art of Designing Systems That Scale",
    description: "How to think about software architecture when your user base grows from hundreds to millions, and why most teams get it wrong.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
    author: authors[1],
    publishedAt: "2026-02-22",
    readTime: 8,
    views: 14200,
    likes: 892,
    comments: 134,
    tags: ["Architecture", "Engineering", "Scale"],
    category: "Technology",
    featured: true,
  },
  {
    id: "2",
    title: "Why Every Designer Should Learn to Code",
    description: "Breaking down the wall between design and development leads to better products and faster iteration cycles.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    author: authors[0],
    publishedAt: "2026-02-20",
    readTime: 6,
    views: 9800,
    likes: 654,
    comments: 89,
    tags: ["Design", "Coding", "Career"],
    category: "Design",
    trending: true,
  },
  {
    id: "3",
    title: "Building Empathy Through User Research",
    description: "The most impactful products aren't built on assumptions. Here's how to truly understand your users.",
    coverImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop",
    author: authors[2],
    publishedAt: "2026-02-19",
    readTime: 10,
    views: 18500,
    likes: 1240,
    comments: 203,
    tags: ["UX", "Research", "Product"],
    category: "Design",
    featured: true,
    trending: true,
  },
  {
    id: "4",
    title: "The Startup Playbook Nobody Talks About",
    description: "Forget growth hacking. The real secret to startup success is boring, consistent execution.",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop",
    author: authors[3],
    publishedAt: "2026-02-18",
    readTime: 12,
    views: 32100,
    likes: 2100,
    comments: 312,
    tags: ["Startup", "Business", "Strategy"],
    category: "Business",
    trending: true,
  },
  {
    id: "5",
    title: "Demystifying Transformer Models",
    description: "A visual and intuitive guide to understanding the architecture behind ChatGPT and modern AI systems.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    author: authors[4],
    publishedAt: "2026-02-17",
    readTime: 15,
    views: 45600,
    likes: 3400,
    comments: 478,
    tags: ["AI", "Machine Learning", "Deep Learning"],
    category: "Technology",
    featured: true,
    trending: true,
  },
  {
    id: "6",
    title: "The Psychology of Great Typography",
    description: "How typeface choices subconsciously influence reader perception, trust, and engagement.",
    coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&h=500&fit=crop",
    author: authors[0],
    publishedAt: "2026-02-15",
    readTime: 7,
    views: 7200,
    likes: 521,
    comments: 67,
    tags: ["Typography", "Design", "Psychology"],
    category: "Design",
  },
  {
    id: "7",
    title: "Rust for JavaScript Developers",
    description: "A practical migration guide for web developers ready to explore systems programming.",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800&h=500&fit=crop",
    author: authors[1],
    publishedAt: "2026-02-14",
    readTime: 11,
    views: 11300,
    likes: 780,
    comments: 145,
    tags: ["Rust", "JavaScript", "Programming"],
    category: "Technology",
  },
  {
    id: "8",
    title: "Remote Work Is Broken — Here's How to Fix It",
    description: "After five years of distributed teams, we finally know what works and what doesn't.",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
    author: authors[3],
    publishedAt: "2026-02-12",
    readTime: 9,
    views: 21400,
    likes: 1560,
    comments: 234,
    tags: ["Remote Work", "Culture", "Productivity"],
    category: "Business",
  },
];

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
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
