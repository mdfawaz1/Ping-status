// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import OnlineIcon from '@mui/icons-material/CheckCircleOutline'; // Example icon
// import OfflineIcon from '@mui/icons-material/HighlightOff'; // Example icon

// export default function HoverBox({ onlineCount, offlineCount }) {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         position: 'absolute',
//         backgroundColor: 'white',
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         padding: '4px',
//         boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//         zIndex: 10,
//         transform: 'translate(-50%, -100%)',
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         <OnlineIcon color="success" />
//         <Typography>{onlineCount}</Typography>
//       </Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         <OfflineIcon color="error" />
//         <Typography>{offlineCount}</Typography>
//       </Box>
//     </Box>
//   );
// }
