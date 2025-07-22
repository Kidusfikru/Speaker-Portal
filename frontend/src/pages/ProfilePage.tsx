import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "../api/profileApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface ProfileFormInputs {
  name: string;
  email: string;
  bio: string;
  contactInfo: string;
  avatar?: FileList;
}

const ProfilePage: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // Get current user from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("Current user:", user);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      contactInfo: "",
    },
  });
  // Prepopulate form fields when user is loaded/changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        bio: user.bio ?? "",
        contactInfo: user.contactInfo ?? "",
        avatar: undefined,
      });
      if (user.photoUrl) {
        setAvatarPreview(user.photoUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      if (e.target.files) {
        setValue("avatar", e.target.files);
      }
    }
  };

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("bio", data.bio);
      formData.append("contactInfo", data.contactInfo);
      if (data.avatar && data.avatar[0]) {
        formData.append("photo", data.avatar[0]);
      }
      await updateProfile(formData).unwrap();
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || err?.message || "Update failed",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={inputFileRef}
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outlined"
                  onClick={() => inputFileRef.current?.click()}
                  sx={{ mb: 1 }}
                >
                  Upload Avatar
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Bio"
                fullWidth
                margin="normal"
                multiline
                minRows={3}
                {...register("bio", { required: "Bio is required" })}
                error={!!errors.bio}
                helperText={errors.bio?.message}
              />
              <TextField
                label="Contact Info"
                fullWidth
                margin="normal"
                {...register("contactInfo", {
                  required: "Contact info is required",
                })}
                error={!!errors.contactInfo}
                helperText={errors.contactInfo?.message}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
