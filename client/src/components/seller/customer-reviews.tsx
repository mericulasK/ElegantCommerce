import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageCircle, Star, ThumbsUp, ThumbsDown, Reply, Search } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
  isPublished: boolean;
  sellerResponse?: string;
  responseDate?: string;
  helpfulCount: number;
  reportCount: number;
}

export default function CustomerReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  // Fetch reviews data
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["seller-reviews"],
    queryFn: async () => {
      const response = await fetch("/api/seller/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: 1,
      productId: 1,
      productName: "Premium Wireless Headphones",
      userId: 101,
      userName: "John Doe",
      rating: 5,
      comment: "Excellent sound quality and comfortable to wear for long periods. Battery life is amazing!",
      createdAt: "2024-01-20T15:30:00Z",
      isVerified: true,
      isPublished: true,
      helpfulCount: 12,
      reportCount: 0
    },
    {
      id: 2,
      productId: 2,
      productName: "Smart Fitness Watch",
      userId: 102,
      userName: "Sarah Wilson",
      rating: 4,
      comment: "Great features and accurate tracking. The only downside is the battery life could be better.",
      createdAt: "2024-01-18T09:15:00Z",
      isVerified: true,
      isPublished: true,
      sellerResponse: "Thank you for your feedback! We're working on improving battery life in future updates.",
      responseDate: "2024-01-19T10:00:00Z",
      helpfulCount: 8,
      reportCount: 0
    },
    {
      id: 3,
      productId: 1,
      productName: "Premium Wireless Headphones",
      userId: 103,
      userName: "Mike Johnson",
      rating: 2,
      comment: "Not satisfied with the build quality. The headphones broke after just two weeks.",
      createdAt: "2024-01-15T14:20:00Z",
      isVerified: true,
      isPublished: true,
      helpfulCount: 3,
      reportCount: 1
    }
  ];

  const reviewsData = reviews || mockReviews;

  // Filter reviews based on search and rating
  const filteredReviews = reviewsData.filter((review: Review) => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  // Calculate review stats
  const averageRating = reviewsData.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviewsData.length;
  const totalReviews = reviewsData.length;
  const pendingReviews = reviewsData.filter((review: Review) => !review.isPublished).length;
  const needResponse = reviewsData.filter((review: Review) => !review.sellerResponse && review.rating <= 3).length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
    if (rating >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>;
    return <Badge variant="destructive">Negative</Badge>;
  };

  const handleResponse = () => {
    if (selectedReview && responseText.trim()) {
      // API call to submit response would go here
      console.log("Responding to review:", selectedReview.id, responseText);
      setResponseText("");
      setIsResponseDialogOpen(false);
      setSelectedReview(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Average Rating:</span>
          <div className="flex items-center gap-1">
            {renderStars(Math.round(averageRating))}
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{totalReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Reply className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Need Response</p>
                <p className="text-2xl font-bold">{needResponse}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ThumbsDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{pendingReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Ratings</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-500">No reviews match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review: Review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                      )}
                      {getRatingBadge(review.rating)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Product: {review.productName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.helpfulCount > 0 && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpfulCount}
                      </div>
                    )}
                    {!review.sellerResponse && review.rating <= 3 && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{review.comment}</p>

                {review.sellerResponse && (
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-blue-800">Your Response</span>
                      <span className="text-xs text-blue-600">
                        {format(new Date(review.responseDate!), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="text-blue-800">{review.sellerResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedReview.userName}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-gray-800">{selectedReview.comment}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write a professional response to this review..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleResponse} disabled={!responseText.trim()}>
                  Submit Response
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsResponseDialogOpen(false);
                    setResponseText("");
                    setSelectedReview(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
