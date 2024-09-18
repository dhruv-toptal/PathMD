"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteProjectsService } from "@/services/api/services/projects";
import { Project } from "@/services/api/types/project";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";

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
import { Fragment, useRef, useState } from "react";
import { ProjectFilterType, ProjectSortType } from "../project-filter-types";
import { projectsQueryKeys } from "../queries/projects-queries";

import { Panel } from "@/services/api/types/panel";
import { TableRow } from "@mui/material";
import PanelDialog from "./PanelDialog";
import dayjs from "dayjs";

function Actions({
  panel,
  onOpenPanel,
}: {
  panel: Panel;
  onOpenPanel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user: authProject } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchProjectDelete = useDeleteProjectsService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const canDelete = panel.id !== authProject?.id;
  const { t: tPanel } = useTranslation("panel");

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
      title: tPanel("panel:confirm.delete.title"),
      message: tPanel("panel:confirm.delete.message"),
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
          data: page?.data.filter((item) => item.id !== panel.id),
        })),
      };

      queryClient.setQueryData(
        projectsQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchProjectDelete({
        id: panel.id,
      });
    }
  };

  const mainButton = (
    <Button
      size="small"
      variant="contained"
      onClick={onOpenPanel}
      color="secondary"
    >
      {tPanel("my-tasks")}
    </Button>
  );

  return (
    <>
      {[!canDelete].every(Boolean) ? (
        mainButton
      ) : (
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="split button"
          size="small"
          color="secondary"
        >
          {mainButton}

          {/* <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            color="secondary"
          >
            <ArrowDropDownIcon />
          </Button> */}
        </ButtonGroup>
      )}
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
                      {tPanel("panel:actions.delete")}
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

function ProjectRow({ panel, refetch }: { panel: Panel; refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const { t: tPanels } = useTranslation("panels");
  panel.scheduledDate = panel.bedSchedules?.[0]?.scheduledDate;

  return (
    <Fragment>
      <TableRow key={panel.id}>
        <TableCell component="th" scope="row">
          {panel.id}
        </TableCell>
        <TableCell width={200}>{panel.description}</TableCell>
        <TableCell>
          {panel.scheduledDate
            ? dayjs(panel.scheduledDate).format("ddd, D MMM")
            : ""}
        </TableCell>
        <TableCell>{panel.type}</TableCell>
        <TableCell>{panel.pouringDays}</TableCell>
        <TableCell>{panel.material}</TableCell>
        <TableCell>{panel.tonnage}</TableCell>
        <TableCell style={{ width: 130 }}>
          {!!panel && (
            <Actions panel={panel} onOpenPanel={() => setOpen(true)} />
          )}
        </TableCell>
      </TableRow>
      {open && (
        <PanelDialog
          panel={panel}
          open={open}
          onClose={() => {
            setOpen(false);
            refetch();
          }}
        />
      )}
    </Fragment>
  );
}

export default ProjectRow;
