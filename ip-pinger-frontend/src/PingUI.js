import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Box,
  CardMedia,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  useMediaQuery,
  LinearProgress,
  Avatar,
  Switch,
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Cloud as CloudIcon,
  UploadFile as UploadFileIcon,
  CameraAlt as CameraAltIcon,
  Videocam as VideocamIcon,
  NetworkCheck as NetworkCheckIcon,
  Sensors as SensorsIcon,
  Build as BuildIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const lightTheme = createTheme({
  palette: {
    primary: { main: '#6e67f4' },
    secondary: { main: '#ff5252' },
    background: { default: '#f3f0ff', paper: '#ffffff' },
    text: { primary: '#000' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.05em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '12px',
          '&:hover': { backgroundColor: '#5c56d3' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#bb86fc' },
    secondary: { main: '#03dac6' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#fff' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.05em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
});

// Map icon names to actual icon components
const iconMap = {
  CameraAltIcon: <VideocamIcon />,
  NetworkCheckIcon: <NetworkCheckIcon />,
  SensorsIcon: <SensorsIcon />,
  BuildIcon: <BuildIcon />,
  CodeIcon: <CodeIcon />,
  BugReportIcon: <BugReportIcon />,
  CategoryIcon: <CategoryIcon />,
};

const availableIcons = [
  { label: 'Camera', value: 'CameraAltIcon' },
  { label: 'Network', value: 'NetworkCheckIcon' },
  { label: 'Sensors', value: 'SensorsIcon' },
  { label: 'Build', value: 'BuildIcon' },
  { label: 'Code', value: 'CodeIcon' },
  { label: 'Bug', value: 'BugReportIcon' },
  { label: 'Category', value: 'CategoryIcon' },
];

const PingUI = () => {
  const defaultCategories = [
    { name: 'Production', icon: 'BuildIcon' },
    { name: 'Development', icon: 'CodeIcon' },
    { name: 'Testing', icon: 'BugReportIcon' },
  ];

  const [ips, setIps] = useState(() => {
    const storedIpData = localStorage.getItem('myAppIpData');
    return storedIpData ? JSON.parse(storedIpData) : [];
  });

  const [categories, setCategories] = useState(() => {
    const storedCustomCategories = localStorage.getItem('myAppCustomCategories');
    return storedCustomCategories ? JSON.parse(storedCustomCategories) : defaultCategories;
  });

  const [offlineTracking, setOfflineTracking] = useState(() => {
    const storedTracking = localStorage.getItem('myAppOfflineTracking');
    return storedTracking ? JSON.parse(storedTracking) : {};
  });

  const [selectedIp, setSelectedIp] = useState('');
  const [newIp, setNewIp] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [inactiveIps, setInactiveIps] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [pingResults, setPingResults] = useState({});
  const [uptimeStats, setUptimeStats] = useState({});
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
      const storedThemePreference = localStorage.getItem('darkMode');
      return storedThemePreference ? JSON.parse(storedThemePreference) : false;
    });

  const isMobile = useMediaQuery(lightTheme.breakpoints.down('sm'));
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('myAppIpData', JSON.stringify(ips));
    localStorage.setItem('ips', JSON.stringify(ips.map(ip => ip.address)));
    localStorage.setItem('myAppCustomCategories', JSON.stringify(categories));
    localStorage.setItem('myAppOfflineTracking', JSON.stringify(offlineTracking));
  }, [ips, categories, offlineTracking]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const addIp = () => {
    if (!newIp) {
      showSnackbar('Please enter an IP address', 'error');
      return;
    }

    if (ips.some(ip => ip.address === newIp)) {
      showSnackbar('IP already exists', 'warning');
      return;
    }

    let categoryForIp = selectedCategory || 'Others';

    if (categoryForIp === 'Others' && !categories.some(cat => cat.name === 'Others')) {
      setCategories([...categories, { name: 'Others', icon: 'CategoryIcon' }]);
    }

    setIps([...ips, { address: newIp, category: categoryForIp }]);
    showSnackbar('IP added successfully');
    setNewIp('');
  };

  const removeIp = (ipToRemove) => {
    const updatedIps = ips.filter((ip) => ip.address !== ipToRemove);
    setIps(updatedIps);
    setOfflineTracking(prevTracking => {
      const newTracking = { ...prevTracking };
      delete newTracking[ipToRemove];
      return newTracking;
    });

    if (selectedIp === ipToRemove) {
      setSelectedIp('');
    }

    showSnackbar('IP removed successfully');
  };

  const addCategory = () => {
    if (!newCategory) {
      showSnackbar('Please enter a category name', 'error');
      return;
    }

    if (!newCategoryIcon) {
      showSnackbar('Please select an icon for the category', 'error');
      return;
    }

    if (categories.some(category => category.name === newCategory)) {
      showSnackbar('Category already exists', 'warning');
      return;
    }

    setCategories([...categories, { name: newCategory, icon: newCategoryIcon }]);
    setNewCategory('');
    setNewCategoryIcon('');
    showSnackbar('Category added successfully');
  };

  const removeCategory = (categoryName) => {
    if (ips.some(ip => ip.category === categoryName)) {
      showSnackbar('Category is in use and cannot be removed', 'error');
      return;
    }

    setCategories(categories.filter(c => c.name !== categoryName));
    showSnackbar('Category removed successfully');
  };

  const getFilteredIps = () => {
    if (filterCategory === 'all') return ips;
    if (filterCategory === 'active') return ips.filter(ip => pingResults[ip.address] === 'active');
    if (filterCategory === 'inactive') return ips.filter(ip => pingResults[ip.address] === 'inactive');
    return ips.filter(ip => ip.category === filterCategory);
  };

  const formatOfflineTime = (startTime) => {
    const now = Date.now();
    const diff = now - startTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const updateOfflineTracking = (ip, isActive) => {
    setOfflineTracking(prevTracking => {
      const newTracking = { ...prevTracking };
      if (!isActive && !newTracking[ip]) {
        newTracking[ip] = Date.now();
      } else if (isActive && newTracking[ip]) {
        delete newTracking[ip];
      }
      return newTracking;
    });
  };

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(category => {
      const categoryIps = ips.filter(ip => ip.category === category.name);
      const activeIps = categoryIps.filter(ip => pingResults[ip.address] === 'active');
      stats[category.name] = {
        total: categoryIps.length,
        active: activeIps.length,
        inactive: categoryIps.length - activeIps.length,
        icon: category.icon,
      };
    });
    return stats;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:22000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.name);
          setUserLogo(data.logo);
        } else {
          console.error('Error fetching user data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateUptimeStats = (ip, isActive) => {
    setUptimeStats(prevStats => {
      const currentUptime = prevStats[ip] || 100;
      let newUptime = currentUptime;

      if (isActive) {
        newUptime = Math.min(100, currentUptime + 0.5);
      } else {
        newUptime = Math.max(0, currentUptime - 1);
      }

      return { ...prevStats, [ip]: newUptime };
    });
  };

  const pingIps = async () => {
    let active = 0;
    let inactive = 0;
    let inactiveIpList = [];

    if (ips.length === 0) {
      setActiveCount(0);
      setInactiveCount(0);
      setInactiveIps([]);
      setPingResults({});
      setOfflineTracking({});
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/ping`, {
        params: { ips: ips.map(ip => ip.address).join(',') },
      });
      const results = response.data;
      console.log("Res", results);
      setPingResults(results);

      for (const [ip, status] of Object.entries(results)) {
        const isActive = status === 'active';
        updateOfflineTracking(ip, isActive);
        updateUptimeStats(ip, isActive);

        if (isActive) {
          active++;
        } else {
          inactive++;
          inactiveIpList.push(ip);
        }
      }
    } catch (error) {
      console.error('Error pinging IPs:', error);
      showSnackbar('Error pinging IPs', 'error');
    }

    setActiveCount(active);
    setInactiveCount(inactive);
    setInactiveIps(inactiveIpList);
  };

  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User Name');
  const [userLogo, setUserLogo] = useState(localStorage.getItem('userLogo') || 'https://via.placeholder.com/100');
  const [newName, setNewName] = useState(userName);
  const [newLogo, setNewLogo] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedLogo = localStorage.getItem('userLogo');
    if (storedName) {
      setUserName(storedName);
      setNewName(storedName);
    }
    if (storedLogo) {
      setUserLogo(storedLogo);
    }
  }, []);

  const handleConfirmUpdate = async () => {
    setUserName(newName);

    if (newLogo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setUserLogo(base64Image);
        localStorage.setItem('userLogo', base64Image);
      };

      reader.readAsDataURL(newLogo);
    }

    localStorage.setItem('userName', newName);
    setEditMode(false);
  };

  const handleCancelUpdate = () => {
    setEditMode(false);
  };

  useEffect(() => {
    if (ips.length > 0) {
      pingIps();
      const interval = setInterval(pingIps, 20000);
      return () => clearInterval(interval);
    } else {
      setActiveCount(0);
      setInactiveCount(0);
      setInactiveIps([]);
      setPingResults({});
      setOfflineTracking({});
    }
  }, [ips]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const uploadedIps = content.split('\n').map((line) => line.trim()).filter(Boolean);
        const newIps = uploadedIps.filter(ip => !ips.some(existingIp => existingIp.address === ip));

        let categoryForUpload = selectedCategory || 'Others';

        if (categoryForUpload === 'Others' && !categories.some((cat) => cat.name === 'Others')) {
          setCategories([...categories, { name: 'Others', icon: 'CategoryIcon' }]);
        }

        setIps(prevIps => [
          ...prevIps,
          ...newIps.map(ip => ({ address: ip, category: categoryForUpload }))
        ]);
        showSnackbar('IPs uploaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const categoryStats = getCategoryStats();

  const getProgressColor = (uptime) => {
    if (uptime >= 90) return "#4CAF50";
    if (uptime >= 75) return "#FFEB3B";
    return "#F44336";
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            {/* <CloudIcon sx={{ mr: 2 }} /> */}
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Network Insights
            </Typography>
            {/* <Button
              color="inherit"
              component={RouterLink}
              to="/home"
              size="large"
              sx={{ mx: 2, fontWeight: 500 }}
            >
              Ping UI
            </Button> */}
            <Button
              color="inherit"
              component={RouterLink}
              to="/image-dropzone"
              size="large"
              sx={{ mx: 2, fontWeight: 500 }}
            >
Aerial view
            </Button>
            <Button
              color="inherit"
              startIcon={<CategoryIcon />}
              onClick={() => setOpenCategoryDialog(true)}
              size="large"
              sx={{ mx: 2, fontWeight: 500 }}
            >
              Manage Categories
            </Button>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <IconButton onClick={handleProfileClick} sx={{ color: 'white' }}>
              <Avatar src={userLogo} alt={userName} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Card sx={{ minWidth: 250, maxWidth: 300, padding: 2 }}>
            <CardMedia
              component="img"
              alt="User Logo"
              height="80"
              image={userLogo || 'https://via.placeholder.com/100'}
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                margin: '0 auto',
                objectFit: 'cover'
              }}
            />

            <CardContent>
              <Typography variant="h6" align="center">
                {userName || 'User Name'}
              </Typography>

              {editMode ? (
                <>
                  <TextField
                    label="Update Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewLogo(e.target.files[0])}
                    style={{ margin: '10px 0' }}
                  />

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button onClick={handleConfirmUpdate} color="primary" variant="contained">
                      Confirm
                    </Button>
                    <Button onClick={handleCancelUpdate} color="secondary" variant="outlined">
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="contained"
                    sx={{
                      backgroundColor: '#E6E6FA',
                      color: '#4B0082',
                      '&:hover': {
                        backgroundColor: '#D8BFD8',
                      },
                    }}
                  >
                    Update Profile
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="secondary"
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Menu>

        <Container maxWidth={false} sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', borderRadius: '16px' }}>
                <TextField
                  label="Enter IP address"
                  variant="outlined"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  sx={{ flexGrow: 1, minWidth: '250px' }}
                />
                <FormControl sx={{ minWidth: '200px' }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">Others</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {iconMap[category.icon]}
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={addIp}
                  size="large"
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
                  <Button variant="outlined" component="span" startIcon={<UploadFileIcon />} size="large">
                    Upload IPs
                  </Button>
                </label>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Monitored IPs
                    </Typography>
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Filter by</InputLabel>
                      <Select
                        value={filterCategory}
                        label="Filter by"
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <MenuItem value="all">All IPs</MenuItem>
                        <MenuItem value="active">Active IPs</MenuItem>
                        <MenuItem value="inactive">Inactive IPs</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.name} value={category.name}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {iconMap[category.icon]}
                              {category.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {getFilteredIps().length > 0 ? (
                    <List>
                      {getFilteredIps().map((ip) => {
                        const ipCategory = categories.find(cat => cat.name === ip.category);
                        const uptime = uptimeStats[ip.address] || 100;
                        return (
                          <ListItem
                            key={ip.address}
                            sx={{ mb: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                  {ip.address}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  {ipCategory && (
                                    <Chip
                                      size="medium"
                                      icon={iconMap[ipCategory.icon]}
                                      label={ipCategory.name}
                                      sx={{ mr: 1, fontSize: '0.875rem' }}
                                    />
                                  )}
                                  {offlineTracking[ip.address] && (
                                    <Tooltip title="Offline duration">
                                      <Chip
                                        size="medium"
                                        icon={<AccessTimeIcon />}
                                        label={formatOfflineTime(offlineTracking[ip.address])}
                                        color="warning"
                                        sx={{ mr: 1, fontSize: '0.875rem' }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Tooltip title={`Uptime: ${uptime.toFixed(1)}%`}>
                                <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                                  <svg viewBox="0 0 100 100" width="60" height="60">
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke="#e0e0e0"
                                      strokeWidth="8"
                                    />
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke={getProgressColor(uptime)}
                                      strokeWidth="8"
                                      strokeLinecap="round"
                                      strokeDasharray={`${2 * Math.PI * 45}`}
                                      strokeDashoffset={2 * Math.PI * 45 * (1 - uptime / 100)}
                                      transform="rotate(-90 50 50)"
                                    />
                                  </svg>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {uptime.toFixed(0)}%
                                  </Typography>
                                </Box>
                              </Tooltip>
                              <Box sx={{ width: 80 }}>
                                <Chip
                                  label={
                                    pingResults[ip.address] === 'active'
                                      ? 'Active'
                                      : pingResults[ip.address] === 'inactive'
                                        ? 'Inactive'
                                        : 'Unknown'
                                  }
                                  color={
                                    pingResults[ip.address] === 'active'
                                      ? 'success'
                                      : pingResults[ip.address] === 'inactive'
                                        ? 'error'
                                        : 'default'
                                  }
                                  sx={{ fontSize: '0.875rem', width: '100%' }}
                                />
                              </Box>
                              <IconButton edge="end" onClick={() => removeIp(ip.address)} color="error" size="large">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary" variant="h6">
                        No IPs configured for this category.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Overall Status
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', borderRadius: '12px' }}>
                            <Typography color="success.contrastText" variant="h3" align="center">
                              {activeCount}
                            </Typography>
                            <Typography color="success.contrastText" variant="h6" align="center">
                              Active Devices
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'error.light', borderRadius: '12px' }}>
                            <Typography color="error.contrastText" variant="h3" align="center">
                              {inactiveCount}
                            </Typography>
                            <Typography color="error.contrastText" variant="h6" align="center">
                              Inactive Devices
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Category Statistics
                      </Typography>
                      {Object.entries(categoryStats).map(([category, stats]) => (
                        <Box key={category} sx={{ mb: 3, last: { mb: 0 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {iconMap[stats.icon]}
                              {category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total: {stats.total}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(stats.active / stats.total) * 100}
                              sx={{
                                flexGrow: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'error.light',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 'success.main',
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="success.main">
                              Active: {stats.active}
                            </Typography>
                            <Typography variant="body2" color="error.main">
                              Inactive: {stats.inactive}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Icon</InputLabel>
              <Select
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                label="Icon"
              >
                {availableIcons.map((icon) => (
                  <MenuItem key={icon.value} value={icon.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {iconMap[icon.value]}
                      {icon.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={addCategory}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Category
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>Existing Categories</Typography>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.name}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeCategory(category.name)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {iconMap[category.icon]}
                      {category.name}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default PingUI;