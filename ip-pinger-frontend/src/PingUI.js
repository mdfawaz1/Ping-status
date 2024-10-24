import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom'; 
import WarningIcon from '@mui/icons-material/Warning';
import CloudIcon from '@mui/icons-material/Cloud';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SensorsIcon from '@mui/icons-material/Sensors';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
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
  // Add more icons as needed
};

const availableIcons = [
  { label: 'Camera', value: 'CameraAltIcon' },
  { label: 'Network', value: 'NetworkCheckIcon' },
  { label: 'Sensors', value: 'SensorsIcon' },
  { label: 'Build', value: 'BuildIcon' },
  { label: 'Code', value: 'CodeIcon' },
  { label: 'Bug', value: 'BugReportIcon' },
  { label: 'Category', value: 'CategoryIcon' },
  // Add more icons as needed
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
  

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Use unique keys for localStorage to prevent conflicts
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send the token in the headers
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // Clear user data from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Clear the token to end session
// Assuming you have user state in your component or context

      // Redirect to login screen
      navigate('/login', { replace: true }); 
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, display an error message to the user
    }
  };

  const handleProfileUpdate = () => {
    setUserName(newName); // Update the displayed name
    if (newLogo) {
      const logoURL = URL.createObjectURL(newLogo); // Create URL for the image
      setUserLogo(logoURL); // Update the displayed logo
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
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
      console.log("Res",results);
      setPingResults(results);

      for (const [ip, status] of Object.entries(results)) {
        const isActive = status === 'active';
        updateOfflineTracking(ip, isActive);
        
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
  const [newName, setNewName] = useState(userName); // State to update the name
  const [newLogo, setNewLogo] = useState(null);
  
  useEffect(() => {
    // If there is a user name or logo in localStorage, set it when the component mounts
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
    // Update the user profile logic here (e.g., set userName and userLogo)
    setUserName(newName);
  
    if (newLogo) {
      // Convert the image file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result; // Get the base64 string
  
        setUserLogo(base64Image); // Set the logo in state
        localStorage.setItem('userLogo', base64Image); // Save the base64 logo in localStorage
      };
  
      reader.readAsDataURL(newLogo); // Read file as base64
    }
  
    // Save the new name in localStorage
    localStorage.setItem('userName', newName);
  
    setEditMode(false); // Switch back to view mode
  };
  
  const handleCancelUpdate = () => {
    setEditMode(false); // Cancel update and revert to view mode
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

        // Check if 'Others' category exists, if not, add it
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <CloudIcon sx={{ mr: 2 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          IP Status Monitor
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/home"
          size="large"
          sx={{ mx: 2 }} // Adding horizontal margin for spacing
        >
          Ping UI
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/image-dropzone"
          size="large"
          sx={{ mx: 2 }} // Adding horizontal margin for spacing
        >
          Image Drop Zone
        </Button>
        <Button
          color="inherit"
          startIcon={<CategoryIcon />}
          onClick={() => setOpenCategoryDialog(true)} // Keep the original functionality
          size="large"
          sx={{ mx: 2 }} // Adding horizontal margin for spacing
        >
          Manage Categories
        </Button>
        <PersonIcon 
          onClick={handleProfileClick}
          sx={{ cursor: 'pointer', color: 'white', mx: 2 }} // Add spacing and cursor pointer
          fontSize="large" // Adjust the icon size
        />
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
<Card sx={{ minWidth: 250, maxWidth: 300, padding: 2 }}>
  {/* User Logo (fallback if no logo is uploaded) */}
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
    {/* Display User Name */}
    <Typography variant="h6" align="center">
      {userName || 'User Name'}
    </Typography>

    {/* If editMode is true, show input fields for updating the profile */}
    {editMode ? (
      <>
        {/* Input to update the user name */}
        <TextField
          label="Update Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newName}
          onChange={(e) => setNewName(e.target.value)} // Update new name state
        />

        {/* Input to upload a new logo */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewLogo(e.target.files[0])} // Update new logo state
          style={{ margin: '10px 0' }} // Space between input fields
        />

        {/* Confirm and Cancel buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handleConfirmUpdate} color="primary" size="small">
            Confirm
          </Button>
          <Button onClick={handleCancelUpdate} color="secondary" size="small">
            Cancel
          </Button>
        </Box>
      </>
    ) : (
      /* If not in edit mode, show the Update Profile and Logout buttons */
      <Box display="flex" justifyContent="space-between" mt={2}>
 <Button
    onClick={() => setEditMode(true)}
    size="small"
    sx={{
      backgroundColor: '#E6E6FA', // Light purple
      color: '#4B0082', // Darker purple for text
      borderRadius: '12px', // Add border radius
      padding: '8px 16px', // Add padding for better spacing
      '&:hover': {
        backgroundColor: '#D8BFD8', // Lighter purple on hover
        color: '#4B0082', // Keep text color on hover
      },
      transition: 'background-color 0.3s ease', // Smooth transition
      marginRight: '8px', // Add spacing between buttons
    }}
  >
    Update Profile
  </Button>
  
  {/* Logout button */}
  <Button
    onClick={handleLogout}
    size="small"
    sx={{
      backgroundColor: '#FF0000', // Dark red
      color: '#FFFFFF', // White text
      borderRadius: '12px', // Add border radius
      padding: '8px 16px', // Add padding for better spacing
      '&:hover': {
        backgroundColor: '#8B0000', // Lighter red on hover
        color: '#FFFFFF', // Keep text color on hover
      },
      transition: 'background-color 0.3s ease', // Smooth transition
    }}
  >
    Logout
  </Button>
      </Box>
    )}
  </CardContent>
</Card>

      </Menu>
    </AppBar>
        <Container maxWidth={false} sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
              <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Monitored IPs
                  </Typography>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                      value={filterCategory}
                      label="Filter by Category"
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
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
                      return (
                        <ListItem
                          key={ip.address}
                          sx={{ mb: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}
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
                                    sx={{ mr: 1, fontSize: '1rem' }}
                                  />
                                )}
                                {offlineTracking[ip.address] && (
                                  <Tooltip title="Offline duration">
                                    <Chip
                                      size="medium"
                                      icon={<AccessTimeIcon />}
                                      label={formatOfflineTime(offlineTracking[ip.address])}
                                      color="warning"
                                      
                                      sx={{ mr: 1, fontSize: '1rem' }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={pingResults[ip.address] === 'active' ? 'Active' 
                              : pingResults[ip.address] === 'inactive' ? 'Inactive' : 'Unknown'}
                              color={pingResults[ip.address] === 'active' ? 'success'
                              : pingResults[ip.address] === 'inactive' ? 'error' : 'default'}
                              sx={{ fontSize: '1rem' }}
                            />
                            <IconButton
                              edge="end"
                              onClick={() => removeIp(ip.address)}
                              color="error"
                              size="large"
                            >
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
              </Paper>
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
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                            <Typography color="success.contrastText" variant="h3" align="center">
                              {activeCount}
                            </Typography>
                            <Typography color="success.contrastText" variant="h6" align="center">
                              Active Devices
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
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
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
      Category Statistics
    </Typography>
    <Grid container spacing={2}>
      {categories.map((category) => (
        <Grid item xs={12} key={category.name}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              {/* Category Name */}
              <Grid item xs>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {category.name}
                </Typography>
                {/* Adjust the spacing between the name and the total */}
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Total: {categoryStats[category.name].total}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    size="medium"
                    label={`Active: ${categoryStats[category.name].active}`}
                    color="success"
                    sx={{ fontSize: '1rem' }}
                  />
                  <Chip
                    size="medium"
                    label={`Inactive: ${categoryStats[category.name].inactive}`}
                    color="error"
                    sx={{ fontSize: '1rem' }}
                  />
                </Box>
              </Grid>
              {/* Icon placed on the right side outside the category box */}
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 1 }}>
                  {React.cloneElement(iconMap[category.icon], { sx: { fontSize: '5rem', ml: 2 } })}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </CardContent>
</Card>

                </Grid>
                {inactiveIps.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WarningIcon color="warning" />
                          Offline Devices
                        </Typography>
                        <List>
                          {inactiveIps.map((ip) => (
                            <ListItem key={ip} sx={{ px: 0 }}>
                              <ListItemText
                                primary={<Typography variant="h6">{ip}</Typography>}
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" color="action" />
                                    <Typography variant="body1">
                                      Offline since: {formatOfflineTime(offlineTracking[ip] || Date.now())}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog 
        open={openCategoryDialog} 
        onClose={() => setOpenCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Icon</InputLabel>
              <Select
                value={newCategoryIcon}
                label="Icon"
                onChange={(e) => setNewCategoryIcon(e.target.value)}
              >
                {availableIcons.map((iconOption) => (
                  <MenuItem key={iconOption.value} value={iconOption.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {iconMap[iconOption.value]}
                      {iconOption.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={addCategory}
              startIcon={<AddCircleIcon />}
              size="large"
            >
              Add Category
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.name}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeCategory(category.name)}
                    disabled={ips.some(ip => ip.category === category.name)}
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {iconMap[category.icon]}
                      <Typography variant="h6">{category.name}</Typography>
                    </Box>
                  }
                  secondary={ips.some(ip => ip.category === category.name) ? 'In use' : 'Not in use'}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)} size="large">Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default PingUI;