import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import OnlineIcon from '@mui/icons-material/CheckCircleOutline'; // Example icon
import OfflineIcon from '@mui/icons-material/HighlightOff'; // Example icon

export default function DeviceStatusDialog({ open, onClose, onlineCount, offlineCount }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Device Status</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OnlineIcon color="success" />
            <Typography>{onlineCount} Online</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OfflineIcon color="error" />
            <Typography>{offlineCount} Offline</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
