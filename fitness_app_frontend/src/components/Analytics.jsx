import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
// Using text/emoji icons instead of @mui/icons-material
const Icons = {
  TrendingUp: () => '📈',
  TrendingDown: () => '📉',
  DirectionsRun: () => '🏃',
  DirectionsBike: () => '🚴',
  FitnessCenter: () => '🏋️',
  LocalFireDepartment: () => '🔥',
  Timer: () => '⏱️',
  CalendarToday: () => '📅',
  EmojiEvents: () => '🏆'
};
import { getActivities } from '../services/api';

const Analytics = () => {
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalActivities: 0,
    totalCalories: 0,
    totalDuration: 0,
    averageCaloriesPerActivity: 0,
    averageDurationPerActivity: 0,
    activityBreakdown: {},
    weeklyData: [],
    achievements: []
  });

  useEffect(() => {
    fetchAndAnalyzeData();
  }, []);

  const fetchAndAnalyzeData = async () => {
    try {
      const activitiesData = await getActivities();
      setActivities(activitiesData);
      analyzeData(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const analyzeData = (activitiesData) => {
    const totalActivities = activitiesData.length;
    const totalCalories = activitiesData.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalDuration = activitiesData.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    
    // Activity breakdown
    const activityBreakdown = activitiesData.reduce((breakdown, activity) => {
      const type = activity.type || 'OTHER';
      if (!breakdown[type]) {
        breakdown[type] = { count: 0, calories: 0, duration: 0 };
      }
      breakdown[type].count += 1;
      breakdown[type].calories += activity.caloriesBurned || 0;
      breakdown[type].duration += activity.duration || 0;
      return breakdown;
    }, {});

    // Generate achievements
    const achievements = generateAchievements(totalActivities, totalCalories, totalDuration);

    setAnalytics({
      totalActivities,
      totalCalories,
      totalDuration,
      averageCaloriesPerActivity: totalActivities ? Math.round(totalCalories / totalActivities) : 0,
      averageDurationPerActivity: totalActivities ? Math.round(totalDuration / totalActivities) : 0,
      activityBreakdown,
      achievements
    });
  };

  const generateAchievements = (activities, calories, duration) => {
    const achievements = [];
    
    if (activities >= 1) achievements.push({ title: 'First Step', description: 'Completed your first activity!', icon: '🎯' });
    if (activities >= 5) achievements.push({ title: 'Getting Started', description: 'Completed 5 activities', icon: '🚀' });
    if (activities >= 10) achievements.push({ title: 'Committed', description: 'Completed 10 activities', icon: '💪' });
    if (calories >= 1000) achievements.push({ title: 'Calorie Crusher', description: 'Burned 1000+ calories', icon: '🔥' });
    if (duration >= 300) achievements.push({ title: 'Time Master', description: '300+ minutes of activity', icon: '⏰' });
    
    return achievements;
  };

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING':
        return <Typography sx={{ color: '#FF6B6B' }}>{Icons.DirectionsRun()}</Typography>;
      case 'CYCLING':
        return <Typography sx={{ color: '#4ECDC4' }}>{Icons.DirectionsBike()}</Typography>;
      default:
        return <Typography sx={{ color: '#45B7D1' }}>{Icons.FitnessCenter()}</Typography>;
    }
  };

  const StatCard = ({ title, value, unit, icon, color, trend, trendValue }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
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
          <Avatar sx={{ bgcolor: `${color}15`, color }}>
            {icon}
          </Avatar>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend === 'up' ? (
              <Typography sx={{ color: 'success.main', fontSize: 16 }}>{Icons.TrendingUp()}</Typography>
            ) : (
              <Typography sx={{ color: 'error.main', fontSize: 16 }}>{Icons.TrendingDown()}</Typography>
            )}
            <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'}>
              {trendValue}% vs last week
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const SimpleChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...Object.values(data).map(item => item.count));
    
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 2, p: 2 }}>
        {Object.entries(data).map(([type, info]) => (
          <Box key={type} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '100%',
                height: `${(info.count / maxValue) * 150}px`,
                bgcolor: type === 'RUNNING' ? '#FF6B6B' : type === 'CYCLING' ? '#4ECDC4' : '#45B7D1',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scaleY(1.05)'
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              {type}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {info.count}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Analytics Dashboard 📊
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track your progress and insights
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Activities"
            value={analytics.totalActivities}
            unit=""
            icon={<Typography>{Icons.FitnessCenter()}</Typography>}
            color="#45B7D1"
            trend="up"
            trendValue="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Calories"
            value={analytics.totalCalories}
            unit="cal"
            icon={<Typography>{Icons.LocalFireDepartment()}</Typography>}
            color="#FF6B6B"
            trend="up"
            trendValue="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Duration"
            value={analytics.totalDuration}
            unit="min"
            icon={<Typography>{Icons.Timer()}</Typography>}
            color="#4ECDC4"
            trend="up"
            trendValue="15"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg per Activity"
            value={analytics.averageCaloriesPerActivity}
            unit="cal"
            icon={<Typography>{Icons.TrendingUp()}</Typography>}
            color="#96CEB4"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Activity Breakdown Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Activity Breakdown
              </Typography>
              
              {Object.keys(analytics.activityBreakdown).length > 0 ? (
                <SimpleChart data={analytics.activityBreakdown} />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'textSecondary' }}>
                  <Typography sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}>
                    {Icons.FitnessCenter()}
                  </Typography>
                  <Typography variant="h6">No data available</Typography>
                  <Typography variant="body2">
                    Start adding activities to see your breakdown!
                  </Typography>
                </Box>
              )}
              
              {/* Activity Details */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  {Object.entries(analytics.activityBreakdown).map(([type, info]) => (
                    <Grid item xs={12} sm={4} key={type}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          {getActivityIcon(type)}
                          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                            {type}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {info.count} activities • {info.calories} cal • {info.duration} min
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Achievements 🏆
              </Typography>
              
              <List sx={{ p: 0 }}>
                {analytics.achievements.map((achievement, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="h4">{achievement.icon}</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.title}
                        secondary={achievement.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {index < analytics.achievements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                
                {analytics.achievements.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3, color: 'textSecondary' }}>
                    <Typography sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}>
                      {Icons.EmojiEvents()}
                    </Typography>
                    <Typography variant="body1">No achievements yet</Typography>
                    <Typography variant="body2">
                      Complete activities to unlock achievements!
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Insights
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {analytics.averageDurationPerActivity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg Duration (min)
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {Math.round(analytics.totalCalories / 7)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Daily Avg Calories
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {Object.keys(analytics.activityBreakdown).length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Activity Types
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {analytics.achievements.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Achievements
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
