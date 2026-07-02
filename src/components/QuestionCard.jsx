import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

function formatDate(value) {
  if (!value) return 'No date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function QuestionCard({ question }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip size="small" icon={<QuestionAnswerIcon />} label="Question" color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(question.createdAt)}
            </Typography>
          </Stack>
          <Typography variant="h3" component="h2">
            {question.title}
          </Typography>
          <Typography color="text.secondary">{question.content}</Typography>
          {question.id && (
            <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              ID: {question.id}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
