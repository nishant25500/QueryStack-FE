import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Snackbar,
  Stack,
  ThemeProvider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { theme } from './theme';
import { useAuth } from './hooks/useAuth';
import { questionApi } from './api/client';

import Header from './components/Header';
import DashboardHero from './components/DashboardHero';
import AuthDialog from './components/AuthDialog';
import AskQuestionDialog from './components/AskQuestionDialog';
import QuestionFeed from './pages/QuestionFeed';

export default function App() {
  const auth = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const userInitial = useMemo(() => {
    return auth.user?.email?.slice(0, 1).toUpperCase() || 'Q';
  }, [auth.user]);

  async function loadQuestions({
    append = false,
    cursor = null,
    term = searchTerm,
  } = {}) {
    setLoading(true);
    setError('');

    try {
      if (term.trim()) {
        const results = await questionApi.search({
          searchTerm: term.trim(),
        });

        setQuestions(results);
        setNextCursor(null);
        setHasNext(false);
        return;
      }

      const page = await questionApi.list({ cursor });

      setQuestions((current) =>
        append ? [...current, ...(page.items || [])] : page.items || []
      );

      setNextCursor(page.nextCursor || null);
      setHasNext(Boolean(page.hasNext));
    } catch (err) {
      setError(err.message || 'Could not load questions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions({ term: '' });
  }, []);

  async function handleSearch(term) {
    setSearchTerm(term);
    await loadQuestions({ term });
  }

  async function handleCreateQuestion(payload) {
    await questionApi.create(payload);

    setAskOpen(false);
    setSnackbar('Question posted');

    await loadQuestions({ term: '' });
    setSearchTerm('');
  }

  function handleAskClick() {
    if (!auth.isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    setAskOpen(true);
  }

  function handleLogout() {
    auth.logout();
    setSnackbar('Logged out successfully');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header
          auth={auth}
          userInitial={userInitial}
          onAsk={handleAskClick}
          onLogin={() => setAuthOpen(true)}
          onLogout={handleLogout}
          onRefresh={() => loadQuestions({ term: searchTerm })}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <DashboardHero
              questionsCount={questions.length}
              isAuthenticated={auth.isAuthenticated}
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <QuestionFeed
              questions={questions}
              loading={loading}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onClearSearch={() => handleSearch('')}
              onLoadMore={() =>
                loadQuestions({
                  append: true,
                  cursor: nextCursor,
                  term: '',
                })
              }
              hasNext={!searchTerm && hasNext}
              searchIcon={<SearchIcon />}
            />
          </Stack>
        </Container>
      </Box>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={auth.login}
        onRegister={auth.register}
      />

      <AskQuestionDialog
        open={askOpen}
        onClose={() => setAskOpen(false)}
        onSubmit={handleCreateQuestion}
      />

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbar('')}
          sx={{ width: '100%' }}
        >
          {snackbar}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}