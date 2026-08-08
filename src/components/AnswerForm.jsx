import { useState } from 'react';
import {
  Alert,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const initialContent = '';

export default function AnswerForm({ questionId, onCreated }) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmedContent = content.trim();

    if (trimmedContent.length < 10 || trimmedContent.length > 1000) {
      setError('Answer must be between 10 and 1000 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await onCreated({
        questionId,
        content: trimmedContent,
      });

      setContent(initialContent);
    } catch (err) {
      setError(err.message || 'Could not post answer.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit}
      sx={{ mt: 4 }}
    >
      <TextField
        fullWidth
        multiline
        minRows={5}
        label="Your Answer"
        placeholder="Write a helpful answer..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        inputProps={{ maxLength: 1000 }}
        helperText={`${content.length}/1000`}
        error={Boolean(error)}
      />

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        startIcon={<SendIcon />}
        disabled={submitting}
        sx={{ alignSelf: 'flex-start' }}
      >
        {submitting ? 'Posting...' : 'Post Answer'}
      </Button>
    </Stack>
  );
}