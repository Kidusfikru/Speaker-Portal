import React from "react";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";

const EventSearchToolbar: React.FC = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
  </GridToolbarContainer>
);

export default EventSearchToolbar;
