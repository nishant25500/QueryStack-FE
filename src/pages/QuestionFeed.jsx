import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import QuestionCard from '../components/QuestionCard';

export default function QuestionFeed({
  questions,
  loading,
  searchTerm,
  onSearch,
  onClearSearch,
  onLoadMore,
  hasNext,
  searchIcon,
  onAskQuestion,
}) {
  const [draft, setDraft] = useState(searchTerm);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSearch(draft);
  }

  function clearSearch() {
    setDraft('');
    onClearSearch();
  }

  return (
    <Stack spacing={2.5}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search questions"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {searchIcon}
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained">
            Search
          </Button>

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearSearch}
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      {loading && questions.length === 0 ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Skeleton variant="text" width="60%" height={36} />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Skeleton variant="rounded" width={70} height={28} />
                <Skeleton variant="rounded" width={90} height={28} />
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : questions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">
            {searchTerm ? 'No matching questions' : 'No questions yet'}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm
              ? 'Try searching with different keywords.'
              : 'Be the first one to ask a question and start the discussion.'}
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            {searchTerm ? (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={onAskQuestion}
              >
                Ask the First Question
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {questions.map((question) => (
            <QuestionCard
              key={question.id || `${question.title}-${question.createdAt}`}
              question={question}
            />
          ))}
        </Stack>
      )}

      {hasNext && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<KeyboardArrowDownIcon />}
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </Box>
      )}
    </Stack>
  );
}