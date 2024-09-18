"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import Link from "@/components/link";
import { useDeleteProjectsService } from "@/services/api/services/projects";
import { Project } from "@/services/api/types/project";
import { PRIORITIES, STATUSES } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TableCell from "@mui/material/TableCell";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Fragment, PropsWithChildren, useRef, useState } from "react";
import { ProjectFilterType, ProjectSortType } from "../project-filter-types";
import { projectsQueryKeys } from "../queries/projects-queries";

import { XButton } from "@/components/form/button-select/form-button-select";
import {
  alpha,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Panel } from "@/services/api/types/panel";
import PanelDialog from "../../project/components/PanelDialog";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
export type PanelKeys = keyof Panel;

export function PanelTableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: PanelKeys;
    order: SortEnum;
    column: PanelKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: PanelKeys
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

function Actions({
  project,
  panel,
  onOpenPanel,
}: {
  project?: Project;
  panel?: Panel;
  onOpenPanel?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user: authProject } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchProjectDelete = useDeleteProjectsService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const canDelete = project?.id !== authProject?.id;
  const { t: tProjects } = useTranslation("projects");
  const { t: tPanels } = useTranslation("panels");

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tProjects("admin-panel-Projects:confirm.delete.title"),
      message: tProjects("admin-panel-Projects:confirm.delete.message"),
    });

    if (isConfirmed) {
      setOpen(false);

      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");

      let filter: ProjectFilterType | undefined = undefined;
      let sort: ProjectSortType | undefined = {
        order: SortEnum.DESC,
        orderBy: "id",
      };

      if (searchParamsFilter) {
        filter = JSON.parse(searchParamsFilter);
      }

      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }

      const previousData = queryClient.getQueryData<
        InfiniteData<{ nextPage: number; data: Project[] }>
      >(projectsQueryKeys.list().sub.by({ sort, filter }).key);

      await queryClient.cancelQueries({
        queryKey: projectsQueryKeys.list().key,
      });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== project?.id),
        })),
      };

      queryClient.setQueryData(
        projectsQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchProjectDelete({
        id: Number(project?.id),
      });
    }
  };

  const mainButton = (
    <Button
      size="small"
      variant="contained"
      color={panel ? "secondary" : undefined}
      LinkComponent={panel ? undefined : Link}
      onClick={panel ? onOpenPanel : undefined}
      href={panel ? undefined : `/project?id=${project?.id}`}
    >
      {project && tProjects("view")}
      {panel && tPanels("my-tasks")}
    </Button>
  );

  return (
    <>
      {mainButton}
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {canDelete && (
                    <MenuItem sx={{}} onClick={handleDelete}>
                      {tProjects("admin-panel-Projects:actions.delete")}
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

function ProjectRow({
  project,
  refetch,
}: {
  project: Project;
  refetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const [openPanelDialog, setOpenPanelDialog] = useState(false);
  const { t: tPanels } = useTranslation("panels");
  const option = Object.values(PRIORITIES).find(
    (o) => o.value === project.priority
  );
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: PanelKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "bedSchedules" };
  });
  project.panels = project.panels
    ?.map((p) => ({
      ...p,
      scheduledDate: p.bedSchedules?.[0]?.scheduledDate,
    }))
    .sort((p1, p2) =>
      dayjs(p1.scheduledDate).isBefore(dayjs(p2.scheduledDate))
        ? order === SortEnum.ASC
          ? -1
          : 1
        : dayjs(p1.scheduledDate).isAfter(dayjs(p2.scheduledDate))
          ? order === SortEnum.ASC
            ? 1
            : -1
          : 0
    );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: PanelKeys
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
  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {(project?.panels?.length || 0) > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell style={{ width: 100 }}>{project?.id}</TableCell>
        <TableCell style={{ width: 100 }}>{project?.projectId}</TableCell>
        <TableCell style={{ width: 200 }}>{project?.name}</TableCell>
        <TableCell>{project?.customerName}</TableCell>
        <TableCell>{option && <XButton option={option} />}</TableCell>
        <TableCell>{`${project?.completionPercentage}%`}</TableCell>
        <TableCell>
          {project?.startDate
            ? dayjs(project?.startDate).format("DD/MM/YYYY")
            : ""}
        </TableCell>
        <TableCell>
          {project?.dueDate ? dayjs(project?.dueDate).format("DD/MM/YYYY") : ""}
        </TableCell>
        <TableCell style={{ width: 130 }}>
          {!!project && <Actions project={project} />}
        </TableCell>
      </TableRow>
      <TableRow sx={{ width: "100%" }}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            background: alpha("#003087", 0.1),
          }}
          colSpan={9}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Panels
              </Typography>
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 80 }}>
                      {tPanels("table.column1")}
                    </TableCell>
                    <TableCell style={{ width: 130 }}>
                      {tPanels("table.column2")}
                    </TableCell>
                    <PanelTableSortCellWrapper
                      width={100}
                      orderBy={orderBy}
                      order={order}
                      column="scheduledDate"
                      handleRequestSort={handleRequestSort}
                    >
                      {tPanels("table.column3")}
                    </PanelTableSortCellWrapper>
                    <TableCell style={{ width: 80 }}>
                      {tPanels("table.column4")}
                    </TableCell>
                    <TableCell style={{ width: 80 }}>
                      {tPanels("table.column5")}
                    </TableCell>
                    <TableCell style={{ width: 130 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project?.panels?.map((panelRow) => (
                    <TableRow key={panelRow.id}>
                      <TableCell component="th" scope="row">
                        {panelRow.panelId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {panelRow.description}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {panelRow.scheduledDate
                          ? dayjs(panelRow.scheduledDate).format("ddd, D MMM")
                          : ""}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {panelRow.bedSchedules?.[0]?.name || ""}
                      </TableCell>
                      <TableCell>
                        <Box
                          bgcolor={"#FFF3E0"}
                          sx={{ cursor: "unset", width: "fit-content" }}
                          pl={2}
                          pr={2}
                          borderRadius={5}
                          height={"80%"}
                          alignItems={"center"}
                          display={"flex"}
                        >
                          <Typography
                            variant={"subtitle1"}
                            fontSize={14}
                            sx={{
                              color: "#FF9A00",
                            }}
                            textTransform={"capitalize"}
                          >
                            {Object.values(STATUSES).find(
                              (s) =>
                                s.value ===
                                (panelRow?.progressData as any)?.activeStep
                            )?.label || "Design"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {!!panelRow && (
                          <Actions
                            panel={panelRow}
                            onOpenPanel={() => {
                              setOpenPanelDialog(true);
                            }}
                          />
                        )}
                      </TableCell>
                      {openPanelDialog && (
                        <PanelDialog
                          panel={panelRow}
                          open={true}
                          onClose={() => {
                            setOpenPanelDialog(false);
                            refetch();
                          }}
                        />
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default ProjectRow;
