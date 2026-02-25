import { motion } from "framer-motion";
import { Heart, MessageCircle, Eye, Bookmark } from "lucide-react";
import { Blog, formatNumber, formatDate } from "@/lib/mockData";

interface BlogCardProps {
  blog: Blog;
  index?: number;
  variant?: "default" | "featured";
}

const BlogCard = ({ blog, index = 0, variant = "default" }: BlogCardProps) => {
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {blog.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-card-foreground transition-colors group-hover:text-primary md:text-3xl">
              {blog.title}
            </h2>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {blog.description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
              />
              <div>
                <span className="text-sm font-medium text-card-foreground">{blog.author.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(blog.publishedAt)}</span>
                  <span>·</span>
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1 text-xs">
                <Eye className="h-3.5 w-3.5" /> {formatNumber(blog.views)}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Heart className="h-3.5 w-3.5" /> {formatNumber(blog.likes)}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" /> {formatNumber(blog.comments)}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
          {blog.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {blog.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
            />
            <div>
              <span className="text-xs font-medium text-card-foreground">{blog.author.name}</span>
              <p className="text-xs text-muted-foreground">{formatDate(blog.publishedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3" /> {formatNumber(blog.views)}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Heart className="h-3 w-3" /> {formatNumber(blog.likes)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
