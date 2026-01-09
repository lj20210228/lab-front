import React from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    Grid,
    Paper,
} from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {useStateContext} from "../context/ContextProvider.jsx";

export  function UserHome() {
    const { user } = useStateContext();

    const stats = [
        {
            label: "Sačuvani radovi",
            value: "24",
            Icon: BookmarkIcon,
            color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            change: "+4",
        },
        {
            label: "Pregledani radovi",
            value: "67",
            Icon: DescriptionIcon,
            color: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
            change: "+12",
        },
        {
            label: "Praćeni projekti",
            value: "8",
            Icon: FolderIcon,
            color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            change: "+1",
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Dobrodošli, {user?.firstName}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Pregled vaše aktivnosti u ResearchHub sistemu
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => {
                    const Icon = stat.Icon;

                    return (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    transition: "box-shadow 0.3s",
                                    "&:hover": { boxShadow: 4 },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                {stat.label}
                                            </Typography>

                                            <Typography variant="h3" fontWeight={700} gutterBottom>
                                                {stat.value}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <TrendingUpIcon
                                                    fontSize="small"
                                                    color="success"
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="success.main"
                                                    fontWeight={500}
                                                >
                                                    {stat.change}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                background: stat.color,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Icon sx={{ color: "white" }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Paper
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: "primary.light",
                    background:
                        "linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)",
                }}
            >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Dobrodošli u ResearchHub
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    ResearchHub sistem za upravljanje istraživanjima omogućava
                    pregled naučnih radova, projekata i laboratorijske opreme.
                    Vaša trenutna uloga:{" "}
                    <strong style={{ textTransform: "capitalize" }}>
                        {user?.role}
                    </strong>
                </Typography>
            </Paper>
        </Box>
    );
}
