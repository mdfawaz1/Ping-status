import { useState } from 'react';
import { Card, Box, Typography, Popover, IconButton, Button, Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OnlineIcon from '@mui/icons-material/Wifi';
import OfflineIcon from '@mui/icons-material/WifiOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function PinnedImageCard({ images, pins, devicesList, onEdit }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialogOpen, setActiveDialogOpen] = useState(false);

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
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    transform: 'scale(1.2)', // Slightly zoomed default size
    '&:hover': {
      transform: 'scale(1.2)', // Minor increase on hover for subtle effect
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)',
    },
  }}
>
<Typography 
  variant="h4"
  sx={{
    color: 'text.primary', // Color from the theme for readability
    fontWeight: '600',     // Moderate boldness
    fontSize: '2rem',      // Size for emphasis
    lineHeight: 1.4,       // Adjust line height for readability
    letterSpacing: '0.5px', // Letter spacing for clarity
    textTransform: 'capitalize', // Capitalizes the first letter of each word
    paddingLeft: 40,        // Adds space on the left for a cleaner layout
    marginBottom: 1.7,     // Space below for separation
    borderBottom: '2px solid', // Bottom border for subtle structure
    borderColor: 'divider', // Divider color for the border
    paddingBottom: 1,      // Padding below for the bottom border
    width: '100%',         // Ensures the Typography spans full width
  }}
>
  Network Insights
</Typography>



      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, width: '100%' }}>
        <IconButton onClick={handlePrevImage}>
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ mx: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
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
                  borderRadius: '10px',
                  border: currentImageIndex === index ? '3px solid #1976d2' : '3px solid #ccc',
                  mx: 0.5,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </Box>
        </Box>
        <IconButton onClick={handleNextImage}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box position="relative" sx={{ border: '3px solid #ccc', borderRadius: '12px', overflow: 'hidden', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Adds shadow to pins
    transform: 'translate(-50%, -100%)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#0d47a1',
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
      >
        {selectedPin && (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2">{selectedPin.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleActiveDevicesClick}>
                <OnlineIcon color="success" />
                <Typography variant="body2">
                  {selectedPin.devices.filter(deviceId => devicesList.find(d => d.id === deviceId)?.status === 'active').length}
                </Typography>
              </IconButton>
              <IconButton onClick={handleOfflineDevicesClick}>
                <OfflineIcon color="error" />
                <Typography variant="body2">
                  {selectedPin.devices.filter(deviceId => devicesList.find(d => d.id === deviceId)?.status === 'inactive').length}
                </Typography>
              </IconButton>
            </Box>
          </Box>
        )}
      </Popover>

      {/* Edit Button */}
      <Button 
  variant="contained"
  color="primary"
  sx={{ position: 'absolute', top: 85, right: 152 }} // Adjusted top and right values
  onClick={onEdit}
>
  Edit
</Button>


      {/* Dialog for showing offline devices */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Offline Devices</DialogTitle>
        <DialogContent>
          <Table>
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

      {/* Dialog for showing active devices */}
      <Dialog open={activeDialogOpen} onClose={handleActiveDialogClose}>
        <DialogTitle>Active Devices</DialogTitle>
        <DialogContent>
          <Table>
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
    </Card>
  );
}