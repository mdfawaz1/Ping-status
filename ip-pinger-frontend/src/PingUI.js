import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
  Divider,
  ThemeProvider,
  createTheme,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize primary color
    },
    secondary: {
      main: '#dc004e', // Customize secondary color
    },
  },
});

const PingUI = () => {
  // Initialize IPs from localStorage
  const [ips, setIps] = useState(() => {
    const storedIps = localStorage.getItem('ips');
    return storedIps ? JSON.parse(storedIps) : [];
  });

  const [selectedIp, setSelectedIp] = useState('');
  const [newIp, setNewIp] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [inactiveIps, setInactiveIps] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pingResults, setPingResults] = useState({});

  // Save IPs to localStorage whenever the IP list changes
  useEffect(() => {
    localStorage.setItem('ips', JSON.stringify(ips));
  }, [ips]);

  const addIp = () => {
    if (newIp && !ips.includes(newIp)) {
      setIps([...ips, newIp]);
      setOpenSnackbar(true);
    }
    setNewIp('');
  };

  const removeIp = (ip) => {
    const updatedIps = ips.filter((item) => item !== ip);
    setIps(updatedIps);
    if (selectedIp === ip) {
      setSelectedIp('');
    }
  };

  const pingIps = async () => {
    let active = 0;
    let inactive = 0;
    let inactiveIpList = {};

    try {
      const response = await axios.get(`http://127.0.0.1:5000/ping`, {
        params: { ips: ips.join(',') },
      });
      const results = response.data;
      console.log("ress--->",results);
      setPingResults(results);

      for (const [ip, status] of Object.entries(results)) {
        if (status === 'active') {
          active++;
        } else {
          inactive++;
          inactiveIpList[ip] = status; // You can store additional info if needed
        }
      }
    } catch (error) {
      console.error('Error pinging IPs:', error);
    }
    console.log("--->active",active);
    setActiveCount(active);
    setInactiveCount(inactive);
    setInactiveIps(Object.keys(inactiveIpList));
  };

  useEffect(() => {
    if (ips.length > 0) {
      // Initial ping when IPs change or component mounts
      pingIps();

      // Set up interval to ping every 5 seconds
      const interval = setInterval(() => {
        pingIps();
      }, 10000);

      return () => clearInterval(interval);
    } else {
      // Clear ping results when there are no IPs
      setActiveCount(0);
      setInactiveCount(0);
      setInactiveIps([]);
      setPingResults({});
    }
  }, [ips]);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const uploadedIps = content.split('\n').map((line) => line.trim()).filter(Boolean);
        const uniqueIps = [...new Set([...ips, ...uploadedIps])]; // Merge and remove duplicates
        setIps(uniqueIps);
        setOpenSnackbar(true);
      };
      reader.readAsText(file);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 4,
          bgcolor: '#f0f8ff',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          IP Pinger
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <TextField
            label="Enter IP address"
            variant="outlined"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            sx={{ mr: 2, width: '300px' }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={addIp}
          >
            Add IP
          </Button>
          <input
            accept=".txt"
            style={{ display: 'none' }}
            id="upload-ip-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-ip-file">
            <Button variant="contained" component="span" sx={{ ml: 2 }}>
              Upload IPs
            </Button>
          </label>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Configured IPs
              </Typography>
              {ips.length > 0 ? (
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="select-ip-label">Select IP</InputLabel>
                    <Select
                      labelId="select-ip-label"
                      value={selectedIp}
                      label="Select IP"
                      onChange={(e) => setSelectedIp(e.target.value)}
                    >
                      {ips.map((ip, index) => (
                        <MenuItem key={index} value={ip}>
                          {ip}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedIp && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeIp(selectedIp)}
                      sx={{ mb: 2 }}
                    >
                      Remove Selected
                    </Button>
                  )}
                  <Divider sx={{ my: 2 }} />
                </Box>
              ) : (
                <Typography>No IPs configured. Please add an IP.</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Status Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    width: '45%',
                    bgcolor: '#e8f5e9',
                  }}
                >
                  <Typography variant="subtitle1">Active IPs</Typography>
                  <Typography variant="h4" color="success.main">
                    {activeCount}
                  </Typography>
                </Paper>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    width: '45%',
                    bgcolor: '#ffebee',
                  }}
                >
                  <Typography variant="subtitle1">Inactive IPs</Typography>
                  <Typography variant="h4" color="error.main">
                    {inactiveCount}
                  </Typography>
                </Paper>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Inactive IPs
              </Typography>
              {inactiveIps.length > 0 ? (
                <List>
                  {inactiveIps.map((ip, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={ip} />
                      <Chip label="Inactive" color="error" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No inactive IPs.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            IP added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default PingUI;