"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetGerbangs,
  useCreateGerbang,
  useUpdateGerbang,
  useDeleteGerbang,
} from "@/services/use-highway-service";
import type { Gerbang } from "@/services/highway-service.types";

const gerbangSchema = z.object({
  id: z.number().min(1, "ID is required"),
  IdCabang: z.number().min(1, "ID Cabang is required"),
  NamaGerbang: z.string().min(1, "Nama Gerbang is required"),
  NamaCabang: z.string().min(1, "Nama Cabang is required"),
});

type GerbangFormValues = z.infer<typeof gerbangSchema>;

export default function MasterGerbangPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGerbang, setEditingGerbang] = useState<Gerbang | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [gerbangToDelete, setGerbangToDelete] = useState<Gerbang | null>(null);

  const { data: gerbangsData, isLoading } = useGetGerbangs({
    page: page + 1,
    limit: rowsPerPage,
    NamaGerbang: searchQuery || undefined,
  });

  const createMutation = useCreateGerbang();
  const updateMutation = useUpdateGerbang();
  const deleteMutation = useDeleteGerbang();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GerbangFormValues>({
    resolver: zodResolver(gerbangSchema),
    defaultValues: {
      id: 0,
      IdCabang: 0,
      NamaGerbang: "",
      NamaCabang: "",
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (gerbang?: Gerbang) => {
    if (gerbang) {
      setEditingGerbang(gerbang);
      reset({
        id: gerbang.id,
        IdCabang: gerbang.IdCabang,
        NamaGerbang: gerbang.NamaGerbang,
        NamaCabang: gerbang.NamaCabang,
      });
    } else {
      setEditingGerbang(null);
      reset({
        id: 0,
        IdCabang: 0,
        NamaGerbang: "",
        NamaCabang: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGerbang(null);
    reset();
  };

  const handleOpenDeleteConfirm = (gerbang: Gerbang) => {
    setGerbangToDelete(gerbang);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setGerbangToDelete(null);
  };

  const onSubmit = async (data: GerbangFormValues) => {
    try {
      if (editingGerbang) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving gerbang:", error);
    }
  };

  const handleDelete = async () => {
    if (gerbangToDelete) {
      try {
        await deleteMutation.mutateAsync({
          id: gerbangToDelete.id,
          IdCabang: gerbangToDelete.IdCabang,
        });
        handleCloseDeleteConfirm();
      } catch (error) {
        console.error("Error deleting gerbang:", error);
      }
    }
  };

  const rows = gerbangsData?.data?.rows?.rows || [];
  const totalCount = gerbangsData?.data?.count || 0;

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
        Master Gerbang
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <TextField
              placeholder="Search"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Gerbang
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>ID Cabang</TableCell>
                  <TableCell>Nama Gerbang</TableCell>
                  <TableCell>Nama Cabang</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((gerbang) => (
                    <TableRow key={`${gerbang.id}-${gerbang.IdCabang}`} hover>
                      <TableCell>{gerbang.id}</TableCell>
                      <TableCell>{gerbang.IdCabang}</TableCell>
                      <TableCell>{gerbang.NamaGerbang}</TableCell>
                      <TableCell>{gerbang.NamaCabang}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(gerbang)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(gerbang)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingGerbang ? "Edit Gerbang" : "Add New Gerbang"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID"
                    type="number"
                    fullWidth
                    error={!!errors.id}
                    helperText={errors.id?.message}
                    disabled={!!editingGerbang}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                )}
              />
              <Controller
                name="IdCabang"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID Cabang"
                    type="number"
                    fullWidth
                    error={!!errors.IdCabang}
                    helperText={errors.IdCabang?.message}
                    disabled={!!editingGerbang}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                )}
              />
              <Controller
                name="NamaGerbang"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nama Gerbang"
                    fullWidth
                    error={!!errors.NamaGerbang}
                    helperText={errors.NamaGerbang?.message}
                  />
                )}
              />
              <Controller
                name="NamaCabang"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nama Cabang"
                    fullWidth
                    error={!!errors.NamaCabang}
                    helperText={errors.NamaCabang?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
              sx={{
                bgcolor: "#5a6a85",
                "&:hover": { bgcolor: "#4a5a75" },
              }}
            >
              {editingGerbang ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete gerbang &quot;
            {gerbangToDelete?.NamaGerbang}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
