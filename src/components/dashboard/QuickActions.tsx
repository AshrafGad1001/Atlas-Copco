
"use client";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function QuickActions() {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <Button component={Link} href="/admin/companies?new=1" variant="contained" color="primary" startIcon={<AddIcon />}>????? ????</Button>
      <Button component={Link} href="/admin/users?new=1" variant="contained" color="secondary" startIcon={<AddIcon />}>????? ?????</Button>
      <Button component={Link} href="/admin/visits" variant="outlined" startIcon={<ListAltIcon />}>?? ????????</Button>
      <Button component={Link} href="/admin/companies" variant="outlined" startIcon={<UploadFileIcon />}>??????? ?????</Button>
    </Box>
  );
}
