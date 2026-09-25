"use client";

import { Container, Box, Typography, Paper, Grid, Button, Alert, LinearProgress, Avatar, Rating, Chip, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useReviews } from "@/services/api/reviews";
import { useUser } from "@/services/api/auth";
import { Edit, Delete, Star, Add, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { data: userData } = useUser();
  const { data: reviewsData, isLoading, refetch } = useReviews({ page, limit: 10 });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });

  const reviews = reviewsData?.data?.data || [];
  const pagination = reviewsData?.data?.meta?.pagination;

  const handleOpenDialog = (review?: any) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        rating: review.rating,
        title: review.title || "",
        comment: review.comment,
      });
    } else {
      setEditingReview(null);
      setFormData({ rating: 0, title: "", comment: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingReview) {
        await apiClient.reviews.update(editingReview._id, formData);
      } else {
        // For new reviews, we'd need productId - but this page is for viewing existing reviews
      }
      handleCloseDialog();
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await apiClient.reviews.delete(reviewId);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to delete review");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!userData?.data) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to view your reviews
        </Alert>
        <Button variant="contained" component="a" href="/login?redirect=/account/reviews">
          Log In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Reviews</Typography>

        {reviews.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
            <Star sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>No reviews yet</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Share your experience with products you've purchased
            </Typography>
            <Button variant="contained" component="a" href="/products" startIcon={<Add />}>
              Browse Products
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                You have {reviewsData?.data?.meta?.pagination?.total || 0} review{reviewsData?.data?.meta?.pagination?.total !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {reviews.map((review: any) => (
              <Paper key={review._id} elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        backgroundColor: "grey.200",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {review.product?.images?.[0] ? (
                        <img src={review.product.images[0]} alt={review.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Typography variant="h6" color="text.secondary">📦</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        {review.product?.name || "Unknown Product"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(review)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(review._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Rating
                  value={review.rating}
                  readOnly
                  precision={0.5}
                  size="medium"
                  sx={{ mb: 2 }}
                />

                {review.title && (
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    {review.title}
                  </Typography>
                )}

                <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
                  {review.comment}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={review.verifiedPurchase ? "Verified Purchase" : "Not Verified"}
                      size="small"
                      color={review.verifiedPurchase ? "success" : "default"}
                      variant="outlined"
                      icon={review.verifiedPurchase ? <Star /> : undefined}
                    />
                    {review.helpfulCount > 0 && (
                      <Chip
                        label={`${review.helpfulCount} helpful`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Button
                    variant="text"
                    size="small"
                    component="a"
                    href={`/products/${review.product?.slug}`}
                  >
                    View Product
                  </Button>
                </Box>
              </Paper>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant={page === 1 ? "outlined" : "text"}
                  disabled={page === 1}
                  onClick={() => router.push(`/account/reviews?page=${page - 1}`)}
                >
                  Previous
                </Button>
                <Box sx={{ display: "flex", mx: 2, alignItems: "center" }}>
                  <Typography>Page {page} of {pagination.totalPages}</Typography>
                </Box>
                <Button
                  variant={page === pagination.totalPages ? "outlined" : "text"}
                  disabled={page === pagination.totalPages}
                  onClick={() => router.push(`/account/reviews?page=${page + 1}`)}
                >
                  Next
                </Button>
              </Box>
            )}
          </>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingReview ? "Edit Review" : "Write Review"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Your Rating</Typography>
                  <Rating
                    value={formData.rating}
                    onChange={(_, value) => setFormData({ ...formData, rating: value || 0 })}
                    precision={0.5}
                    name="rating"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title (Optional)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Review"
                    multiline
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    required
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit" form="review-form" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingReview ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}