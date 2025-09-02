import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Avatar,
  Divider,
  Stack,
  Chip,
  AppBar,
  Toolbar,
  Button,
  Container,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthApi, endpoints } from '../config/Api';

export default function DetailPage() {
  const [post, setPost] = useState(null);
  const { post_id } = useParams();
  const navigate = useNavigate();

  const fetchDataPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await AuthApi(token).get(endpoints['postDetail'](post_id));
      setPost(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approvePost = async () => {
    try {
      const token = localStorage.getItem('token');
      await AuthApi(token).patch(endpoints['approve'](post_id));
      fetchDataPost();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectPost = async () => {
    try {
      const token = localStorage.getItem('token');
      await AuthApi(token).patch(endpoints['reject'](post_id), {
        reason: 'Không hợp lệ',
      });
      fetchDataPost();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataPost();
  }, [post_id]);

  if (!post) return <Typography>Không tìm thấy bài đăng.</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Quay lại
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Chi tiết bài đăng
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Nội dung */}
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        {/* Tiêu đề */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Đăng vào lúc {new Date(post.posted_time).toLocaleString('vi-VN')}
        </Typography>

        {/* Ảnh */}
        {post.images && post.images.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {post.images.map((img, idx) => (
              <Grid item xs={6} key={idx}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={img.image || '#'}
                    alt={`Hình ${idx + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mô tả */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Mô tả
          </Typography>
          <Typography variant="body1">{post.description}</Typography>
        </Box>

        {/* Thông tin thêm */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Loại</Typography>
            <Typography>{post.type === 'lost' ? 'Mất đồ' : 'Nhặt được'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Tình trạng</Typography>
            <Chip
              label={post.status === 'processing' ? 'Chờ duyệt' : post.status}
              color={
                post.status === 'processing'
                  ? 'warning'
                  : post.status === 'rejected'
                  ? 'error'
                  : 'success'
              }
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Danh mục</Typography>
            <Typography>{post.category?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Liên hệ</Typography>
            <Typography color="primary">{post.phone}</Typography>
          </Grid>
        </Grid>

        {/* Địa điểm */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Địa điểm
          </Typography>
          <Typography>{post.location}</Typography>
          <Typography color="text.secondary" variant="body2">
            {post.ward}, {post.district}, {post.province}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Người đăng */}
        <Stack direction="row" spacing={2} alignItems="center">
          {post.user?.avatar ? (
            <Avatar src={post.user.avatar} alt={post.user.username} />
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
          <Box>
            <Typography fontWeight="bold">{post.user?.username}</Typography>
            {post.user?.full_name && (
              <Typography variant="body2" color="text.secondary">
                {post.user.full_name || post.user.username}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" color="success" onClick={approvePost}>
            Duyệt
          </Button>
          <Button variant="outlined" color="error" onClick={rejectPost}>
            Từ chối
          </Button>
        </Stack>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 2, mt: 'auto' }}>
        <Typography variant="body2" align="center" color="text.secondary">
          © {new Date().getFullYear()} Lost & Found App - All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
