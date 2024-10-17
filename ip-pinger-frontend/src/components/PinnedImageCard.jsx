import React, { useState } from 'react';
import {
  Box, Card, Typography, Popover, IconButton, Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import { CheckCircle as OnlineIcon, Cancel as OfflineIcon } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
export default function PinnedImageCard({ image, pins, onEdit }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePinClick = (event, pin) => {
    setAnchorEl(event.currentTarget);
    setSelectedPin(pin);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPin(null);
  };

  const handleOfflineDevicesClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const open = Boolean(anchorEl);

  return (
    // <Card sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25rem' }}>
    <Card
  sx={{
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '55rem', // Ensure this is what you want
    overflow: '', // Ensure content does not overflow
    backgroundColor: '#fff', // Set a white background
    boxShadow: 3, // Adjust shadow level if needed
  }}
>
      <Box position="relative">

        <img src={image} alt="Pinned" style={{ maxWidth: '100%', maxHeight:'100%' ,objectFit: 'cover'}} />
        {pins.map((pin, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: pin.x,
              top: pin.y,
              backgroundColor: 'red',
              color: 'white',
              padding: '4px 8px', // Increased padding for better visibility
              borderRadius: '3px',
              fontSize: '12px',
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center', // Aligns icon and text vertically
            }}
            onClick={(event) => handlePinClick(event, pin)}
          >
  <LocationOnIcon fontSize="small" sx={{ marginRight: '4px', color: 'white' }} /> {/* Added margin to the icon */}
  <Typography variant="body2" sx={{ color: 'white' }}> {/* Ensured text is white */}
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
              <IconButton>
                <OnlineIcon color="success" />
                <Typography variant="body2">
                  {selectedPin.devices.filter(device => device.status === 'active').length}
                </Typography>
              </IconButton>
              <IconButton onClick={handleOfflineDevicesClick}>
                <OfflineIcon color="error" />
                <Typography variant="body2">
                  {selectedPin.devices.filter(device => device.status === 'inactive').length}
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
        sx={{ position: 'absolute', top: 16, right: 16 }}
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
              {selectedPin && selectedPin.devices.filter(device => device.status === 'inactive').map((device) => (
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