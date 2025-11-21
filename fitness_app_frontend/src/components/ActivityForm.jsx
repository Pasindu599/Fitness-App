import React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Activity added");
    try {
      console.log("Activity added");

      //   await addActivity(activity);
      onActivityAdded();
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };
  return (
    // <Box
    //   sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    //   component="form"
    //   onSubmit={handleSubmit}
    // >
    //   <TextField label="Activity Name" variant="outlined" />
    //   <TextField label="Activity Description" variant="outlined" />
    //   {/* Add type="submit" to make sure this triggers the form's onSubmit */}
    //   <Button type="submit" variant="contained" color="primary">
    //     Add Activity
    //   </Button>
    // </Box>
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Activity Type</InputLabel>
        <Select
          value={activity.type}
          onChange={(e) => setActivity({ ...activity, type: e.target.value })}
        >
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="CYCLING">Cycling</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Duration"
        type="number"
        value={activity.duration}
        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
      />
      <TextField
        label="Calories Burned"
        type="number"
        value={activity.caloriesBurned}
        onChange={(e) =>
          setActivity({ ...activity, caloriesBurned: e.target.value })
        }
      />
      {/* <TextField
        label="Additional Metrics"
        value={activity.additionalMetrics}
        onChange={(e) =>
          setActivity({ ...activity, additionalMetrics: e.target.value })
        }
      /> */}
      <Button type="submit" variant="contained" color="primary">
        Add Activity
      </Button>
    </Box>
  );
};

export default ActivityForm;
