import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Checkbox
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import PinnedImageCard from './PinnedImageCard';

const DropZone = styled(Box)(({ theme, isDragging }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
}));

const Pin = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'red',
  color: 'white',
  padding: '2px 4px',
  borderRadius: '3px',
  fontSize: '12px',
  transform: 'translate(-50%, -100%)',
  cursor: 'pointer',
}));

export default function ImageDropZone() {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pins, setPins] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState({ x: 0, y: 0, name: '', devices: [] });
  const [step, setStep] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [devicesList, setDevicesList] = useState([]); // Store devices with deviceID and status
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [inactiveIps, setInactiveIps] = useState([]);
  const [isAddingPin, setIsAddingPin] = useState(false); // For tracking if you're adding a pin
  const [viewingStage, setViewingStage] = useState(false);
  // useEffect(() => {
  //   // Load stored data from localStorage
  //   const storedImage = localStorage.getItem('image');
  //   const storedPins = localStorage.getItem('pins');
  //   const storedDevices = localStorage.getItem('devices');

  //   if (storedImage) setImage(storedImage);
  //   if (storedPins) setPins(JSON.parse(storedPins));
  //   if (storedDevices) setDevicesList(JSON.parse(storedDevices));

  //   pingIps();
  // }, []);

  useEffect(() => {
    // Load stored IPs and assign deviceId to each
    const storedIps = localStorage.getItem('ips');
    if (storedIps) {
      const parsedIps = JSON.parse(storedIps);
      const devicesWithId = parsedIps.map((ip, index) => ({
        id: index + 1, // Unique deviceId
        ipAddress: ip,
        status: 'unknown',
      }));
      setDevicesList(devicesWithId);
    }
    pingIps();
  }, []);    const pingIps = async () => {
    let activeCount = 0;
    let inactiveCount = 0;

    try {
        const response = await axios.get(`http://127.0.0.1:5000/ping`, {
            params: { ips: devicesList.map(device => device.ipAddress).join(',') },
        });

        console.log("Ping results: ", response.data);

        const results = response.data;

        // Update the devices list with statuses
        const updatedDevicesList = devicesList.map(device => {
            const status = results[device.ipAddress] || 'inactive'; // Default to inactive if not found
            return { ...device, status }; // Update only the status
        });

        setDevicesList(updatedDevicesList); // Update the state with new devices list

        // Count active and inactive devices
        activeCount = updatedDevicesList.filter(device => device.status === 'active').length;
        inactiveCount = updatedDevicesList.length - activeCount;

        setActiveCount(activeCount);
        setInactiveCount(inactiveCount);
        setInactiveIps(updatedDevicesList.filter(device => device.status === 'inactive').map(device => device.ipAddress));

    } catch (error) {
        console.error('Error pinging IPs:', error);
    }
};

useEffect(() => {
    pingIps(); // Call once when the component mounts

    const intervalId = setInterval(pingIps, 15000); // Set interval to call pingIps every 15 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
}, [devicesList]); // Add devicesList as a dependency if it changes


  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = (e) => {
    if (isAddingPin) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPin({ x, y, name: '', devices: [] });
    setSelectedDevices([]);
    setStep(1);
    setDialogOpen(true);
    setIsAddingPin(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setStep(1);
    setIsAddingPin(false);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePinSave = () => {
    setPins([...pins, { ...currentPin, devices: selectedDevices }]);
    setDialogOpen(false);
    setStep(1);
    setIsAddingPin(false);
  };

  const handleDeviceToggle = (deviceId) => {
    const currentIndex = selectedDevices.indexOf(deviceId);
    let newSelectedDevices = [...selectedDevices];
  
    if (currentIndex === -1) {
      // If the deviceId is not already in the selectedDevices array, add it
      newSelectedDevices.push(deviceId);
    } else {
      // If the deviceId is already selected, remove it from the array
      newSelectedDevices.splice(currentIndex, 1);
    }
  
    setSelectedDevices(newSelectedDevices);
  };
  // 
  const editPin = (pin, e) => {
    e.stopPropagation();
    setCurrentPin(pin);
    setSelectedDevices(pin.devices);
    setStep(2);
    setDialogOpen(true);
    setIsAddingPin(true);
  };

  const handleConfirm = () => {
    setViewingStage(true);
  };

  const handleEdit = () => {
    setViewingStage(false);
  };
  if (viewingStage) {
    return (
      <PinnedImageCard
        image={image}
        pins={pins.map(pin => ({
          ...pin,
          devices: pin.devices.map(deviceId => 
            devicesList.find(device => device.id === deviceId)
          ).filter(Boolean)
        }))}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <Box>
      <DropZone
        isDragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {image ? (
          <Box position="relative">
            <img
              src={image}
              alt="Dropped"
              style={{ maxWidth: '100%', cursor: 'crosshair' }}
              onClick={handleImageClick}
            />
            {pins.map((pin, index) => (
              <Pin
                key={index}
                style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
                onClick={(e) => editPin(pin, e)}
              >
                {pin.name}
              </Pin>
            ))}
          </Box>
        ) : (
          <Typography>Drag & Drop an image or click to upload</Typography>
        )}
      </DropZone>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => document.getElementById('imageInput').click()}
        >
          Upload Image
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        {step === 1 ? (
          <>
            <DialogTitle>Add Building Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Building Name"
                fullWidth
                value={currentPin.name}
                onChange={(e) => setCurrentPin({ ...currentPin, name: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleNextStep} variant="contained" color="primary">
                Next
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Select Devices</DialogTitle>
            <DialogContent>
            <List>
  {devicesList.map((device) => (
    <ListItem key={device.id} button onClick={() => handleDeviceToggle(device.id)}>
      <Checkbox
        checked={selectedDevices.includes(device.id)} // Check if the deviceId is selected
        tabIndex={-1}
      />
      <ListItemText primary={`${device.ipAddress} (${device.status})`} />
    </ListItem>
  ))}
</List>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handlePinSave} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
