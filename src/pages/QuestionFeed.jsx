import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
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
              startAdornment: <InputAdornment position="start">{searchIcon}</InputAdornment>,
            }}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearSearch}>
            Clear
          </Button>
        </Stack>
      </Paper>

      {loading && questions.length === 0 ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
          <CircularProgress />
        </Box>
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
          <Typography variant="h3">No questions found</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try a different search or post the first question.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {questions.map((question) => (
            <QuestionCard key={question.id || `${question.title}-${question.createdAt}`} question={question} />
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
