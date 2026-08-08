import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { answerApi } from '../api/client';
import { STORAGE_KEYS } from '../constants/storage';
import { formatRelativeTime } from '../utils/dateUtils';


export default function AnswerCard({
  answer,
  onUpdated,
  onDeleted,
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(answer.content);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /*
   * JWT is already stored in localStorage.
   * For now we decode the payload only to determine
   * whether the logged-in user owns this answer.
   */
  function getCurrentUserEmail() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  const currentUserEmail = getCurrentUserEmail();

  const isOwner =
    currentUserEmail &&
    currentUserEmail === answer.createdBy;

  async function handleUpdate() {
    const trimmedContent = content.trim();

    if (trimmedContent.length < 10 || trimmedContent.length > 1000) {
      setError('Answer must be between 10 and 1000 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await answerApi.update(answer.id, {
        content: trimmedContent,
      });

      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update answer');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this answer?'
    );

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await answerApi.delete(answer.id);
      onDeleted();
    } catch (err) {
      setError(err.message || 'Failed to delete answer');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box>
      <Stack spacing={2}>
        {editing ? (
          <>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              inputProps={{ maxLength: 1000 }}
              helperText={`${content.length}/1000`}
              error={Boolean(error)}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setContent(answer.content);
                  setEditing(false);
                  setError('');
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
              }}
            >
              {answer.content}
            </Typography>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Answered by{' '}
                  <strong>
                    {(answer.createdBy || 'Unknown').split('@')[0]}
                  </strong>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {formatRelativeTime(answer.createdAt)}
                </Typography>
              </Stack>

              {isOwner && (
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Delete
                  </Button>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </Stack>

      <Divider sx={{ mt: 3 }} />
    </Box>
  );
}