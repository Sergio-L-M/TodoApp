import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  CircularProgress,
  ListItem,
  List,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMetrics } from "./MetricContext";

const Metrics: React.FC = () => {
  const { metrics, loading } = useMetrics();

  return (
    <Box sx={{ mt: 3, mb: 3, mx: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : metrics ? (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">General Metrics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Average Time</TableCell>
                  <TableCell>AVG TIME TO FINISH TASK BY PRIORITY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>{metrics.averageTime}</Typography>
                  </TableCell>
                  <TableCell>
                    <List>
                      <ListItem>
                        <Chip label="HIGH" variant="outlined" />
                        {metrics.averageTimeHigh}
                      </ListItem>
                      <ListItem>
                        <Chip label="MEDIUM" variant="outlined" />
                        {metrics.averageTimeMedium}
                      </ListItem>
                      <ListItem>
                        <Chip label="LOW" variant="outlined" />
                        {metrics.averageTimeLow}
                      </ListItem>
                    </List>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  );
};

export default Metrics;
