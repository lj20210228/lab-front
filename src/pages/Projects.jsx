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
    CircularProgress,
    InputLabel,
    Select,
    FormControl,
    Checkbox,
    ListItemText,
    OutlinedInput
} from '@mui/material';
import axiosClient from '../axiosClient.js';

const statusOptions = [
    { value: 'planned', label: 'Planiran' },
    { value: 'active', label: 'Aktivan' },
    { value: 'completed', label: 'Završen' },
];

const categoryOptions = ['IT', 'Medicine', 'Biology', 'Physics', 'Chemistry', 'Data Science', 'Engineering'];

export function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [users, setUsers] = useState([]);

    const [errors, setErrors] = useState({});
    const getStatusColor = (status) => {
        switch (status) {
            case 'planned': return 'warning';   // Žuta/Narandžasta
            case 'active': return 'success';    // Zelena
            case 'completed': return 'primary'; // Plava
            default: return 'default';
        }
    };

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        budget: '',
        category: '',
        status: 'active',
        start_date: '',
        end_date: '',
        document: null,
        members: []
    });

    useEffect(() => {
        axiosClient.get('/users')
            .then(({ data }) => {
                const userData = data.users || (Array.isArray(data) ? data : []);
                setUsers(userData);
            })
            .catch(err => {
                console.error("Fetch users failed:", err);
                setUsers([]);
            });
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/projects');
            const projectsWithMembers = data.data.map(p => ({
                ...p,
                members: p.members || []
            }));
            setProjects(projectsWithMembers);
        } catch (err) {
            console.error("Fetch projects failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenDialog = (project = null) => {
        setErrors({});
        setEditingProject(project);
        if (project) {
            setFormData({
                title: project.title || '',
                code: project.code || '',
                description: project.description || '',
                budget: project.budget || '',
                category: project.category || '',
                status: project.status || 'active',
                start_date: project.start_date || '',
                end_date: project.end_date || '',
                document: null,
                members: project.members ? project.members.map(m => m.id) : []
            });
        } else {
            setFormData({
                title: '',
                code: '',
                description: '',
                budget: '',
                category: '',
                status: 'active',
                start_date: '',
                end_date: '',
                document: null,
                members: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
        setErrors({});
    };

    const handleSave = async () => {
        setErrors({});
        try {
            const payload = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'members') {
                    formData.members.forEach(id => payload.append('members[]', id));
                } else if (key === 'document') {
                    if (formData[key]) payload.append(key, formData[key]);
                } else {
                    payload.append(key, formData[key] === null ? '' : formData[key]);
                }
            });

            if (editingProject) {
                payload.append('_method', 'PUT');
                await axiosClient.post(`/projects/${editingProject.id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axiosClient.post('/projects', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            fetchProjects();
            handleCloseDialog();
        } catch (err) {
            if (err.response && (err.response.status === 422 || err.response.status === 400)) {
                setErrors(err.response.data);
            } else {
                console.error("Save project failed:", err);
                alert('Greška na serveru.');
            }
        }
    };

    const calculateProgress = (start, end) => {
        if (!start) return 0;
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
        <Box sx={{ p: { xs: 2, md: 4 } }} >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">Projekti</Typography>
                <Button variant="contained" size="large" onClick={() => handleOpenDialog()}>+ Novi Projekat</Button>
            </Box>

            {loading ? (
                <Box textAlign="center" py={10}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3} width={1400}   >
                    {projects.map(project => (
                        <Grid item xs={12}  key={project.id}>
                            <Card sx={{
                                width: 1400,
                                maxWidth: 1400,
                                mx: 'auto',
                                minHeight: 380,
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 3,
                                borderRadius: 3,
                                transition: '0.3s',
                                '&:hover': { boxShadow: 6 },
                            }}>
                                <CardContent  sx={{
                                    p: 4,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}  >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h5" color="primary" fontWeight="bold">
                                            {project.title}
                                            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                                                #{project.code}
                                            </Typography>
                                        </Typography>
                                        <Chip
                                            label={statusOptions.find(s => s.value === project.status)?.label || project.status}
                                            color={getStatusColor(project.status)}
                                            variant="filled"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        {project.description || 'Nema opisa.'}
                                    </Typography>

                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="subtitle2" color="text.secondary">Kategorija</Typography>
                                            <Chip label={project.category} size="small" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="subtitle2" color="text.secondary">Budžet</Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {project.budget ? `${Number(project.budget).toLocaleString()} €` : 'Nije definisan'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="subtitle2" color="text.secondary">Vremenski okvir</Typography>
                                            <Typography variant="caption">📅 {project.start_date} — {project.end_date || 'Nema roka'}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Box  mt="auto"
                                          display="flex"
                                          justifyContent="space-between"
                                          alignItems="center">
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2">Realizacija</Typography>
                                            <Typography variant="body2" fontWeight="bold">{calculateProgress(project.start_date, project.end_date)}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={calculateProgress(project.start_date, project.end_date)}
                                            sx={{ height: 8, borderRadius: 5 }}
                                        />
                                    </Box>

                                    <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            {project.members?.map(m => <Chip key={m.id} label={m.name} size="small" />)}
                                        </Box>
                                        <Button variant="contained" color="inherit" onClick={() => handleOpenDialog(project)}>Uredi</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>{editingProject ? 'Izmena Projekta' : 'Novi Projekat'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField fullWidth label="Naslov" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} error={!!errors.title} helperText={errors.title?.[0]} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField fullWidth label="Šifra" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} error={!!errors.code} helperText={errors.code?.[0]} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Opis" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Grid>

                        {/* 4. KATEGORIJA SADA ZAUZIMA CELU ŠIRINU (xs=12) */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select value={formData.category} label="Kategorija" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    {categoryOptions.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField fullWidth label="Budžet" type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField select fullWidth label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField type="date" fullWidth label="Početak" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} error={!!errors.start_date} helperText={errors.start_date?.[0]} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField type="date" fullWidth label="Kraj" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Članovi tima</InputLabel>
                                <Select multiple value={formData.members} onChange={(e) => setFormData({ ...formData, members: e.target.value })} input={<OutlinedInput label="Članovi tima" />} renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => <Chip key={id} label={users.find(u => u.id === id)?.name || id} size="small" />)}
                                    </Box>
                                )}>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            <Checkbox checked={formData.members.indexOf(user.id) > -1} />
                                            <ListItemText primary={user.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSave} variant="contained" size="large">Sačuvaj Projekat</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
