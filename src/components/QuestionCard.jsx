import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';

function formatDate(value) {
  if (!value) return 'No date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function QuestionCard({ question }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/questions/${question.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'all .2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Chip
              size="small"
              icon={<QuestionAnswerIcon />}
              label="Question"
              color="primary"
              variant="outlined"
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {formatDate(question.createdAt)}
            </Typography>
          </Stack>

          <Typography variant="h3">
            {question.title}
          </Typography>

          <Typography color="text.secondary">
            {question.content}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonOutlineIcon
                fontSize="small"
                color="action"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {question.createdBy || 'Unknown'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <VisibilityOutlinedIcon
                fontSize="small"
                color="action"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {question.views ?? 0} Views
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}