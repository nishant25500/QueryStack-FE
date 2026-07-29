import {
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

export default function DashboardHero({
  questionsCount,
  isAuthenticated,
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'minmax(0, 1fr) 280px',
        },
        gap: 3,
        alignItems: 'start',
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h1">
          Questions worth answering
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: 760 }}
        >
          Browse the latest questions from the backend,
          search by keyword, and post new questions when you
          are signed in.
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
          <Typography variant="h2">
            {questionsCount}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Loaded
          </Typography>
        </Box>

        <Box>
          <Typography variant="h2">
            {isAuthenticated ? 'On' : 'Off'}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Session
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}