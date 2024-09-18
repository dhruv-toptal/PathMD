"use client";
import PlanningIcon from "@/assets/planning-dark.svg";
import { useGetPanelsService } from "@/services/api/services/panels";
import { BedSchedule } from "@/services/api/types/bed-schedule";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { Scheduler } from "@aldabil/react-scheduler";
import AddIcon from "@mui/icons-material/Add";
import { alpha, Box, Button, Divider, Toolbar, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SegmentedButtons from "../project/components/SegmentedButtons";
import { BedScheduleFilterType } from "./bed-schedule-filter-types";
import CreateBedSchedule, { BEDS } from "./CreateBedSchedule";
import { useBedScheduleListQuery } from "./queries/bed-schedules-queries";

type BedSchedulesKeys = keyof BedSchedule;

function Insights() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { t: tPlanning } = useTranslation("planning");
  const [openAddSchedule, setOpenAddSchedule] = useState(false);
  const [selectedBedIndex, setSelectedBedIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [panels, setPanels] = useState<any>();

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: BedSchedulesKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "id" };
  });

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as BedScheduleFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useBedScheduleListQuery({ filter, sort: { order, orderBy } });

  const bedSchedules = data?.pages[0]?.data.filter(
    (bs) => bs.name === BEDS[selectedBedIndex].name
  );

  const fetch = useGetPanelsService();
  useEffect(() => {
    const fetchPanels = async () => {
      const { status, data } = await fetch({ page: 1, limit: 1000 }, {});
      if (status === HTTP_CODES_ENUM.OK) {
        setPanels(data?.data);
      }
    };
    fetchPanels();
  }, [fetch]);

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
            src={PlanningIcon}
            alt={"Planning"}
            width={24}
          />
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 1 }}>
            {"Planning"}
          </Typography>
        </Box>
      </Toolbar>
      <Divider
        sx={{
          ml: 3,
          mr: 3,
          background: alpha(theme.palette.primary.main, 0.5),
        }}
      />
      <Box
        sx={{
          m: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          sx={{ alignSelf: "flex-end" }}
          variant="contained"
          onClick={() => setOpenAddSchedule(true)}
          color="secondary"
        >
          <AddIcon sx={{ mr: 1 }} />
          <Typography variant="body1" textTransform={"none"}>
            {tPlanning("schedule")}
          </Typography>
        </Button>
        <SegmentedButtons
          title="Beds"
          buttons={BEDS.map((b) => ({ label: b.name, value: b.name }))}
          selectedButtonIndex={selectedBedIndex}
          onChange={(index) => setSelectedBedIndex(index)}
        />
        <Scheduler
          disableViewNavigator
          agenda={true}
          alwaysShowAgendaDays={true}
          translations={{
            navigation: {
              month: "Month",
              week: "Week",
              day: "Day",
              today: "Today",
              agenda: "Agenda",
            },
            form: {
              addTitle: "Add Event",
              editTitle: "Edit Event",
              confirm: "Confirm",
              delete: "Delete",
              cancel: "Cancel",
            },
            event: {
              title: "Title",
              subtitle: "Subtitle",
              start: "Start",
              end: "End",
              allDay: "All Day",
            },
            validation: {
              required: "Required",
              invalidEmail: "Invalid Email",
              onlyNumbers: "Only Numbers Allowed",
              min: "Minimum {{min}} letters",
              max: "Maximum {{max}} letters",
            },
            moreEvents: "More...",
            noDataToDisplay: "",
            loading: "Loading...",
          }}
          events={
            bedSchedules?.map((bed) => ({
              event_id: bed?.id,
              title: `Panel ID: ${bed.panel?.panelId}`,
              start: dayjs(bed.scheduledDate || new Date())
                .startOf("day")
                .toDate(),
              end: dayjs(bed.scheduledDate || new Date())
                .startOf("day")
                .toDate(),
            })) || []
          }
        />
        {openAddSchedule && (
          <CreateBedSchedule
            open={openAddSchedule}
            onClose={() => {
              setOpenAddSchedule(false);
              refetch();
            }}
            panels={panels}
          />
        )}
      </Box>
    </Box>
  );
}

export default withPageRequiredAuth(Insights);
