"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DescriptionGeneratorProps {
  productName: string;
  tags?: string[];
  onGenerate: (description: string, tagline: string) => void;
}

export function DescriptionGenerator({
  productName,
  tags = [],
  onGenerate,
}: DescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast.error("Product name required", {
        description: "Please enter a product name first.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          tags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate description");
      }

      const data = await response.json();

      if (data.description) {
        onGenerate(data.description, data.tagline || "");
        toast.success("Description generated!", {
          description: data.tagline ? `Tagline: "${data.tagline}"` : undefined,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error("Generation failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating || !productName.trim()}
      className="h-8 px-3 rounded-lg border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-[10px] font-black uppercase tracking-wider gap-1.5"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Generate with AI
        </>
      )}
    </Button>
  );
}
