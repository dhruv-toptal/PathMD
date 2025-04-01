"use client";

import "@annotorious/openseadragon/annotorious-openseadragon.css";
import Box from "@mui/material/Box";

import { alpha, Typography, useTheme } from "@mui/material";
import Image from "next/image";

function Slides({
  slides,
  selectedSlideIndex,
  onClick,
  width,
}: {
  slides: any;
  onClick: (index: number) => void;
  width: number;
  selectedSlideIndex: number;
}) {
  const theme = useTheme();

  return (
    <Box sx={{ overflowX: "auto", display: "flex", width }}>
      {slides?.map((image, imageIndex) => (
        <Box
          key={`${image.title}${imageIndex}`}
          onClick={() => onClick(imageIndex)}
          style={{
            width: 120,
            height: 225,
            border: `1px solid rgba(0, 0, 0, 0.12)`,
            backgroundColor:
              selectedSlideIndex === imageIndex
                ? "#0E69FF"
                : alpha(theme.palette.primary.main, 0.05),
            margin: theme.spacing(),
            cursor: "pointer",
          }}
        >
          <Image
            src={image.url}
            alt={image.title}
            width={118}
            height={140}
            style={{
              border: "none",
            }}
          />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              textAlign={"center"}
              style={{
                color: selectedSlideIndex === imageIndex ? "white" : "unset",
              }}
            >
              {image.title}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Slides;
