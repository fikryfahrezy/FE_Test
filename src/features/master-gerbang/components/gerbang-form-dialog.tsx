"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gerbangSchema, type GerbangFormValues } from "../schemas";

type GerbangFormDialogProps = {
  open: boolean;
  defaultValues: GerbangFormValues | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: GerbangFormValues) => Promise<void>;
};

export function GerbangFormDialog({
  open,
  defaultValues,
  isSubmitting,
  onClose,
  onSubmit,
}: GerbangFormDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GerbangFormValues>({
    resolver: zodResolver(gerbangSchema),
    defaultValues: defaultValues || {
      id: 0,
      IdCabang: 0,
      NamaGerbang: "",
      NamaCabang: "",
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      key={
        defaultValues
          ? `edit-${defaultValues.id}-${defaultValues.IdCabang}`
          : "create"
      }
    >
      <DialogTitle>
        {defaultValues ? "Edit Gerbang" : "Add New Gerbang"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Controller
                name="id"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="ID"
                      type="number"
                      fullWidth
                      error={!!errors.id}
                      helperText={errors.id?.message}
                      disabled={!!defaultValues}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        field.onChange(parseInt(nextValue, 10) || 0);
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="IdCabang"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="ID Cabang"
                      type="number"
                      fullWidth
                      error={!!errors.IdCabang}
                      helperText={errors.IdCabang?.message}
                      disabled={!!defaultValues}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        field.onChange(parseInt(nextValue, 10) || 0);
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="NamaGerbang"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Nama Gerbang"
                      fullWidth
                      error={!!errors.NamaGerbang}
                      helperText={errors.NamaGerbang?.message}
                    />
                  );
                }}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="NamaCabang"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Nama Cabang"
                      fullWidth
                      error={!!errors.NamaCabang}
                      helperText={errors.NamaCabang?.message}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {defaultValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
