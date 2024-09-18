"use client";

import { ForwardedRef, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { Box, Button, darken, SxProps, Theme, Typography } from "@mui/material";

type ButtonSelectInputProps<T extends object> = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  keyValue: keyof T;
  options: {
    label: string;
    value: string;
    backgroundColor: string;
    icon: any;
  }[];
  renderOption: (option: {
    label: string;
    value: string;
    backgroundColor: string;
    icon: any;
  }) => React.ReactNode;
};
export function XButton<T extends object>({
  props,
  option,
  sx,
}: {
  props?: ButtonSelectInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T | string) => void;
    onBlur: () => void;
  };
  option: {
    label: string;
    value: string;
    backgroundColor: string;
    icon: any;
  };
  sx?: SxProps<Theme> | undefined;
}) {
  const Icon = option.icon;
  const disabled = !props;
  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={() => props?.onChange(option.value)}
      sx={{
        maxWidth: 100,
        borderRadius: 10,
        backgroundColor:
          props?.value?.toString() === option.value
            ? darken(option.backgroundColor, 0.2)
            : option.backgroundColor,
        alignItems: "center",
        display: "flex",
        "&:disabled": {
          backgroundColor: option.backgroundColor,
        },
        ":hover": {
          backgroundColor: darken(option.backgroundColor, 0.3),
        },
        ...sx,
      }}
    >
      <Icon
        sx={{
          width: 16,
          color: darken(option.backgroundColor, 0.7),
          mr: 1,
        }}
      />

      <Typography
        color={darken(option.backgroundColor, 0.7)}
        variant="body2"
        textTransform={"capitalize"}
      >
        {option.label}
      </Typography>
    </Button>
  );
}
function ButtonSelectInputRaw<T extends object>(
  props: ButtonSelectInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T | string) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  return (
    <FormControl
      fullWidth
      error={!!props.error}
      disabled={props.disabled}
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {props.options.map((option) => (
        <XButton props={props} option={option} />
      ))}
      {!!props.error && (
        <FormHelperText data-testid={`${props.testId}-error`}>
          {props.error}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const ButtonSelectInput = forwardRef(ButtonSelectInputRaw) as never as <
  T extends object,
>(
  props: ButtonSelectInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof ButtonSelectInputRaw>;

function FormButtonSelectInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ButtonSelectInputProps<T> &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <ButtonSelectInput<T>
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          type={props.type}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          options={props.options}
          renderOption={props.renderOption}
          keyValue={props.keyValue}
        />
      )}
    />
  );
}

export default FormButtonSelectInput;
