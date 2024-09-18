import { Panel } from "@/services/api/types/panel";
import { RoleEnum, STATUSES } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import DesignSection from "./DesignSection";
import EditPanel from "./EditPanel";
import RebarSection from "./RebarSection";
import SegmentedButtons, { BUTTON_STATUSES } from "./SegmentedButtons";
import MouldSection from "./MouldSection";
import PanelSection from "./PanelSection";
import DemouldSection from "./DemouldSection";
import FinishingSection from "./FinishingSection";
import StoreSection from "./StoreSection";
import { useEffect, useRef, useState } from "react";
import { usePatchPanelService } from "@/services/api/services/panels";
import { PanelData } from "./Sample";
import { enqueueSnackbar } from "notistack";
import useAuth, { isAdminUser } from "@/services/auth/use-auth";

function PanelDialog({
  panel,
  open,
  onClose,
}: {
  panel: Panel;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const { user } = useAuth();
  const isAdmin = isAdminUser(user);
  const patchPanel = usePatchPanelService();
  const panelFormRef = useRef<HTMLFormElement>(null);
  const [panelData, setPanelData] = useState<any>(
    panel.progressData || JSON.parse(PanelData)
  );
  const [activeStepIndex, setActiveStepIndex] = useState(
    Object.values(STATUSES).findIndex((s) => s.value === panelData.activeStep)
  );
  const activeStep = Object.values(STATUSES)[activeStepIndex];
  const onSubmit = async (form: any) => {
    const updatedPanelData = { ...panelData, ...form, progressData: panelData };
    const { data, status } = await patchPanel({
      id: panel?.id,
      data: updatedPanelData,
    });
    enqueueSnackbar("Success", {
      variant: "success",
    });
    onClose();
  };
  const { t: tPanel } = useTranslation("panel");
  let Step;

  switch (Object.values(STATUSES)[activeStepIndex].value) {
    case "design":
      if (!isAdmin) break;
      Step = (
        <DesignSection
          props={panelData.design}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              design: value,
            });
          }}
        />
      );
      break;
    case "rebar":
      if (!isAdmin && user?.role?.id !== RoleEnum.REBAR_USER) break;
      Step = (
        <RebarSection
          {...panelData.rebar}
          props={panelData.rebar}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              rebar: value,
            });
          }}
        />
      );
      break;
    case "mould":
      if (!isAdmin && user?.role?.id !== RoleEnum.MOULD_USER) break;
      Step = (
        <MouldSection
          {...panelData.mould}
          props={panelData.mould}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              mould: value,
            });
          }}
        />
      );
      break;
    case "panel":
      if (!isAdmin && user?.role?.id !== RoleEnum.PANEL_USER) break;
      Step = (
        <PanelSection
          {...panelData.panel}
          props={panelData.panel}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              panel: value,
            });
          }}
        />
      );
      break;
    case "demould":
      if (!isAdmin && user?.role?.id !== RoleEnum.DEMOULD_USER) break;
      Step = (
        <DemouldSection
          {...panelData.demould}
          props={panelData.demould}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              demould: value,
            });
          }}
        />
      );
      break;
    case "finishing":
      if (!isAdmin && user?.role?.id !== RoleEnum.FINISHING_USER) break;
      Step = (
        <FinishingSection
          {...panelData.finishing}
          props={panelData.finishing}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              finishing: value,
            });
          }}
        />
      );
      break;
    case "store":
      if (!isAdmin && user?.role?.id !== RoleEnum.FINISHING_USER) break;
      Step = (
        <StoreSection
          {...panelData.store}
          props={panelData.store}
          onChange={(value) => {
            setPanelData({
              ...panelData,
              store: value,
            });
          }}
        />
      );
      break;
  }
  if (!Step) {
    Step = (
      <Typography>
        You don't have access to this screen,
        <br />
        Please contact admin
      </Typography>
    );
  }
  const isNextStepQC =
    !panelData?.[activeStep?.value]?.qcApproved &&
    !panelData?.[activeStep?.value]?.qcRejected &&
    !panelData?.[activeStep?.value]?.qcStarted &&
    ["rebar", "mould", "panel"].includes(activeStep?.value) &&
    ["build", "pour_2"].includes(panelData[activeStep.value].activeStep);
  console.log({ check: panelData?.[activeStep.value] });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={true}
      sx={{ mt: 10, mb: 10, ml: "10%", mr: "10%" }}
    >
      <DialogContent dividers>
        <Box sx={{}}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant={"h5"} fontWeight={500} sx={{ pl: 4 }}>
              {`# ${panel?.panelId}`}
            </Typography>
            <IconButton sx={{ width: 20, p: 4 }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider
            sx={{ background: alpha(theme.palette.primary.main, 0.5) }}
          />
          <Grid container columns={3} sx={{ height: "90%" }}>
            <Grid item xs={1} display={"flex"}>
              <EditPanel
                panel={panel}
                panelFormRef={panelFormRef}
                onSubmit={onSubmit}
              />
              <Box
                sx={{
                  background: alpha(theme.palette.primary.main, 0.5),
                  width: "1px",
                  maxWidth: "1px",
                  height: "100%",
                }}
              />
            </Grid>
            <Grid item xs={2} sx={{ p: 4 }}>
              <Typography variant={"h4"} fontWeight={600} sx={{ mb: 2 }}>
                {tPanel("status-process")}
              </Typography>
              <SegmentedButtons
                title={tPanel("status")}
                buttons={Object.values(STATUSES).map((s) => ({
                  ...s,
                  status: panelData[s.value]?.qcApproved
                    ? BUTTON_STATUSES.GREEN
                    : panelData[s.value]?.qcRejected
                      ? BUTTON_STATUSES.RED
                      : undefined,
                }))}
                selectedButtonIndex={activeStepIndex}
                selectedButtonStatus={
                  (
                    panelData?.[
                      (activeStep?.value || "rebar") as never
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ] as any
                  )?.qcApproved
                    ? BUTTON_STATUSES.GREEN
                    : (
                          panelData?.[
                            (activeStep?.value || "rebar") as never
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ] as any
                        )?.qcRejected
                      ? BUTTON_STATUSES.RED
                      : BUTTON_STATUSES.YELLOW
                }
                onChange={
                  isAdmin ? (index) => setActiveStepIndex(index) : undefined
                }
              />
              <Divider
                sx={{
                  background: alpha(theme.palette.primary.main, 0.5),
                  ml: -4,
                  mb: 2,
                  width: "calc(100% + 64px);",
                }}
              />
              {panelData?.[activeStep.value].qcStarted && (
                <Box
                  width={"100%"}
                  sx={{
                    border: "solid",
                    borderRadius: 1,
                    borderWidth: 0.5,
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.1),
                    mb: 2,
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Typography variant="h6">{`Quality Control Process in place`}</Typography>
                  {isAdmin && (
                    <Box sx={{ alignSelf: "flex-end" }}>
                      <Button
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={() => {
                          const updatedPanelData = panelData;
                          updatedPanelData[activeStep.value].qcApproved = true;
                          updatedPanelData[activeStep.value].qcStarted = false;
                          setPanelData(updatedPanelData);
                          panelFormRef?.current?.requestSubmit();
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          const updatedPanelData = panelData;
                          updatedPanelData[activeStep.value].qcRejected = true;
                          switch (activeStep.value) {
                            case "rebar":
                            case "mould":
                              updatedPanelData[activeStep.value].activeStep =
                                activeStep.value;
                              updatedPanelData[activeStep.value].build = {};
                              break;
                            case "panel":
                              updatedPanelData[activeStep.value].activeStep =
                                "setup_1";
                              updatedPanelData[activeStep.value].setup_1 = {};
                              updatedPanelData[activeStep.value].setup_2 = {};
                              updatedPanelData[activeStep.value].pour_1 = {};
                              updatedPanelData[activeStep.value].pour_2 = {};
                              break;
                          }
                          setPanelData(updatedPanelData);
                          panelFormRef?.current?.requestSubmit();
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {Step}
            </Grid>
          </Grid>
          <Divider
            sx={{
              background: alpha(theme.palette.primary.main, 0.5),
              ml: -4,
              mb: 2,
              width: "calc(100% + 64px);",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
        <Box display={"flex"} flex={1} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => {
              panelFormRef?.current?.requestSubmit();
            }}
          >
            {tPanel(isNextStepQC ? "submit-to-qc" : "submit")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default PanelDialog;
