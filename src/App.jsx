import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { theme } from './theme';
import { useAuth } from './hooks/useAuth';
import { questionApi } from './api/client';
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

  async function loadQuestions({ append = false, cursor = null, term = searchTerm } = {}) {
    setLoading(true);
    setError('');
    try {
      if (term.trim()) {
        const results = await questionApi.search({ searchTerm: term.trim() });
        setQuestions(results);
        setNextCursor(null);
        setHasNext(false);
        return;
      }

      const page = await questionApi.list({ cursor });
      setQuestions((current) => (append ? [...current, ...(page.items || [])] : page.items || []));
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar sx={{ gap: 2, minHeight: 68 }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 800,
              }}
            >
              QS
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h3" component="div" noWrap>
                QueryStack
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Ask, search, and track engineering questions
              </Typography>
            </Box>
            <Tooltip title="Refresh questions">
              <IconButton onClick={() => loadQuestions({ term: searchTerm })} aria-label="Refresh questions">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAskClick}>
              Ask
            </Button>
            {auth.isAuthenticated ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  avatar={<Avatar>{userInitial}</Avatar>}
                  label={auth.user?.email || 'Signed in'}
                  sx={{ maxWidth: { xs: 120, sm: 260 } }}
                />
                <Tooltip title="Sign out">
                  <IconButton onClick={auth.logout} aria-label="Sign out">
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setAuthOpen(true)}>
                Sign in
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 280px' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h1">Questions worth answering</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                  Browse the latest questions from the backend, search by keyword, and post new
                  questions when you are signed in.
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                divider={<Divider orientation="vertical" flexItem />}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  justifyContent: 'space-around',
                }}
              >
                <Box>
                  <Typography variant="h2">{questions.length}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Loaded
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2">{auth.isAuthenticated ? 'On' : 'Off'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Session
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <QuestionFeed
              questions={questions}
              loading={loading}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onClearSearch={() => handleSearch('')}
              onLoadMore={() => loadQuestions({ append: true, cursor: nextCursor, term: '' })}
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
        message={snackbar}
      />
    </ThemeProvider>
  );
}
