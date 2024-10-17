import { useState } from 'react';
import { Card, Box, Typography, Popover, IconButton, Button, Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OnlineIcon from '@mui/icons-material/Wifi';
import OfflineIcon from '@mui/icons-material/WifiOff';

export default function PinnedImageCard({ image, pins, onEdit }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialogOpen, setActiveDialogOpen] = useState(false); // State for active devices dialog

  const handleActiveDevicesClick = () => {
    setActiveDialogOpen(true); // Open active devices dialog
  };

  const handleActiveDialogClose = () => setActiveDialogOpen(false); // Handle close for active devices

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
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '55rem',
        backgroundColor: '#fff',
        boxShadow: 3,
      }}
    >
      <Box position="relative">
        <img src={image} alt="Pinned" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        {pins.map((pin, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: pin.x,
              top: pin.y,
              backgroundColor: 'red',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '12px',
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={(event) => handlePinClick(event, pin)}
          >
            <LocationOnIcon fontSize="small" sx={{ marginRight: '4px', color: 'white' }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
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
              <IconButton onClick={handleActiveDevicesClick}> {/* Trigger active devices dialog */}
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
              {selectedPin && selectedPin.devices.filter(device => device.status === 'active').map((device) => (
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
