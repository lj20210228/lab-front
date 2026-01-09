import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress
} from '@mui/material';
import axiosClient from '../axiosClient.js';

const statusOptions = [
    { value: 'active', label: 'Aktivan' },
    { value: 'completed', label: 'Završen' },
    { value: 'pending', label: 'Na čekanju' },
];

export function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active',
        start_date: '',
        end_date: '',
    });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/projects');
            setProjects(data.data);
        } catch (err) {
            console.error("Fetch projects failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'completed': return 'primary';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Aktivan';
            case 'completed': return 'Završen';
            case 'pending': return 'Na čekanju';
            default: return status;
        }
    };

    const handleOpenDialog = (project = null) => {
        setEditingProject(project);
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                status: project.status,
                start_date: project.start_date,
                end_date: project.end_date || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'active',
                start_date: '',
                end_date: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
    };

    const handleSave = async () => {
        try {
            if (editingProject) {
                await axiosClient.put(`/projects/${editingProject.id}`, formData);
            } else {
                await axiosClient.post('/projects', formData);
            }
            fetchProjects();
            handleCloseDialog();
        } catch (err) {
            console.error("Save project failed:", err);
        }
    };

    const calculateProgress = (start, end) => {
        const today = new Date();
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        if (today >= endDate) return 100;
        if (today <= startDate) return 0;
        const total = endDate.getTime() - startDate.getTime();
        const elapsed = today.getTime() - startDate.getTime();
        return Math.round((elapsed / total) * 100);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Projekti</Typography>
                <Button variant="contained" onClick={() => handleOpenDialog()}>Dodaj projekat</Button>
            </Box>

            {loading ? (
                <Box textAlign="center" py={4}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3}>
                    {projects.map(project => (
                        <Grid item xs={12} md={6} key={project.id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                        <Typography variant="h6">{project.title}</Typography>
                                        <Chip label={getStatusLabel(project.status)} size="small" color={getStatusColor(project.status)} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {project.description}
                                    </Typography>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Početak: {project.start_date} {project.end_date && `• Kraj: ${project.end_date}`}
                                    </Typography>
                                    {project.status === 'active' && (
                                        <Box mt={2}>
                                            <Typography variant="caption" gutterBottom>Napredak projekta</Typography>
                                            <LinearProgress variant="determinate" value={calculateProgress(project.start_date, project.end_date)} />
                                        </Box>
                                    )}
                                    <Button size="small" sx={{ mt: 1 }} onClick={() => handleOpenDialog(project)}>Edit</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog za dodavanje/izmenu */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingProject ? 'Izmeni projekat' : 'Dodaj projekat'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Naslov"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Opis"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        margin="normal"
                    >
                        {statusOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="date"
                        fullWidth
                        label="Početak"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        fullWidth
                        label="Kraj"
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSave} variant="contained">Sačuvaj</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
