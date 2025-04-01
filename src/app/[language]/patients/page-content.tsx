"use client";

import ProjectsIcon from "@/assets/projects-dark.svg";
import Link from "@/components/link";
import { Patient } from "@/services/api/types/patient";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { alpha, useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";

import ProjectFilter from "./project-filter";
import { ProjectFilterType } from "./project-filter-types";
import { usePatientListQuery } from "./queries/projects-queries";

import { Table, TableBody, TableContainer, TableHead } from "@mui/material";
import CreateProject from "./components/CreateProject";
import PatientRow from "./components/Row";
import useAuth, { isAdminUser } from "@/services/auth/use-auth";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
type PatientsKey = keyof Patient;

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: PatientsKey;
    order: SortEnum;
    column: PatientsKey;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: PatientsKey
    ) => void;
  }>
) {
  return (
    <TableCell
      style={{ width: props.width }}
      sortDirection={props.orderBy === props.column ? props.order : false}
    >
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function Patients() {
  const { t: tPatients } = useTranslation("patients");
  const { user } = useAuth();
  const theme = useTheme();
  const isAdmin = isAdminUser(user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: PatientsKey;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "id" };
  });
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: PatientsKey
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as ProjectFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    usePatientListQuery({ filter, sort: { order, orderBy } });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const result = useMemo(() => {
    const data1 =
      (data?.pages
        ?.flatMap((page) => page?.data)
        .filter((p) => !!p) as Patient[]) ?? ([] as Patient[]);

    const filteredData = searchTerm
      ? data1.filter(
          (patient) =>
            patient.fullName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            patient.patientId
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : data1;

    return removeDuplicatesFromArrayObjects(filteredData as Patient[], "id");
  }, [data, searchTerm]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        backgroundColor: "#F1F2F5",
      }}
    >
      <Toolbar>
        <Box display={"flex"} flexDirection={"column"} marginTop={6}>
          <Typography variant={"h5"} fontWeight={800} sx={{ pl: 1 }}>
            {tPatients("heading", { name: "Dhruv" })}
          </Typography>
          <Typography variant={"body1"} fontWeight={500} sx={{ pl: 1 }}>
            {tPatients("description", { number: "12" })}
          </Typography>
        </Box>
      </Toolbar>
      <Container maxWidth="xl">
        <Grid container spacing={3} pt={3}>
          <Grid container item spacing={3} xs={12}>
            <Grid container item xs="auto" wrap="nowrap" spacing={2}>
              {/* <Grid item xs="auto">
                <ProjectFilter />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item xs={12} mb={2}>
            <TextField
              fullWidth
              placeholder={"Search patients by name or id..."}
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: theme.spacing(2), backgroundColor: "#fff" }}
              size="small"
            />
            <TableContainer
              component={Paper}
              onScroll={handleScroll}
              sx={{ height: 500 }}
            >
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableSortCellWrapper
                      width={200}
                      orderBy={orderBy}
                      order={order}
                      column="id"
                      handleRequestSort={handleRequestSort}
                    >
                      {tPatients("patients:table.column1")}
                    </TableSortCellWrapper>
                    <TableCell style={{ width: 200 }}>
                      {tPatients("patients:table.column2")}
                    </TableCell>
                    <TableSortCellWrapper
                      orderBy={orderBy}
                      order={order}
                      column="fullName"
                      handleRequestSort={handleRequestSort}
                    >
                      {tPatients("patients:table.column3")}
                    </TableSortCellWrapper>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{}}>
                  {result?.map((patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      refetch={refetch}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
      <Drawer
        open={openCreateProject}
        anchor="right"
        onClose={() => {
          setOpenCreateProject(false);
          refetch();
        }}
      >
        <CreateProject
          onClose={() => {
            setOpenCreateProject(false);
            refetch();
          }}
        />
      </Drawer>
    </Box>
  );
}

export default Patients;
