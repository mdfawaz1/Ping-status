import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, List, ListItem, ListItemText, Checkbox, AppBar, Toolbar,
  Card, CardContent, IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CloudIcon from '@mui/icons-material/Cloud';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
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
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pins, setPins] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState({ x: 0, y: 0, name: '', devices: [] });
  const [step, setStep] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [devicesList, setDevicesList] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [inactiveIps, setInactiveIps] = useState([]);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [viewingStage, setViewingStage] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    const storedImages = JSON.parse(localStorage.getItem('storedImages') || '[]');
    const storedPins = JSON.parse(localStorage.getItem('pins') || '[]');
    const storedIps = JSON.parse(localStorage.getItem('ips') || '[]');

    setImages(storedImages);
    setPins(storedPins);
    
    const devicesWithId = storedIps.map((ip, index) => ({
      id: index + 1,
      ipAddress: ip,
      status: 'unknown',
    }));
    setDevicesList(devicesWithId);
    pingIps(devicesWithId);
  };

  const pingIps = async (devices) => {
    let activeCount = 0;
    let inactiveCount = 0;

    try {
      const response = await axios.get(`http://127.0.0.1:8080/ping`, {
        params: { ips: devices.map(device => device.ipAddress).join(',') },
      });

      const results = response.data;

      const updatedDevicesList = devices.map(device => {
        const status = results[device.ipAddress] || 'inactive';
        return { ...device, status };
      });

      setDevicesList(updatedDevicesList);

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
    const intervalId = setInterval(() => {
      pingIps(devicesList);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [devicesList]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const base64Image = await fileToBase64(file);
        const updatedImages = [...images, base64Image];
        setImages(updatedImages);
        localStorage.setItem('storedImages', JSON.stringify(updatedImages));
        setCurrentImageIndex(updatedImages.length - 1);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
    setIsDragging(false);
  };

  const handleClearImage = () => {
    const updatedImages = images.filter((_, index) => index !== currentImageIndex);
    setImages(updatedImages);
    localStorage.setItem('storedImages', JSON.stringify(updatedImages));
    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const base64Image = await fileToBase64(file);
        const updatedImages = [...images, base64Image];
        setImages(updatedImages);
        localStorage.setItem('storedImages', JSON.stringify(updatedImages));
        setCurrentImageIndex(updatedImages.length - 1);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
  };

  const handleClearPins = () => {
    const updatedPins = pins.filter(pin => pin.imageIndex !== currentImageIndex);
    setPins(updatedPins);
    localStorage.setItem('pins', JSON.stringify(updatedPins));
  };

  const handleImageClick = (e) => {
    if (isAddingPin) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPin({ x, y, name: '', devices: [], imageIndex: currentImageIndex });
    setSelectedDevices([]);
    setStep(1);
    setDialogOpen(true);
    setIsAddingPin(true);
  };

  const handlePinSave = () => {
    const updatedPins = [...pins, { ...currentPin, devices: selectedDevices }];
    setPins(updatedPins);
    localStorage.setItem('pins', JSON.stringify(updatedPins));
    setDialogOpen(false);
    setStep(1);
    setIsAddingPin(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setStep(1);
    setIsAddingPin(false);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleDeviceToggle = (deviceId) => {
    const currentIndex = selectedDevices.indexOf(deviceId);
    const newSelectedDevices = [...selectedDevices];

    if (currentIndex === -1) {
      newSelectedDevices.push(deviceId);
    } else {
      newSelectedDevices.splice(currentIndex, 1);
    }

    setSelectedDevices(newSelectedDevices);
  };

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  if (viewingStage) {
    return (
      <PinnedImageCard
        images={images}
        pins={pins}
        devicesList={devicesList}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <Box>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <CloudIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Network Insights
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/home"
            size="large"
          >
            Ping UI
          </Button>
          <Button
            color="inherit"
            startIcon={<CategoryIcon />}
            onClick={() => console.log('Open categories')}
            size="large"
          >
            Manage Categories
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
        <IconButton onClick={handlePrevImage} disabled={images.length <= 1}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2 }}>
          {images.length > 0 ? `Image ${currentImageIndex + 1} of ${images.length}` : 'No Images'}
        </Typography>
        <IconButton onClick={handleNextImage} disabled={images.length <= 1}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Card sx={{ maxWidth: 600, margin: 'auto' }}>
        <CardContent>
          <DropZone
            isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {images.length > 0 ? (
              <Box position="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  style={{ maxWidth: '100%', cursor: 'crosshair' }}
                  onClick={handleImageClick}
                />
                {pins
                  .filter(pin => pin.imageIndex === currentImageIndex)
                  .map((pin, index) => (
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
        </CardContent>
      </Card>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => document.getElementById('imageInput').click()}
          startIcon={<AddIcon />}
        >
          Add Image
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
          disabled={images.length === 0 || pins.length === 0}
        >
          Confirm
        </Button>
        <Button 
          variant="contained" 
          onClick={handleClearPins} 
          color="error"
          disabled={pins.filter(pin => pin.imageIndex === currentImageIndex).length === 0}
        >
          Clear Pins
        </Button>
        <Button 
          variant="contained" 
          onClick={handleClearImage} 
          color="error"
          disabled={images.length === 0}
        >
          Remove Image
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
                      checked={selectedDevices.includes(device.id)}
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