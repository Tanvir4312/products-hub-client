"use client";

import { useState } from "react";
import { Sparkles, Loader2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SuggestedTag {
  name: string;
  matchedExistingId?: string;
}

interface TagSuggesterProps {
  productName: string;
  description: string;
  existingTags: { id: string; name: string }[];
  selectedTagIds: string[];
  onAcceptTag: (tagIds: string | string[]) => void;
}

export function TagSuggester({
  productName,
  description,
  existingTags,
  selectedTagIds,
  onAcceptTag,
}: TagSuggesterProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<SuggestedTag[]>([]);
  const [rejectedTags, setRejectedTags] = useState<string[]>([]);

  const handleSuggest = async () => {
    if (!productName.trim() || !description.trim()) {
      toast.error("Product info required", {
        description: "Please enter a product name and description first.",
      });
      return;
    }

    setIsSuggesting(true);
    setSuggestedTags([]);
    setRejectedTags([]);

    try {
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          description,
          existingTags: existingTags.map((t) => t.name),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to suggest tags");
      }

      const data = await response.json();

      if (data.suggestedTags && data.suggestedTags.length > 0) {
        // Match suggested tags with existing tags
        const matchedTags: SuggestedTag[] = data.suggestedTags.map(
          (suggestedName: string) => {
            const matched = existingTags.find(
              (t) =>
                t.name.toLowerCase() === suggestedName.toLowerCase() ||
                t.name.toLowerCase().includes(suggestedName.toLowerCase()) ||
                suggestedName.toLowerCase().includes(t.name.toLowerCase())
            );
            return {
              name: matched ? matched.name : suggestedName,
              matchedExistingId: matched?.id,
            };
          }
        );

        setSuggestedTags(matchedTags);
        
        // Automatically accept matched tags
        const tagsToAutoAccept = matchedTags
          .filter(t => t.matchedExistingId && !selectedTagIds.includes(t.matchedExistingId))
          .map(t => t.matchedExistingId as string);
          
        if (tagsToAutoAccept.length > 0) {
          onAcceptTag(tagsToAutoAccept);
          toast.success(`AI suggested and automatically added ${tagsToAutoAccept.length} tags!`);
        } else {
          toast.success(`Suggested ${matchedTags.length} tags!`);
        }
      } else {
        throw new Error("No tags suggested");
      }
    } catch (error: any) {
      console.error("Tag suggestion error:", error);
      toast.error("Could not suggest tags", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAccept = (tag: SuggestedTag) => {
    if (tag.matchedExistingId) {
      onAcceptTag(tag.matchedExistingId);
    }
    setRejectedTags((prev) => [...prev, tag.name]);
  };

  const handleReject = (tagName: string) => {
    setRejectedTags((prev) => [...prev, tagName]);
  };

  const visibleSuggestions = suggestedTags.filter(
    (tag) =>
      !rejectedTags.includes(tag.name) &&
      (!tag.matchedExistingId || !selectedTagIds.includes(tag.matchedExistingId))
  );

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSuggest}
        disabled={isSuggesting}
        className="h-8 px-3 rounded-lg border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-[10px] font-black uppercase tracking-wider gap-1.5"
      >
        {isSuggesting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Suggest Tags with AI
          </>
        )}
      </Button>

      <AnimatePresence>
        {visibleSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {visibleSuggestions.map((tag, index) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="h-9 px-3 rounded-xl gap-1.5 font-bold text-xs bg-indigo-500/5 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/10 cursor-pointer group"
                >
                  <Sparkles className="w-3 h-3" />
                  {tag.name}
                  {tag.matchedExistingId ? (
                    <button
                      type="button"
                      onClick={() => handleAccept(tag)}
                      className="ml-1 hover:bg-indigo-500/20 rounded p-0.5 transition-colors"
                      title="Add this tag"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[9px] opacity-50 ml-1">(new)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleReject(tag.name)}
                    className="ml-0.5 hover:bg-destructive/10 text-destructive/50 hover:text-destructive rounded p-0.5 transition-colors"
                    title="Reject suggestion"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {suggestedTags.length > 0 && visibleSuggestions.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          All suggestions processed. Add more tags manually or generate new suggestions.
        </p>
      )}
    </div>
  );
}
