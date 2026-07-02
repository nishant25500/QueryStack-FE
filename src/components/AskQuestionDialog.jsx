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
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const initialForm = {
  title: '',
  content: '',
};

export default function AskQuestionDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const titleLength = form.title.trim().length;
    const contentLength = form.content.trim().length;

    if (titleLength < 5 || titleLength > 100) {
      setError('Title must be between 5 and 100 characters.');
      return;
    }

    if (contentLength < 10 || contentLength > 100) {
      setError('Content must be between 10 and 100 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        content: form.content.trim(),
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Could not post question.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Ask a question</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              fullWidth
              name="title"
              label="Title"
              inputProps={{ minLength: 5, maxLength: 100 }}
              value={form.title}
              onChange={updateField}
              helperText={`${form.title.length}/100`}
            />
            <TextField
              required
              fullWidth
              multiline
              minRows={4}
              name="content"
              label="Details"
              inputProps={{ minLength: 10, maxLength: 100 }}
              value={form.content}
              onChange={updateField}
              helperText={`${form.content.length}/100`}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
