import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../services/api";

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
  return (
    <div>
      <Grid container spacing={2}>
        {activities.map((activity) => (
          <Grid key={activity.id} xs={12} sm={6} md={4}>
            <Card onClick={() => navigation(`/activities/${activity.id}`)}>
              <CardContent>
                <Typography variant="h6">{activity.type}</Typography>
                <Typography variant="body1">
                  {activity.duration} minutes
                </Typography>
                <Typography variant="body1">
                  {activity.caloriesBurned} calories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ActivityList;
