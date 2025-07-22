import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Eye, Globe } from "lucide-react";
import type { CmsPage } from "@shared/schema";

interface CreateCmsPageData {
  title: string;
  content: string;
  slug: string;
  metaDescription?: string;
  metaKeywords?: string;
  isPublished: boolean;
}

export default function CmsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [newPage, setNewPage] = useState<CreateCmsPageData>({
    title: "",
    content: "",
    slug: "",
    metaDescription: "",
    metaKeywords: "",
    isPublished: false
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch CMS pages
  const { data: pages = [], isLoading } = useQuery<CmsPage[]>({
    queryKey: ["/api/admin/cms-pages"],
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: CreateCmsPageData) => {
      const response = await fetch("/api/admin/cms-pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create page");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      setIsCreateDialogOpen(false);
      setNewPage({
        title: "",
        content: "",
        slug: "",
        metaDescription: "",
        metaKeywords: "",
        isPublished: false
      });
      toast({
        title: "Success",
        description: "Page created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
    }
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, ...pageData }: Partial<CmsPage> & { id: number }) => {
      const response = await fetch(`/api/admin/cms-pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update page");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      setEditingPage(null);
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      });
    }
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms-pages/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete page");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  });

  // Filter pages based on search
  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (page.content && page.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleCreatePage = () => {
    if (!newPage.title || !newPage.content || !newPage.slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Generate slug if not provided
    if (!newPage.slug) {
      const slug = newPage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setNewPage({...newPage, slug});
    }
    
    createPageMutation.mutate(newPage);
  };

  const handleUpdatePage = (pageData: Partial<CmsPage>) => {
    if (editingPage) {
      updatePageMutation.mutate({ ...pageData, id: editingPage.id });
    }
  };

  const handleDeletePage = (id: number) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      deletePageMutation.mutate(id);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>CMS Page Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={newPage.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewPage({
                        ...newPage, 
                        title,
                        slug: generateSlug(title)
                      });
                    }}
                    placeholder="About Us"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /pages/
                    </span>
                    <Input
                      id="slug"
                      className="rounded-l-none"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                      placeholder="about-us"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={newPage.content}
                    onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                    placeholder="Page content goes here..."
                    rows={10}
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={newPage.metaDescription || ""}
                    onChange={(e) => setNewPage({...newPage, metaDescription: e.target.value})}
                    placeholder="Brief description for search engines"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={newPage.metaKeywords || ""}
                    onChange={(e) => setNewPage({...newPage, metaKeywords: e.target.value})}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPublished" 
                    checked={newPage.isPublished}
                    onCheckedChange={(checked) => setNewPage({...newPage, isPublished: !!checked})}
                  />
                  <Label htmlFor="isPublished">Publish immediately</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePage} disabled={createPageMutation.isPending}>
                    {createPageMutation.isPending ? "Creating..." : "Create Page"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pages List */}
        <div className="space-y-4">
          {filteredPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pages found
            </div>
          ) : (
            filteredPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium">{page.title}</h3>
                    <Badge variant={page.isPublished ? "default" : "secondary"}>
                      {page.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    /pages/{page.slug}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {formatDate(page.createdAt)}</span>
                    <span>Modified: {formatDate(page.updatedAt)}</span>
                  </div>
                  {page.metaDescription && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {page.isPublished && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPage(page)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Edit Page Dialog */}
      {editingPage && (
        <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Page Title</Label>
                <Input
                  id="editTitle"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="editSlug">URL Slug</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /pages/
                  </span>
                  <Input
                    id="editSlug"
                    className="rounded-l-none"
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editContent">Content</Label>
                <Textarea
                  id="editContent"
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="editMetaDescription">Meta Description</Label>
                <Textarea
                  id="editMetaDescription"
                  value={editingPage.metaDescription || ""}
                  onChange={(e) => setEditingPage({...editingPage, metaDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="editMetaKeywords">Meta Keywords</Label>
                <Input
                  id="editMetaKeywords"
                  value={editingPage.metaKeywords || ""}
                  onChange={(e) => setEditingPage({...editingPage, metaKeywords: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="editIsPublished" 
                  checked={editingPage.isPublished || false}
                  onCheckedChange={(checked) => setEditingPage({...editingPage, isPublished: !!checked})}
                />
                <Label htmlFor="editIsPublished">Published</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPage(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdatePage(editingPage)} 
                  disabled={updatePageMutation.isPending}
                >
                  {updatePageMutation.isPending ? "Updating..." : "Update Page"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
