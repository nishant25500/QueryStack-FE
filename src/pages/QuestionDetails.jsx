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

export default function QuestionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to Questions
        </Button>

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
    </Container>
  );
}