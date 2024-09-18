"use client";

import Link from "@/components/link";
import { Project } from "@/services/api/types/project";
import { PRIORITIES, RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useMemo, useState } from "react";
import { ProjectFilterType } from "./project-filter-types";
import { useProjectQuery } from "./queries/projects-queries";

import { XButton } from "@/components/form/button-select/form-button-select";
import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import CreatePanel from "./components/CreatePanel";
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
  const { t: tProject } = useTranslation("project");
  const { t: tPanels } = useTranslation("panels");
  const { user } = useAuth();
  const isAdmin = isAdminUser(user);
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamsId = searchParams.get("id");
  const { data: project, refetch } = useProjectQuery({
    id: searchParamsId || "",
  });

  const priorityOption = Object.values(PRIORITIES).find(
    (p) => p.value === project?.data.priority
  );
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: ProjectsKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
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
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <IconButton
            aria-label="back"
            size="medium"
            LinkComponent={Link}
            href={`/projects`}
          >
            <ArrowBackIosNewIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 1 }}>
            {`# ${project?.data.name}`}
          </Typography>
        </Box>
        {project?.data.customerName && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant={"subtitle2"}
              fontSize={12}
              textTransform={"uppercase"}
            >
              {tProject("client")}
            </Typography>
            <Typography variant={"h6"} fontSize={16}>
              {project?.data.customerName}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column", mr: 2 }}>
            <Typography
              variant={"subtitle2"}
              fontSize={12}
              textTransform={"uppercase"}
            >
              {tProject("start-date")}
            </Typography>
            <Typography variant={"h6"} fontSize={16}>
              {dayjs(project?.data.startDate).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mr: 2 }}>
            <Typography
              variant={"subtitle2"}
              fontSize={12}
              textTransform={"uppercase"}
            >
              {tProject("due-date")}
            </Typography>
            <Typography variant={"h6"} fontSize={16}>
              {dayjs(project?.data.dueDate).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          {priorityOption && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant={"subtitle2"}
                fontSize={12}
                textTransform={"uppercase"}
              >
                {tProject("priority")}
              </Typography>
              <XButton
                option={priorityOption}
                sx={{ transform: "scale(0.7)", marginLeft: -2 }}
              />
            </Box>
          )}
        </Box>
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
            <Grid
              container
              item
              xs={12}
              wrap="nowrap"
              spacing={2}
              justifyContent={"space-between"}
            >
              <Grid
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenCreateProject(true)}
                    color="secondary"
                  >
                    <AddIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body1" textTransform={"none"}>
                      {tPanels("add-panel")}
                    </Typography>
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} mb={2}>
            <TableContainer
              component={Paper}
              sx={{ background: alpha("#003087", 0.1) }}
            >
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableSortCellWrapper
                      width={100}
                      orderBy={orderBy}
                      order={order}
                      column="id"
                      handleRequestSort={handleRequestSort}
                    >
                      {tProject("table.column1")}
                    </TableSortCellWrapper>
                    <TableCell style={{ width: 200 }}>
                      {tProject("table.column2")}
                    </TableCell>
                    <TableSortCellWrapper
                      orderBy={orderBy}
                      order={order}
                      column="name"
                      handleRequestSort={handleRequestSort}
                    >
                      {tProject("table.column3")}
                    </TableSortCellWrapper>
                    <TableCell style={{ width: 80 }}>
                      {tProject("table.column4")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProject("table.column5")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProject("table.column6")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tProject("table.column7")}
                    </TableCell>
                    <TableCell style={{ width: 130 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project?.data?.panels
                    ?.sort((p1, p2) =>
                      dayjs(p1.scheduledDate).isBefore(dayjs(p2.scheduledDate))
                        ? order === SortEnum.ASC
                          ? -1
                          : 1
                        : dayjs(p1.scheduledDate).isAfter(
                              dayjs(p2.scheduledDate)
                            )
                          ? order === SortEnum.ASC
                            ? 1
                            : -1
                          : 0
                    )
                    .map((panel) => (
                      <ProjectRow
                        key={panel.id}
                        panel={panel}
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
        <CreatePanel
          projectId={Number(project?.data.id)}
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
