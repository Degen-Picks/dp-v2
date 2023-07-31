import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";

const theme1 = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

const theme2 = createTheme({
  palette: {
    primary: {
      main: "#E0E0E0",
    },
  },
});

const CircularProgressWithLabel = (props) => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          marginX: "auto",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            size={60}
            theme={theme1}
            {...props}
            sx={{ position: "absolute", zIndex: 2 }}
            thickness={2.5}
          />
          <CircularProgress
            variant="determinate"
            size={60}
            theme={theme2}
            value={100}
            sx={{ position: "absolute", zIndex: 1 }}
            thickness={2.5}
          />
        </Box>
        <p className="text-lg flex items-center justify-center text-center">
          {`${Math.round(props.value)}%`}
        </p>
      </Box>
      <Box sx={{ textAlign: "center", paddingTop: "20px" }}>
        <p className="font-base text-lg text-secondary">{props.team}</p>
      </Box>
    </>
  );
};

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default CircularProgressWithLabel;
