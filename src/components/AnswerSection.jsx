import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { answerApi } from '../api/client';
import AnswerCard from './AnswerCard';
import AnswerForm from './AnswerForm';

export default function AnswerSection({ questionId }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAnswers() {
    setLoading(true);
    setError('');

    try {
      const response = await answerApi.listByQuestion(questionId);
      setAnswers(response || []);
    } catch (err) {
      setError(err.message || 'Failed to load answers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnswers();
  }, [questionId]);

  async function handleCreateAnswer(payload) {
    await answerApi.create(payload);

    // Refresh the answers after successful creation
    await loadAnswers();
  }

  return (
    <Stack spacing={3} sx={{ mt: 5 }}>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {answers.length}{' '}
          {answers.length === 1 ? 'Answer' : 'Answers'}
        </Typography>
      </Box>

      <Divider />

      {loading && (
        <Typography color="text.secondary">
          Loading answers...
        </Typography>
      )}

      {!loading && error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!loading && !error && answers.length === 0 && (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary">
            No answers yet. Be the first to answer this question.
          </Typography>
        </Box>
      )}

      {!loading &&
        !error &&
        answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            onUpdated={loadAnswers}
            onDeleted={loadAnswers}
          />
        ))}

      <Box
        sx={{
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Your Answer
        </Typography>

        <AnswerForm
          questionId={questionId}
          onCreated={handleCreateAnswer}
        />
      </Box>
    </Stack>
  );
}