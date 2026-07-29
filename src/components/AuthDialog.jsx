import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const initialForm = {
  email: '',
  password: '',
};

export default function AuthDialog({ open, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  function updateField(event) {
      setError('');
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (form.password.length < 5 || form.password.length > 15) {
      setError('Password must be between 5 and 15 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await onRegister(form);
      } else {
        await onLogin(form);
      }
      setForm(initialForm);

    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setForm(initialForm);
    setError('');
    setMode('login');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{isRegister ? 'Create account' : 'Sign in'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Tabs value={mode} onChange={(_, value) => setMode(value)} variant="fullWidth">
              <Tab icon={<LoginIcon />} iconPosition="start" label="Sign in" value="login" />
              <Tab icon={<PersonAddIcon />} iconPosition="start" label="Register" value="register" />
            </Tabs>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              fullWidth
              type="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={updateField}
            />
            <TextField
              required
              fullWidth
              type="password"
              name="password"
              label="Password"
              inputProps={{ minLength: 5, maxLength: 15 }}
              helperText="5 to 15 characters"
              value={form.password}
              onChange={updateField}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Working...' : isRegister ? 'Register' : 'Sign in'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
