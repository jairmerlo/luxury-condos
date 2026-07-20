import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Neighborhood } from "../../interfaces/buildings";

interface UiState {
  isMenuOpen: boolean;
  allBuildingNames: string[];
  neighborhoods: Neighborhood[];
  nameSelected: string;
  neighborhoodSelected: string;
  typeOfView: "list" | "map";
}

const initialState: UiState = {
  isMenuOpen: false,
  allBuildingNames: [],
  neighborhoods: [],
  nameSelected: "",
  neighborhoodSelected: "",
  typeOfView: "list",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMenuOpen: (state, { payload }: { payload: boolean }) => {
      state.isMenuOpen = payload;
    },
    setBuildingsFilters: (
      state,
      { payload }: { payload: { allBuildingNames: string[]; neighborhoods: Neighborhood[] } }
    ) => {
      state.allBuildingNames = payload.allBuildingNames;
      state.neighborhoods = payload.neighborhoods;
    },
    setNameSelected: (state, { payload }: { payload: string }) => {
      state.nameSelected = payload;
    },
    setNeighborhoodSelected: (state, { payload }: { payload: string }) => {
      state.neighborhoodSelected = payload;
    },
    setTypeOfView: (state, { payload }: { payload: "list" | "map" }) => {
      state.typeOfView = payload;
    }
  },
});

export const { setMenuOpen, setBuildingsFilters, setNameSelected, setNeighborhoodSelected, setTypeOfView } = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
