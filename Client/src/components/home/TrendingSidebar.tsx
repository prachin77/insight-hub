import { motion } from "framer-motion";
import { TrendingUp, UserPlus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authors, trendingTags, formatNumber } from "@/lib/mockData";

const TrendingSidebar = () => {
  return (
    <aside className="space-y-8">
      {/* Popular Authors */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-card-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Popular Authors
        </h3>
        <div className="mt-4 space-y-4">
          {authors.slice(0, 4).map((author) => (
            <div key={author.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{author.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(author.followers)} followers</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 gap-1 px-2.5 text-xs">
                <UserPlus className="h-3 w-3" />
                Follow
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trending Tags */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-card-foreground">
          <Hash className="h-4 w-4 text-primary" />
          Trending Tags
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag.name}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              #{tag.name}
              <span className="ml-1.5 text-muted-foreground">{formatNumber(tag.count)}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="overflow-hidden rounded-xl bg-primary p-6 text-center"
      >
        <h3 className="font-display text-lg font-bold text-primary-foreground">
          Start writing today
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Share your ideas with a community of curious minds.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
        >
          Create your blog
        </Button>
      </motion.div>
    </aside>
  );
};

export default TrendingSidebar;
