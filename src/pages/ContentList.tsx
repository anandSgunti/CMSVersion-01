import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentFilters as ContentFiltersComponent } from "@/components/content/ContentFilters";
import { InlineLoading } from "@/components/common/LoadingSpinner";
import { useContent } from "@/hooks/useContent";
import { ContentFilters, ContentItem } from "@/types/content";

const ContentList = () => {
  const [filters, setFilters] = useState<ContentFilters>({});
  const { data: content, isLoading, error } = useContent(filters);

  const handleView = (contentItem: ContentItem) => {
    console.log('View content:', contentItem);
  };

  const handleEdit = (contentItem: ContentItem) => {
    console.log('Edit content:', contentItem);
  };

  const handleDelete = (contentItem: ContentItem) => {
    console.log('Delete content:', contentItem);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage your content</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant hover:shadow-lg transition-smooth">
          <Plus className="w-4 h-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* Filters */}
      <ContentFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />

      {/* Content List */}
      <div className="space-y-6">
        {isLoading && <InlineLoading text="Loading content..." />}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load content</p>
          </div>
        )}

        {!isLoading && !error && content && (
          <>
            {content.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No content found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {content.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentList;