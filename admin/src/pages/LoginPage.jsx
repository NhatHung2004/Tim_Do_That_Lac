import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Api, { endpoints } from '../config/Api';
import { MyDispatchContext } from '../config/MyContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatchContext);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await Api.post(endpoints.login, {
        username: username,
        password: password,
      });
      localStorage.setItem('token', res.data.access);
      dispatch({ type: 'login', payload: res.data.user });
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đăng nhập để tiếp tục sử dụng
            </Typography>
          </Stack>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField
              label="Tên đăng nhập"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              onClick={handleLogin}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              {loading ? <CircularProgress /> : 'Đăng nhập'}
            </Button>
          </Stack>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Quên mật khẩu?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
