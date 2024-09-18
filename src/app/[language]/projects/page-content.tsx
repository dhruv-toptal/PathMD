"use client";

import ProjectsIcon from "@/assets/projects-dark.svg";
import Link from "@/components/link";
import { Project } from "@/services/api/types/project";
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
import { useProjectListQuery } from "./queries/projects-queries";

import { Table, TableBody, TableContainer, TableHead } from "@mui/material";
import Image from "next/image";
import CreateProject from "./components/CreateProject";
import ProjectRow from "./components/Row";
import useAuth, { isAdminUser } from "@/services/auth/use-auth";

type ProjectsKeys = keyof Project;

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: ProjectsKeys;
    order: SortEnum;
    column: ProjectsKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: ProjectsKeys
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

function Projects() {
  const { t: tProjects } = useTranslation("projects");
  const theme = useTheme();
  const { user } = useAuth();
  const isAdmin = isAdminUser(user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: ProjectsKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "id" };
  });
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: ProjectsKeys
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
    useProjectListQuery({ filter, sort: { order, orderBy } });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages
        ?.flatMap((page) => page?.data)
        .filter((p) => !!p) as Project[]) ?? ([] as Project[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <Box
      sx={{ display: "flex", flex: 1, width: "100%", flexDirection: "column" }}
    >
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Image
            className="dark:invert"
            src={ProjectsIcon}
            alt={tProjects("title")}
            width={24}
          />
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 1 }}>
            {tProjects("title")}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => setOpenCreateProject(true)}
          >
            <Typography variant="body1" textTransform={"none"}>
              {tProjects("new-project")}
            </Typography>
          </Button>
        )}
      </Toolbar>
      <Divider
        sx={{
          ml: 3,
          mr: 3,
          background: alpha(theme.palette.primary.main, 0.5),
        }}
      />
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
            <TableContainer component={Paper} onScroll={handleScroll}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell width={80} />
                    <TableSortCellWrapper
                      width={100}
                      orderBy={orderBy}
                      order={order}
                      column="id"
                      handleRequestSort={handleRequestSort}
                    >
                      {tProjects("projects:table.column1")}
                    </TableSortCellWrapper>
                    <TableCell style={{ width: 200 }}>
                      {tProjects("projects:table.column2")}
                    </TableCell>
                    <TableSortCellWrapper
                      orderBy={orderBy}
                      order={order}
                      column="name"
                      handleRequestSort={handleRequestSort}
                    >
                      {tProjects("projects:table.column3")}
                    </TableSortCellWrapper>
                    <TableCell style={{ width: 80 }}>
                      {tProjects("projects:table.column4")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProjects("projects:table.column5")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProjects("projects:table.column6")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProjects("projects:table.column7")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProjects("projects:table.column8")}
                    </TableCell>
                    <TableCell style={{ width: 130 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((project) => (
                    <ProjectRow
                      key={project.name}
                      project={project}
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

export default Projects;
