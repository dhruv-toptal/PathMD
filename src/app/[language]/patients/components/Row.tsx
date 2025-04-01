"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import Link from "@/components/link";
import {
  useDeletePatientsService,
  useDeleteProjectsService,
} from "@/services/api/services/patients";
import { Patient, Project } from "@/services/api/types/patient";
import { PRIORITIES, STATUSES } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OpenSeadragon from "openseadragon";

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
import PanelDialog from "../../patient/components/PanelDialog";
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
  patient,
  panel,
  onOpenPanel,
}: {
  patient?: Patient;
  panel?: Panel;
  onOpenPanel?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user: authProject } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchProjectDelete = useDeletePatientsService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const canDelete = patient?.id !== authProject?.id;
  const { t: tPatients } = useTranslation("patients");
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
      title: tPatients("admin-panel-Projects:confirm.delete.title"),
      message: tPatients("admin-panel-Projects:confirm.delete.message"),
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
          data: page?.data.filter((item) => item.id !== patient?.id),
        })),
      };

      queryClient.setQueryData(
        projectsQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchProjectDelete({
        id: Number(patient?.id),
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
      href={panel ? undefined : `/patient?id=${patient?.id}`}
    >
      {patient && tPatients("review")}
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
                      {tPatients("admin-panel-Projects:actions.delete")}
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

function PatientRow({
  patient,
  refetch,
}: {
  patient: Patient;
  refetch: () => void;
}) {
  const router = useRouter();

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell style={{ width: 200 }}>{patient?.fullName}</TableCell>
        <TableCell style={{ width: 200 }}>{patient?.patientId}</TableCell>
        <TableCell style={{ width: 400 }}>{""}</TableCell>
        <TableCell
          style={{
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          {!!patient && <Actions patient={patient} />}
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default PatientRow;
