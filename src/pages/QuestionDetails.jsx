import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useParams } from 'react-router-dom';

import { questionApi } from '../api/client';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AskQuestionDialog from '../components/AskQuestionDialog';

export default function QuestionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [editOpen, setEditOpen] = useState(false);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadQuestion() {
      setLoading(true);
      setError('');

      try {
        const response = await questionApi.getById(id);
        setQuestion(response);
      } catch (err) {
        setError(err.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, [id]);

  async function handleDelete() {

      const confirmed = window.confirm(
          "Are you sure you want to delete this question?"
      );

      if (!confirmed) {
          return;
      }

      try {
          await questionApi.delete(id);

          navigate("/");
      } catch (err) {
          alert(err.message);
      }
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>

          <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
              >
                  Delete
              </Button>
        </Stack>

        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              <Skeleton variant="text" width="70%" height={42} />
              <Skeleton variant="text" width="35%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />

              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={110} height={32} />
              </Stack>
            </Stack>
          </Paper>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h3">
                {question.title}
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                flexWrap="wrap"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Asked by{' '}
                  <strong>
                    {question.createdBy || 'Unknown'}
                  </strong>
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {new Date(question.createdAt).toLocaleString()}
                </Typography>
              </Stack>

              <Box
                sx={{
                  py: 3,
                  borderTop: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                  }}
                >
                  {question.content}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<VisibilityIcon />}
                  label={`${question.views ?? 0} Views`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Paper>
        )}
      </Stack>
      <AskQuestionDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialValues={{
          title: question?.title ?? '',
          content: question?.content ?? '',
        }}
        onSubmit={async (payload) => {
          const updatedQuestion = await questionApi.update(id, payload);
          setQuestion(updatedQuestion);
          setEditOpen(false);
        }}
      />
    </Container>
  );
}