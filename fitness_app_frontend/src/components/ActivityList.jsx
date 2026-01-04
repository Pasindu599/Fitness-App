import React from "react";
import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../services/api";
// Using text/emoji icons instead of @mui/icons-material
const Icons = {
  DirectionsRun: () => '🏃',
  DirectionsBike: () => '🚴',
  FitnessCenter: () => '🏋️',
  LocalFireDepartment: () => '🔥'
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const navigation = useNavigate();

  const fetchActivities = async () => {
    try {
      const activities = await getActivities();
      setActivities(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING':
        return <Typography sx={{ fontSize: 40, color: '#FF6B6B' }}>{Icons.DirectionsRun()}</Typography>;
      case 'CYCLING':
        return <Typography sx={{ fontSize: 40, color: '#4ECDC4' }}>{Icons.DirectionsBike()}</Typography>;
      default:
        return <Typography sx={{ fontSize: 40, color: '#45B7D1' }}>{Icons.FitnessCenter()}</Typography>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Today';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Recent Activities
      </Typography>
      <Grid container spacing={3}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card 
              onClick={() => navigation(`/activities/${activity.id}`)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                borderRadius: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {activity.type}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {formatDate(activity.date)}
                    </Typography>
                  </Box>
                  {getActivityIcon(activity.type)}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={`${activity.duration} min`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<Typography sx={{ color: '#FF6B6B !important' }}>{Icons.LocalFireDepartment()}</Typography>}
                    label={`${activity.caloriesBurned} cal`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>

                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: 4, 
                  bgcolor: 'rgba(255,255,255,0.3)' 
                }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {activities.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6, 
          bgcolor: 'grey.50', 
          borderRadius: 2,
          border: '2px dashed #e0e0e0'
        }}>
          <Typography sx={{ fontSize: 60, color: 'grey.400', mb: 2 }}>
            {Icons.FitnessCenter()}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            No activities yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start tracking your fitness journey!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActivityList;
