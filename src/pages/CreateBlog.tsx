import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Image, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";

const CreateBlog = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Please sign in to create a blog.");
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag) && tags.length < 5) {
            setTags([...tags, tag]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const countWords = (str: string) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (title.length < 5 || title.length > 100) {
            toast.error("Title must be between 5 and 100 characters.");
            return;
        }

        const wordCount = countWords(content);
        if (wordCount < 1 || wordCount > 500) {
            toast.error("Content must be between 1 and 500 words.");
            return;
        }

        if (!category.trim()) {
            toast.error("Please select a category.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    blog_content: content,
                    tags,
                    blog_image: imageUrl,
                    category,
                    author_id: user?.id,
                }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to publish blog.");
            }

            toast.success("Blog published successfully!");
            navigate("/");
        } catch (err: any) {
            toast.error(err.message || "Failed to publish blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto max-w-3xl px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-6 gap-2 text-muted-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    <h1 className="font-display text-3xl font-bold text-foreground">
                        Create a New Story
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Share your ideas with the world.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Give your story a title..."
                                className="h-12 text-lg font-medium"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. Technology, Lifestyle, Business..."
                                className="h-11"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>

                        {/* Cover Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Cover Image URL</Label>
                            <div className="relative">
                                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="image"
                                    placeholder="https://example.com/image.jpg"
                                    className="h-11 pl-10"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>
                            {imageUrl && (
                                <div className="mt-2 overflow-hidden rounded-lg border border-border">
                                    <img
                                        src={imageUrl}
                                        alt="Cover preview"
                                        className="h-48 w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Write your story here..."
                                className="min-h-[300px] text-base leading-relaxed"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label>Tags (up to 5)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a tag..."
                                    className="h-10"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    disabled={tags.length >= 5}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="h-10 px-4"
                                    onClick={addTag}
                                    disabled={tags.length >= 5 || !tagInput.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="gap-1 pr-1.5"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="gap-2" disabled={loading}>
                                {loading ? "Publishing..." : "Publish Story"}
                                {!loading && <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateBlog;
