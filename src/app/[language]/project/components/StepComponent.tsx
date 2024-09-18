import { StageTypes } from "@/services/api/types/role";
import {
  alpha,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import FileIcon from "@/assets/file.svg";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useTranslation } from "react-i18next";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { getValueByKey } from "@/components/form/date-pickers/helper";
import useLanguage from "@/services/i18n/use-language";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { useFileUploadService } from "@/services/api/services/files";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepComponent({ type, props }: { type: String; props?: any }) {
  const theme = useTheme();
  const { t: tStatuses } = useTranslation("statuses");
  const language = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();
  const [checkboxForDate, setCheckboxForDate] = useState(
    !!props?.value?.finishTime
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      const { status, data } = await fetchFileUpload(acceptedFiles[0]);
      if (status === HTTP_CODES_ENUM.CREATED) {
        props?.onChange?.({ checked: true, file: data.file });
      }
      setIsLoading(false);
    },
    [fetchFileUpload, props.onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB
    disabled: isLoading || props.disabled,
  });

  switch (type) {
    case StageTypes.FILE:
      return (
        <>
          <Box display={"flex"} flex={1} alignItems={"center"}>
            <Checkbox
              checked={props.value.checked}
              onChange={(event) => {
                props.onChange({
                  checked: event.target.checked,
                  file: props.file,
                });
              }}
            />
            <Typography variant={"body1"}>
              {props.label}
              {props.isCompulsory ? (
                <span style={{ color: "red" }}> *</span>
              ) : (
                ""
              )}
            </Typography>
          </Box>
          {isLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}
          {props.value.file && (
            <Box
              sx={{
                width: 150,
                height: 36.5,
                borderRadius: 2,
                mr: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pl: 2,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() =>
                props?.onChange?.({ checked: false, file: undefined })
              }
            >
              {"File 1"}
              <CloseIcon />
            </Box>
          )}
          <Box {...getRootProps()}>
            <Button variant="contained" color="primary" type="submit">
              {tStatuses("upload-file")}
              <input {...getInputProps()} />
            </Button>
          </Box>
        </>
      );

    case StageTypes.FILE_VIEW:
      return (
        <>
          <Box display={"flex"} flex={1} alignItems={"center"}>
            <Typography
              variant={"body1"}
              display={"flex"}
              alignItems={"center"}
              bgcolor={alpha(theme.palette.primary.main, 0.1)}
              sx={{ p: 1, borderRadius: 4, pl: 2, pr: 2 }}
            >
              <Image
                src={FileIcon}
                alt={"file"}
                width={24}
                style={{ marginRight: theme.spacing() }}
              />
              {props.imageLabel}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              const link = document.createElement("a");
              link.href = props.value.file.path;
              link.download = props.value.file.path;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            {tStatuses("open-file")}
          </Button>
        </>
      );

    case StageTypes.CHECKBOX:
      return (
        <>
          <Box display={"flex"} flex={1} alignItems={"center"}>
            <Checkbox
              checked={props.value}
              onChange={(event) => {
                props.onChange(event.target.checked);
              }}
            />
            <Typography variant={"body1"}>
              {props.label}
              {props.isCompulsory ? (
                <span style={{ color: "red" }}> *</span>
              ) : (
                ""
              )}
            </Typography>
          </Box>
        </>
      );

    case StageTypes.CHECKBOX_WITH_TEXT:
      return (
        <>
          <Box display={"flex"} flex={1} flexDirection={"column"}>
            <Box display={"flex"} flex={1} alignItems={"center"}>
              <Checkbox
                checked={!!props.value || props.value === ""}
                onChange={(event) => {
                  props.onChange(event.target.checked ? "" : null);
                }}
              />
              <Typography variant={"body1"}>
                {props.label}
                {props.isCompulsory ? (
                  <span style={{ color: "red" }}> *</span>
                ) : (
                  ""
                )}
              </Typography>
            </Box>
            {(props.value || props.value === "") && (
              <TextField
                name="details"
                multiline={true}
                label={tStatuses("statuses:details")}
                required
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                type="text"
                autoComplete={tStatuses("statuses:details")}
              />
            )}
          </Box>
        </>
      );

    case StageTypes.DATE:
      return (
        <>
          <Box display={"flex"} flex={1} flexDirection={"column"}>
            <Box display={"flex"} flex={1} alignItems={"center"}>
              <Typography variant={"body1"}>{props.label}</Typography>
            </Box>
            <Box
              display={"flex"}
              flex={1}
              sx={{ mt: 2, mb: 2 }}
              alignItems={"flex-start"}
              flexDirection={"column"}
            >
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={getValueByKey(language)}
              >
                <DateTimePicker
                  name="startTime"
                  sx={{ mr: 2, mb: 2 }}
                  label={tStatuses("statuses:start_time")}
                  value={
                    props.value.startTime
                      ? new Date(props.value.startTime)
                      : new Date()
                  }
                  onChange={(value) =>
                    props.onChange({
                      startTime: value,
                      finishTime: props.value.finishTime,
                    })
                  }
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={checkboxForDate}
                    onChange={(event) =>
                      setCheckboxForDate(event.target.checked)
                    }
                  />
                  <Typography variant={"body1"}>Finished</Typography>
                </Box>
                {checkboxForDate && (
                  <DateTimePicker
                    name="finishTime"
                    label={tStatuses("statuses:end_time")}
                    value={
                      props.value.finishTime
                        ? new Date(props.value.finishTime)
                        : new Date()
                    }
                    onChange={(value) =>
                      props.onChange({
                        startTime: props.value.startTime,
                        finishTime: value,
                      })
                    }
                  />
                )}
              </LocalizationProvider>
            </Box>
          </Box>
        </>
      );

    case StageTypes.NUMBER:
      return (
        <TextField
          name="numberOfStages"
          label={tStatuses("statuses:design:numberOfStages")}
          required
          onChange={(event) => props.onChange(Number(event.target.value))}
          type="number"
          value={props.value}
          autoComplete={tStatuses("statuses:design:numberOfStages")}
        />
      );

    default:
      return <></>;
  }
}

export default StepComponent;
