import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getActivityDetail } from "../services/api";
import { Typography } from "@mui/material";
const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
    fetchActivity();
  }, [id]);

  if (!activity || !recommendation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h4">{activity.type}</Typography>
      <Typography variant="body1">{activity.duration} minutes</Typography>
      <Typography variant="body1">
        {activity.caloriesBurned} calories
      </Typography>
      <Typography variant="body1">{recommendation}</Typography>
    </div>
  );
};

export default ActivityDetail;
