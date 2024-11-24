import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  CircularProgress,
  ListItem,
  ListItemText,
  List,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const Metrics: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [metrics, setMetrics] = useState<{
    averageTime: string;
    averageTimeHigh: string;
    averageTimeMedium: string;
    averageTimeLow: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:9090/todos/metrics/pending");
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [refresh]);

  return (
    <Box sx={{ mt: 3, mb: 3, mx: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : metrics ? (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">General Metrics</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Table>
                    <TableHead>
                        <TableCell>Average Time</TableCell>
                        <TableCell>AVG TIME TO FINISH TASK BY PRIORITY</TableCell>
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
        </>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  );
};

export default Metrics;
