import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, Heart, MessageCircle, Calendar, Clock, User, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Blog, formatNumber, formatDate } from "@/lib/mockData";
const BlogDetail = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog as Blog | undefined;

  useEffect(() => {
    if (blog && blog.title) {
      fetch(`${API_BASE_URL}/blogs/increment-views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: blog.title }),
      }).catch((err) => console.error("Failed to increment views:", err));
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
          <h1 className="font-display text-2xl font-bold text-foreground">Blog not found</h1>
          <p className="mt-2 text-muted-foreground">This blog post doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={blog.blog_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop"}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-foreground/80 hover:text-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {user && blog && user.id === blog.author_id && (
              <Button
                variant="outline"
                size="sm"
                className="mb-4 ml-2 border-primary/50 bg-background/50 text-foreground backdrop-blur-sm hover:bg-primary/10"
                asChild
              >
                <Link to={`/edit-blog/${encodeURIComponent(blog.title)}`} state={{ blog }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Blog
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Content */}
      <article className="container mx-auto max-w-3xl px-4 py-10">
        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
              {tag}
            </Badge>
          ))}
        </div>
        {/* Title */}
        <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
          {blog.title}
        </h1>
        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary ring-2 ring-border">
              <User className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-foreground">{blog.author_name || "Unknown"}</span>
              {blog.author_username && (
                <p className="text-xs text-muted-foreground">@{blog.author_username}</p>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(blog.created_at)}
          </span>
        </div>
        {/* Stats */}
        <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {formatNumber(blog.views)} views
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" /> {formatNumber(blog.likes)} likes
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" /> {formatNumber(blog.comments)} comments
          </span>
        </div>
        {/* Body */}
        <div className="prose prose-invert mt-10 max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
          {blog.blog_content}
        </div>
      </article>
      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Inkwell. A platform for curious minds.
        </div>
      </footer>
    </div>
  );
};
export default BlogDetail;