import { useState } from 'react'; 
import { Card, Box, Typography, Popover, IconButton, Button, Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OnlineIcon from '@mui/icons-material/Wifi';
import OfflineIcon from '@mui/icons-material/WifiOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

export default function PinnedImageCard({ images, imageNames, pins, devicesList, onEdit }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialogOpen, setActiveDialogOpen] = useState(false);

  // Existing handlers remain the same
  const handleActiveDevicesClick = () => setActiveDialogOpen(true);
  const handleActiveDialogClose = () => setActiveDialogOpen(false);
  const handlePinClick = (event, pin) => {
    setAnchorEl(event.currentTarget);
    setSelectedPin(pin);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPin(null);
  };
  const handleOfflineDevicesClick = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const open = Boolean(anchorEl);

  const dialogStyle = {
    '& .MuiDialog-paper': {
      backgroundColor: '#1a1a1a',
      color: '#fff',
      minWidth: '600px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  };

  const tableStyles = {
    '& .MuiTableCell-head': {
      backgroundColor: '#2d2d2d',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.95rem',
      borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
    },
    '& .MuiTableCell-body': {
      color: '#e0e0e0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)'
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50rem',
        padding: '20px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        borderRadius: '24px',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transform: 'scale(1.2)',
        '&:hover': {
          transform: 'scale(1.2)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <Typography 
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: '700',
          fontSize: '2.2rem',
          lineHeight: 1.4,
          letterSpacing: '0.5px',
          textTransform: 'capitalize',
          paddingLeft: 30,
          marginBottom: 2,
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 1,
          width: '100%',
          background: 'linear-gradient(90deg, #fff, #a0aec0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Network Insights
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, width: '100%' }}>
        <IconButton 
          onClick={handlePrevImage} 
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ mx: 3, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#fff',
              fontSize: '1.1rem',
              opacity: 0.9
            }}
          >
            Buildings {currentImageIndex + 1} of {images.length}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: 120,
                  height: 120,
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  border: currentImageIndex === index ? '3px solid #3182ce' : '3px solid rgba(255, 255, 255, 0.1)',
                  mx: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  },
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </Box>
          <Typography  
  variant="h6" // Retain heading style for the text
  sx={{
    color: '#fff', // Keep the white color
    fontSize: '1.25rem', // Slightly increase the font size for better readability
    fontWeight: '600', // Use a semi-bold font for emphasis
    mt: 3, // Reduce the top margin
    mb: -4, // Reduce the bottom margin for less spacing below the text
    letterSpacing: '0.02em', // Slight letter spacing for a cleaner look
    textTransform: 'capitalize', // Capitalize the first letter of each word
  }}
>
  {imageNames[currentImageIndex] || 'Unnamed'}
</Typography>

        </Box>
        <IconButton 
          onClick={handleNextImage} 
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box position="relative" sx={{ 
        border: '3px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}>
        <img src={images[currentImageIndex]} alt="Pinned" style={{ maxWidth: '110%', maxHeight: '110%', objectFit: 'cover' }} />
        {pins
          .filter(pin => pin.imageIndex === currentImageIndex)
          .map((pin, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: pin.x,
                top: pin.y,
                backgroundColor: 'rgba(49, 130, 206, 0.9)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(49, 130, 206, 1)',
                  transform: 'translate(-50%, -100%) scale(1.05)',
                },
              }}
              onClick={(event) => handlePinClick(event, pin)}
            >
              <LocationOnIcon fontSize="small" sx={{ color: 'white', marginRight: '4px' }} />
              <Typography variant="body2">
                {pin.name}
              </Typography>
            </Box>
          ))}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            padding: '12px',
          }
        }}
      >
        {selectedPin && (
          <Box sx={{ p: 2, minWidth: '200px' }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1.1rem' }}>
              {selectedPin.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                  }
                }}
                onClick={handleActiveDevicesClick}
              >
                <OnlineIcon sx={{ color: '#2ecc71' }} />
                <Typography sx={{ color: '#2ecc71', fontWeight: '600' }}>
                  {selectedPin.devices.filter(deviceId => devicesList.find(d => d.id === deviceId)?.status === 'active').length}
                  <Typography component="span" sx={{ fontSize: '0.8rem', ml: 1, opacity: 0.8 }}>
                    Online
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                  }
                }}
                onClick={handleOfflineDevicesClick}
              >
                <OfflineIcon sx={{ color: '#e74c3c' }} />
                <Typography sx={{ color: '#e74c3c', fontWeight: '600' }}>
                  {selectedPin.devices.filter(deviceId => devicesList.find(d => d.id === deviceId)?.status === 'inactive').length}
                  <Typography component="span" sx={{ fontSize: '0.8rem', ml: 1, opacity: 0.8 }}>
                    Offline
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Popover>

            <Button 
  variant="contained"
  component={RouterLink}
  to="/home"
  size="large"
  sx={{
    position: 'absolute',
    top: 85,
    right: 232,
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '8px',
    padding: '7.3px 22px',
    textTransform: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#2c5282',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(49, 130, 206, 0.4)',
    },
    mx: 2,
  }}
>
  Home
</Button>

            
      <Button 
        variant="contained"
        sx={{
          position: 'absolute',
          top: 85,
          right: 152,
          backgroundColor: '#3182ce',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 24px',
          textTransform: 'none',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#2c5282',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(49, 130, 206, 0.4)',
          }
        }}
        onClick={onEdit}
      >
        Edit
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose} sx={dialogStyle}>
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#2d2d2d',
          color: '#fff'
        }}>
          Offline Devices
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1a1a1a' }}>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Device Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Last Offline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedPin && selectedPin.devices
                .map(deviceId => devicesList.find(d => d.id === deviceId))
                .filter(device => device && device.status === 'inactive')
                .map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.ipAddress}</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialogOpen} onClose={handleActiveDialogClose} sx={dialogStyle}>
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#2d2d2d',
          color: '#fff'
        }}>
          Active Devices
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1a1a1a' }}>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Device Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Last Active</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {selectedPin && selectedPin.devices
                .map(deviceId => devicesList.find(d => d.id === deviceId))
                .filter(device => device && device.status === 'active')
                .map((device) => (
                  <TableRow 
                    key={device.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ 
                      color: '#e0e0e0',
                      fontWeight: '500'
                    }}>
                      {device.id}
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#e0e0e0',
                      fontFamily: 'monospace'
                    }}>
                      {device.ipAddress}
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#2ecc71',
                      fontWeight: '500'
                    }}>
                      {device.lastActive || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Card>
  );
}