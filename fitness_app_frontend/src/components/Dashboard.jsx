import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
// Using text/emoji icons instead of @mui/icons-material
const Icons = {
  DirectionsRun: () => '🏃',
  DirectionsBike: () => '🚴',
  FitnessCenter: () => '🏋️',
  LocalFireDepartment: () => '🔥',
  Timer: () => '⏱️',
  TrendingUp: () => '📈',
  CalendarToday: () => '📅',
  Add: () => '➕',
  MoreVert: () => '⋮'
};
import { getActivities } from '../services/api';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalCalories: 0,
    totalDuration: 0,
    weeklyGoal: 300, // minutes
    calorieGoal: 2000
  });
  const theme = useTheme();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const activitiesData = await getActivities();
      setActivities(activitiesData);
      calculateStats(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const calculateStats = (activitiesData) => {
    const totalCalories = activitiesData.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalDuration = activitiesData.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    
    setStats(prev => ({
      ...prev,
      totalActivities: activitiesData.length,
      totalCalories,
      totalDuration
    }));
  };

  const getActivityIcon = (type, size = 24) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING':
        return <Typography sx={{ fontSize: size, color: '#FF6B6B' }}>{Icons.DirectionsRun()}</Typography>;
      case 'CYCLING':
        return <Typography sx={{ fontSize: size, color: '#4ECDC4' }}>{Icons.DirectionsBike()}</Typography>;
      default:
        return <Typography sx={{ fontSize: size, color: '#45B7D1' }}>{Icons.FitnessCenter()}</Typography>;
    }
  };

  const StatCard = ({ title, value, unit, icon, color, progress, goal }) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${alpha(color, 0.15)}`
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
              <Typography component="span" variant="h6" sx={{ color: 'textSecondary', ml: 0.5 }}>
                {unit}
              </Typography>
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color }}>
            {icon}
          </Avatar>
        </Box>
        
        {progress !== undefined && goal && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {Math.round((value / goal) * 100)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((value / goal) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const RecentActivityCard = ({ activity }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2, 
      borderRadius: 2,
      bgcolor: alpha(theme.palette.primary.main, 0.02),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      mb: 1,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        transform: 'translateX(4px)'
      }
    }}>
      <Avatar sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.1), 
        color: theme.palette.primary.main,
        mr: 2
      }}>
        {getActivityIcon(activity.type)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {activity.type}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {activity.duration} min • {activity.caloriesBurned} calories
        </Typography>
      </Box>
      <Chip 
        label="View"
        size="small"
        variant="outlined"
        sx={{ 
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back! 💪
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's your fitness overview for today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Activities"
            value={stats.totalActivities}
            unit=""
            icon={<Typography>{Icons.FitnessCenter()}</Typography>}
            color="#45B7D1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Calories Burned"
            value={stats.totalCalories}
            unit="cal"
            icon={<Typography>{Icons.LocalFireDepartment()}</Typography>}
            color="#FF6B6B"
            progress={stats.totalCalories}
            goal={stats.calorieGoal}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Duration"
            value={stats.totalDuration}
            unit="min"
            icon={<Typography>{Icons.Timer()}</Typography>}
            color="#4ECDC4"
            progress={stats.totalDuration}
            goal={stats.weeklyGoal}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Week"
            value={Math.round(stats.totalDuration / 7)}
            unit="min/day"
            icon={<Typography>{Icons.TrendingUp()}</Typography>}
            color="#96CEB4"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                <Button
                  startIcon={<Typography>{Icons.Add()}</Typography>}
                  variant="contained"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Add Activity
                </Button>
              </Box>
              
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {activities.slice(0, 5).map((activity, index) => (
                  <RecentActivityCard key={activity.id || index} activity={activity} />
                ))}
                
                {activities.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'textSecondary'
                  }}>
                    <Typography sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}>
                      {Icons.FitnessCenter()}
                    </Typography>
                    <Typography variant="h6">No activities yet</Typography>
                    <Typography variant="body2">
                      Start your fitness journey by adding your first activity!
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Goals */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Actions */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Typography>{Icons.DirectionsRun()}</Typography>}
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Log Running Activity
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Typography>{Icons.DirectionsBike()}</Typography>}
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Log Cycling Activity
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Typography>{Icons.FitnessCenter()}</Typography>}
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Custom Activity
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Weekly Goal
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {Math.round((stats.totalDuration / stats.weeklyGoal) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {stats.totalDuration} of {stats.weeklyGoal} minutes
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((stats.totalDuration / stats.weeklyGoal) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mb: 2
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    Keep going! You're doing great! 🎯
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
