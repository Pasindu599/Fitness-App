import React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
  Paper
} from "@mui/material";
// Using text/emoji icons instead of @mui/icons-material
const Icons = {
  DirectionsRun: () => '🏃',
  DirectionsBike: () => '🚴',
  FitnessCenter: () => '🏋️',
  Timer: () => '⏱️',
  LocalFireDepartment: () => '🔥',
  Save: () => '💾',
  Clear: () => '🗑️'
};
import { useState } from "react";
import { addActivity } from "../services/api";
const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const activityTypes = [
    { value: 'RUNNING', label: 'Running', icon: <Typography>{Icons.DirectionsRun()}</Typography>, color: '#FF6B6B' },
    { value: 'CYCLING', label: 'Cycling', icon: <Typography>{Icons.DirectionsBike()}</Typography>, color: '#4ECDC4' },
    { value: 'WEIGHTLIFTING', label: 'Weight Lifting', icon: <Typography>{Icons.FitnessCenter()}</Typography>, color: '#45B7D1' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activity.type || !activity.duration || !activity.caloriesBurned) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await addActivity({
        ...activity,
        duration: parseInt(activity.duration),
        caloriesBurned: parseInt(activity.caloriesBurned)
      });
      
      setSnackbar({
        open: true,
        message: 'Activity added successfully!',
        severity: 'success'
      });
      
      // Reset form
      setActivity({
        type: "",
        duration: "",
        caloriesBurned: "",
        notes: "",
      });
      
      if (onActivityAdded) onActivityAdded();
    } catch (error) {
      console.error("Error adding activity:", error);
      setSnackbar({
        open: true,
        message: 'Failed to add activity. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActivity({
      type: "",
      duration: "",
      caloriesBurned: "",
      notes: "",
    });
  };

  const selectedActivityType = activityTypes.find(type => type.value === activity.type);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 60, 
            height: 60, 
            mx: 'auto', 
            mb: 2 
          }}>
            <Typography sx={{ fontSize: 30 }}>{Icons.FitnessCenter()}</Typography>
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Add New Activity
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your fitness progress by logging your activities
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Activity Type Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Activity Type
              </Typography>
              <Grid container spacing={2}>
                {activityTypes.map((type) => (
                  <Grid item xs={12} sm={4} key={type.value}>
                    <Card
                      onClick={() => setActivity({ ...activity, type: type.value })}
                      sx={{
                        cursor: 'pointer',
                        border: activity.type === type.value ? `2px solid ${type.color}` : '2px solid transparent',
                        bgcolor: activity.type === type.value ? `${type.color}10` : 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar sx={{ 
                          bgcolor: `${type.color}20`, 
                          color: type.color,
                          width: 50,
                          height: 50,
                          mx: 'auto',
                          mb: 1
                        }}>
                          {type.icon}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {type.label}
                        </Typography>
                        {activity.type === type.value && (
                          <Chip 
                            label="Selected" 
                            size="small" 
                            sx={{ 
                              mt: 1, 
                              bgcolor: type.color, 
                              color: 'white' 
                            }} 
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Activity Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="action.active">{Icons.Timer()}</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#FF6B6B' }}>{Icons.LocalFireDepartment()}</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">cal</InputAdornment>,
                }}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={3}
                value={activity.notes}
                onChange={(e) => setActivity({ ...activity, notes: e.target.value })}
                placeholder="Add any additional notes about your activity..."
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Typography>{Icons.Clear()}</Typography>}
                  onClick={handleReset}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Typography>{Icons.Save()}</Typography>}
                  disabled={loading || !activity.type || !activity.duration || !activity.caloriesBurned}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  {loading ? 'Adding...' : 'Add Activity'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Activity Preview */}
        {(activity.type || activity.duration || activity.caloriesBurned) && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Activity Preview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedActivityType && (
                <Avatar sx={{ bgcolor: `${selectedActivityType.color}20`, color: selectedActivityType.color }}>
                  {selectedActivityType.icon}
                </Avatar>
              )}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedActivityType?.label || 'Select Activity Type'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {activity.duration && `${activity.duration} minutes`}
                  {activity.duration && activity.caloriesBurned && ' • '}
                  {activity.caloriesBurned && `${activity.caloriesBurned} calories`}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityForm;
