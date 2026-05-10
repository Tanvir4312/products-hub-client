"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shared/ProductCard/ProductCard";
import { useMostVotedProducts } from "@/hooks/useProducts";
import { IProduct } from "@/types/product.types";
import { toast } from "sonner";

interface RecommendationData {
  recommendedCategories: string[];
  keywords: string[];
  reasoning: string;
}

interface RecommendedContentProps {
  upvotedProducts?: IProduct[];
}

export function RecommendedContent({ upvotedProducts }: RecommendedContentProps) {
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Fallback to most voted products if no AI recommendations
  const { data: fallbackProducts, isLoading: isFallbackLoading } = useMostVotedProducts(4);

  const generateRecommendations = async () => {
    // Use upvoted products or fallback to featured products for context
    const productsForContext = upvotedProducts && upvotedProducts.length > 0
      ? upvotedProducts
      : fallbackProducts?.slice(0, 4);

    if (!productsForContext || productsForContext.length === 0) {
      toast.error("No product data available", {
        description: "Please try again later.",
      });
      return;
    }

    setIsGenerating(true);
    setHasAttempted(true);

    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upvotedProducts: productsForContext.map((p) => ({
            name: p.name,
            tags: p.tags || [],
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
      toast.success("Recommendations generated!");
    } catch (error: any) {
      console.error("Recommendation error:", error);
      toast.error("Could not generate AI recommendations", {
        description: "Showing popular products instead.",
      });
      // Will fallback to most voted products
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on mount if we have upvoted products
  useEffect(() => {
    if (upvotedProducts && upvotedProducts.length > 0 && !hasAttempted) {
      generateRecommendations();
    }
  }, [upvotedProducts]);

  // Filter products based on keywords if we have recommendations
  const displayProducts = recommendations?.keywords && fallbackProducts
    ? fallbackProducts.filter((p) =>
        recommendations.keywords.some(
          (keyword) =>
            p.name.toLowerCase().includes(keyword.toLowerCase()) ||
            p.tags?.some((t) =>
              t.tag?.name?.toLowerCase().includes(keyword.toLowerCase())
            )
        )
      ).slice(0, 4)
    : fallbackProducts?.slice(0, 4);

  const finalProducts = (displayProducts && displayProducts.length > 0) ? displayProducts : (fallbackProducts?.slice(0, 4) || []);

  if (isFallbackLoading || isGenerating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">Recommended For You</span>
          </div>
          {isGenerating && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing your interests...
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">
            {recommendations ? "AI Recommended For You" : "Popular Products"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="h-7 text-xs gap-1.5"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </Button>
      </div>

      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg"
        >
          <span className="font-medium">Based on your interests:</span>{" "}
          {recommendations.recommendedCategories.join(", ")}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {finalProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!recommendations && !isGenerating && (
        <div className="text-center py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Get AI-Powered Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
