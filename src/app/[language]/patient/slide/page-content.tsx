"use client";

import { useTranslation } from "@/services/i18n/client";
import "@annotorious/openseadragon/annotorious-openseadragon.css";
import Box from "@mui/material/Box";
import OpenSeadragon from "openseadragon";
import { useEffect, useRef, useState } from "react";
import {
  Annotorious,
  OpenSeadragonAnnotationPopup,
  OpenSeadragonAnnotator,
  OpenSeadragonViewer,
  UserSelectAction,
} from "@annotorious/react";

import { alpha, Button, useTheme } from "@mui/material";
import { points } from "./Annotation";
import { CommentPopup } from "./CommentPopup";
import Image from "next/image";
import DrawingIcon from "@/assets/pencil.svg";
import { convertXML } from "simple-xml-to-json";

function Projects() {
  const { t: tPanels } = useTranslation("panels");
  const theme = useTheme();
  const viewerInitialized = useRef<boolean>();
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const annotatorRef = useRef<any>();
  const annotationsInitialised = useRef<boolean>();
  const svsFrameRef = useRef<HTMLDivElement | null>(null);
  const [annotations, setAnnotations] = useState();

  useEffect(() => {
    if (!!annotationsInitialised.current) return;
    annotationsInitialised.current = true;
    const download = async () => {
      const response = await fetch(
        "http://localhost:8080/assets/dziFiles/annotation2.xml"
      );
      const text = await response.text();
      const jsonDoc = convertXML(text);

      const anno = jsonDoc.Annotations.children.map((c) => ({
        id: c.Annotation.Id,
        color: `#${c.Annotation.LineColor}`,
        regions: c.Annotation.children
          .map((c1) =>
            c1.Regions
              ? c1.Regions.children
                  .map((c2) =>
                    c2.Region
                      ? {
                          id: `Region - ${c2.Region.Id}`,
                          points: c2.Region.children
                            .map((c3) =>
                              c3.Vertices
                                ? c3.Vertices.children.map((c4) => [
                                    Number(c4.Vertex.X),
                                    Number(c4.Vertex.Y),
                                  ])
                                : null
                            )
                            .flat(1)
                            .filter((v) => !!v),
                        }
                      : null
                  )
                  .filter((v) => !!v)
              : null
          )
          .filter((v) => !!v),
      }));
      setAnnotations(anno);
      annotatorRef.current.on("createAnnotation", (annotation) => {
        console.log({ createAnnotation: annotation });
        // const newAnnotations = [...annotations, annotation];
        // setAnnotations(newAnnotations);
        // setLocalAnnotation(newAnnotations);
      });

      annotatorRef.current.on("updateAnnotation", (annotation, previous) => {
        console.log({ updateAnnotation: annotation });
      });

      annotatorRef.current.on("deleteAnnotation", (annotation) => {
        console.log({ annotation });
      });

      anno.forEach((annotation: any) => {
        console.log({ c: annotation });
        annotatorRef.current.setStyle({
          fill: "#39DA65",
          fillOpacity: 0.2,
          stroke: "#39DA65",
          strokeOpacity: 1,
          strokeWidth: 2,
        });
        annotation.regions[0].map((region: any) => {
          annotatorRef.current.addAnnotation({
            id: region.Id,
            bodies: [],
            target: {
              annotation: region.Id,
              selector: {
                type: "POLYGON",
                geometry: {
                  bounds: {
                    minX: 0,
                    minY: 0,
                    maxX: 100000,
                    maxY: 100000,
                  },
                  points: region.points,
                },
              },
              creator: {
                isGuest: true,
                id: "uSQjdJQXN_YdPQvHScX8",
              },
              created: "2025-02-06T07:20:34.195Z",
            },
          });
        });
      });
    };
    download();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Box
        // id="svsFrame"
        // ref={svsFrameRef}
        sx={{
          flex: "3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Annotorious>
          <OpenSeadragonAnnotator
            ref={(ref) => {
              if (ref) {
                const { clientWidth = 0, clientHeight = 0 } =
                  svsFrameRef.current || {};
                ref.viewer.container.style.height = `${clientHeight}px`;
                ref.viewer.container.style.width = `${clientWidth}px`;
                annotatorRef.current = ref;
              }
            }}
            tool="polygon"
            drawingEnabled={isDrawingEnabled}
            drawingMode="drag"
            userSelectAction={UserSelectAction.EDIT}
          >
            <OpenSeadragonViewer
              options={{
                prefixUrl:
                  "https://openseadragon.github.io/openseadragon/images/",
                tileSources:
                  "http://0.0.0.0:8080/assets/dziFiles/file_output.dzi",

                maxZoomPixelRatio: 2,
              }}
            />
            <OpenSeadragonAnnotationPopup
              popup={(props) => <CommentPopup {...props} />}
            />
          </OpenSeadragonAnnotator>
        </Annotorious> */}
      </Box>
      <Box
        sx={{
          width: 50,
          border: "solid",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: theme.spacing(),
        }}
      >
        {/* <DrawingIcon1 style={{ fill: "red", width: "2em", height: "2em" }} /> */}

        <div
          onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
          style={{
            // width: 30,
            // maxWidth: 30,
            backgroundColor: isDrawingEnabled ? alpha("#C68F2F", 0.2) : "unset",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            padding: 5,
            cursor: "pointer",
          }}
        >
          <Image
            src={DrawingIcon}
            alt={"file"}
            width={24}
            style={{ color: "red" }}
          />
        </div>
      </Box>
      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}>
          Toggle Drawing
        </Button>
      </Box>
    </Box>
  );
}

export default Projects;
