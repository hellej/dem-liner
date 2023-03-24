import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import styles from "./ThresholdSlider.module.css";

const Input = styled(MuiInput)`
  width: 42px;
  color: white;
`;

export const defaultThreshold = 5;
const min = 0;
const max = 30;

export const ThresholdSlider = (props: {
  threshold: number;
  setThreshold: (val: number) => void;
}) => {
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      props.setThreshold(newValue);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    if (typeof newValue === "number") {
      props.setThreshold(newValue);
    }
  };

  const handleBlur = () => {
    if (props.threshold < min) {
      props.setThreshold(min);
    } else if (props.threshold > max) {
      props.setThreshold(max);
    }
  };

  return (
    <div className={styles["slider-panel"]}>
      <Box sx={{ width: 250 }}>
        <Typography id="input-slider" gutterBottom>
          Elevation
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={props.threshold}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              min={0}
              max={30}
            />
          </Grid>
          <Grid item>
            <Input
              style={{ width: 55 }}
              value={props.threshold}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 0.1,
                min: 0,
                max: 30,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
