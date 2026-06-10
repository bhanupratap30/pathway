import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { toast } from 'react-hot-toast';
import { fetchSubmissions } from '../features/submissions/submissionsSlice';
import AnimatedPage from '../components/Common/AnimatedPage';

export const Submissions = () => {
  const dispatch = useDispatch();
  const { submissions, loading, totalElements, page, size } = useSelector((state) => state.submissions);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    dispatch(fetchSubmissions({ search: debouncedSearch, page, size }));
  }, [dispatch, debouncedSearch, page, size]);

  const handleChangePage = (event, newPage) => {
    dispatch(fetchSubmissions({ search: debouncedSearch, page: newPage, size }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(fetchSubmissions({ search: debouncedSearch, page: 0, size: newSize }));
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions available to export');
      return;
    }

    const headers = ['Full Name', 'Email', 'Qualification', 'Experience (Years)', 'Profession', 'Recommendation', 'Created At'];
    
    const rows = submissions.map(sub => [
      `"${sub.fullName.replace(/"/g, '""')}"`,
      `"${sub.email.replace(/"/g, '""')}"`,
      `"${sub.qualification.replace(/"/g, '""')}"`,
      sub.experience,
      `"${sub.profession.replace(/"/g, '""')}"`,
      `"${sub.recommendation.replace(/"/g, '""')}"`,
      new Date(sub.createdAt).toLocaleString()
    ]);

    const csvContent = '\ufeff' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `academic_submissions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Export downloaded successfully');
  };

  const getRecommendationChipColor = (rec) => {
    switch (rec) {
      case 'Honorary Doctorate':
        return 'primary';
      case 'PhD':
        return 'secondary';
      case 'DBA':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: 2,
            mb: 4 
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontFamily: 'Outfit', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Student Submissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              View and filter recent profile analysis requests.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCSV}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Search & Filters */}
        <Paper 
          elevation={0} 
          className="glass-panel"
          sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 'none' }}
        >
          <TextField
            fullWidth
            placeholder="Search by Name, Email, or Recommendation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              className: 'focus-glow',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: loading && <CircularProgress size={20} color="inherit" />
            }}
          />
        </Paper>

        {/* Submissions Table */}
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Profession</TableCell>
                <TableCell>Recommendation</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    {loading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      <Typography color="text.secondary">No submissions found.</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow 
                    key={sub.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'background.surface' },
                      transition: 'background-color 0.1s ease'
                    }}
                  >
                    <Typography component="th" scope="row" style={{ display: 'none' }} />
                    <TableCell sx={{ fontWeight: 600 }}>{sub.fullName}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>{sub.qualification}</TableCell>
                    <TableCell>{sub.experience} yrs</TableCell>
                    <TableCell>{sub.profession}</TableCell>
                    <TableCell>
                      <Chip 
                        label={sub.recommendation} 
                        size="small" 
                        color={getRecommendationChipColor(sub.recommendation)}
                        variant={sub.recommendation === 'Certification Program' ? 'outlined' : 'filled'}
                        sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: '4px' }}
                      />
                    </TableCell>
                    <TableCell color="text.secondary">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </TableContainer>
      </Container>
    </AnimatedPage>
  );
};

export default Submissions;
