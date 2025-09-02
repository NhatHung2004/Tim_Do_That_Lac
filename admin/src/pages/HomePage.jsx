import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthApi, endpoints } from '../config/Api';
import { useContext } from 'react';
import { MyDispatchContext, MyUserContext } from '../config/MyContext';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const current_user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  useEffect(() => {
    if (current_user == null) return navigate('/login');
  }, [current_user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'logout' });
    navigate('/login');
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await AuthApi(token).get(endpoints['posts']);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (current_user) fetchPosts();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📋 Quản lý bài đăng
          </Typography>
          {current_user && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={current_user.avatar || ''}
                alt={current_user.username}
                sx={{ width: 32, height: 32 }}
              >
                {current_user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography>{current_user.username}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container sx={{ flex: 1, py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Danh sách bài cần duyệt
        </Typography>

        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchPosts()}
          sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map(p => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/posts/${p.id}`)}
                >
                  <TableCell>{p.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.type === 'lost' ? 'Mất đồ' : 'Nhặt được'}
                      color={p.type === 'lost' ? 'warning' : 'info'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      color={
                        p.status === 'processing'
                          ? 'warning'
                          : p.status === 'approved'
                          ? 'success'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  {p.status === 'processing' ? (
                    <TableCell
                      align="right"
                      onClick={e => e.stopPropagation()} // để tránh click nhầm
                    >
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => alert('Approve ' + p.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => alert('Reject ' + p.id)}
                        sx={{ ml: 1 }}
                      >
                        Từ chối
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell align="right">
                      <Typography>Đã xử lý</Typography>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có bài đăng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 2, mt: 'auto' }}>
        <Typography variant="body2" align="center" color="text.secondary">
          © {new Date().getFullYear()} Lost & Found Admin Panel
        </Typography>
      </Box>
    </Box>
  );
}
