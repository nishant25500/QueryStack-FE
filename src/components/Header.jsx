import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Header({
  auth,
  userInitial,
  onAsk,
  onLogin,
  onLogout,
  onRefresh,
}) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
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
          <Typography variant="h3" noWrap>
            QueryStack
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
          >
            Ask, search, and track engineering questions
          </Typography>
        </Box>

        <Tooltip title="Refresh questions">
          <IconButton
            onClick={onRefresh}
            aria-label="Refresh questions"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAsk}
          disabled={auth.profileLoading}
        >
          Ask Question
        </Button>

        {auth.isAuthenticated ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Tooltip title={auth.user?.email || ''}>
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {userInitial}
                  </Avatar>
                }
                label={auth.user?.email || 'Signed in'}
                sx={{
                  maxWidth: {
                    xs: 120,
                    sm: 260,
                  },
                }}
              />
            </Tooltip>

            <Tooltip title="Sign out">
              <IconButton
                onClick={onLogout}
                aria-label="Sign out"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={onLogin}
          >
            Sign in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}