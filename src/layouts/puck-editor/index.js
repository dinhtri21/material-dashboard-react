import { Puck } from "@measured/puck";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Visibility, Close } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import Preview from "./components/Preview";
import "@measured/puck/puck.css";

export const config = {
  components: {
    DropdownBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "array", arrayFields: { value: { type: "text" } } },
        defaultValue: { type: "text" },
      },
      defaultProps: {
        label: "Dropdown Label",
        options: [{ value: "Option 1" }, { value: "Option 2" }, { value: "Option 3" }],
        defaultValue: "Option 1",
      },
      render: ({ label, options, defaultValue }) => (
        <FormControl fullWidth margin="dense">
          <FormLabel component="legend">{label}</FormLabel>
          <select defaultValue={defaultValue} style={{ height: "40px", width: "100%" }}>
            {options?.map((o, i) => (
              <option key={i} value={o.value} style={{ height: "40px" }}>
                {o.value}
              </option>
            ))}
          </select>
        </FormControl>
      ),
    },
    RadioBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "array", arrayFields: { value: { type: "text" } } },
        defaultValue: { type: "text" },
      },
      defaultProps: {
        label: "Radio Label",
        options: [{ value: "Choice 1" }, { value: "Choice 2" }, { value: "Choice 3" }],
        defaultValue: "Choice 1",
      },
      render: ({ label, options, defaultValue }) => (
        <FormControl component="fieldset" margin="dense" sx={{ px: "8px" }}>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup defaultValue={defaultValue}>
            {options?.map((o, i) => (
              <label key={i}>
                <input type="radio" name={label} value={o.value} style={{ marginRight: "8px" }} />
                {o.value}
              </label>
            ))}
          </RadioGroup>
        </FormControl>
      ),
    },
  },
};

export default function PuckEditor() {
  const [data, setData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} mt={2}>
        {/* Header với nút Preview */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h3>Puck Editor - Form Builder</h3>
          <MDButton
            variant="contained"
            color="info"
            startIcon={<Visibility />}
            onClick={handleOpenPreview}
          >
            Preview Form
          </MDButton>
        </MDBox>

        {/* Editor */}
        <div style={{ height: "700px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <Puck config={config} data={data} onChange={setData} />
        </div>

        {/* Preview Dialog */}
        <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="xl" fullWidth>
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            Preview
            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Preview data={data} />
          </DialogContent>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}
