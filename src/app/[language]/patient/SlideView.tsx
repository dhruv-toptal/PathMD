"use client";

import { useTranslation } from "@/services/i18n/client";
import "@annotorious/openseadragon/annotorious-openseadragon.css";
import {
  Annotorious,
  OpenSeadragonAnnotationPopup,
  OpenSeadragonAnnotator,
  OpenSeadragonViewer,
  UserSelectAction,
} from "@annotorious/react";
import Box from "@mui/material/Box";
import { Dispatch, useEffect, useRef, useState } from "react";

import DrawingIcon from "@/assets/pencil.svg";
import { alpha, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { CommentPopup } from "./CommentPopup";

function SlideView({
  annotation,
  onCustomAnnotationsChange,
  customAnnotations,
  tileSourcesUrl,
  isDrawingEnabled: isDrawingEnabledProp,
}: {
  annotation: any;
  onCustomAnnotationsChange: Dispatch<any>;
  customAnnotations: any;
  tileSourcesUrl: string;
  isDrawingEnabled?: boolean;
}) {
  const theme = useTheme();
  const [isDrawingEnabled, setIsDrawingEnabled] =
    useState(isDrawingEnabledProp);
  const annotatorRef = useRef<any>();
  const [isOnlyHNE, setIsOnlyHNE] = useState(true);
  const annotationsInitialised = useRef<boolean>();
  const svsFrameRef = useRef<HTMLDivElement | null>(null);
  const [unsavedAnnotations, setUnsavedAnnotations] = useState<any[]>([]);
  console.log({ unsavedAnnotations });
  const customAnnotationsRef = useRef<any[]>(customAnnotations);

  useEffect(() => {
    setIsDrawingEnabled(isDrawingEnabledProp);
  }, [isDrawingEnabledProp]);

  useEffect(() => {
    customAnnotationsRef.current = customAnnotations;
  }, [customAnnotations]);

  // useEffect(() => {
  //   if (!!annotationsInitialised.current) return;
  //   annotationsInitialised.current = true;
  //   const download = async () => {
  //     const response = await fetch(annotationsUrl as string);
  //     const text = await response.text();
  //     const jsonDoc = convertXML(text);

  //     const anno = jsonDoc.Annotations.children.map((c) => ({
  //       id: c.Annotation.Id,
  //       color: `#${c.Annotation.LineColor}`,
  //       regions: c.Annotation.children
  //         .map((c1) =>
  //           c1.Regions
  //             ? c1.Regions.children
  //                 .map((c2) =>
  //                   c2.Region
  //                     ? {
  //                         id: `Region - ${c2.Region.Id}`,
  //                         points: c2.Region.children
  //                           .map((c3) =>
  //                             c3.Vertices
  //                               ? c3.Vertices.children.map((c4) => [
  //                                   Number(c4.Vertex.X),
  //                                   Number(c4.Vertex.Y),
  //                                 ])
  //                               : null
  //                           )
  //                           .flat(1)
  //                           .filter((v) => !!v),
  //                       }
  //                     : null
  //                 )
  //                 .filter((v) => !!v)
  //             : null
  //         )
  //         .filter((v) => !!v),
  //     }));
  //     annotatorRef.current.on("createAnnotation", (annotation: any) => {
  //       setUnsavedAnnotations([...unsavedAnnotations, annotation]);
  //     });

  //     annotatorRef.current.on(
  //       "updateAnnotation",
  //       (annotation: any, previous: any) => {
  //         setUnsavedAnnotations([
  //           ...unsavedAnnotations.filter((a) => a.id !== annotation.id),
  //           annotation,
  //         ]);
  //       }
  //     );

  //     annotatorRef.current.on("deleteAnnotation", (annotation: any) => {
  //       console.log({ annotation });
  //       setUnsavedAnnotations([
  //         ...unsavedAnnotations.filter((a) => a.id !== annotation.id),
  //       ]);
  //     });

  //     annotatorRef.current.setStyle({
  //       fill: "#39DA65",
  //       fillOpacity: 0.2,
  //       stroke: "#39DA65",
  //       strokeOpacity: 1,
  //       strokeWidth: 2,
  //     });
  //     annotation.regions[0].map((region: any) => {
  //       annotatorRef.current.addAnnotation({
  //         id: region.Id,
  //         bodies: [],
  //         target: {
  //           annotation: region.Id,
  //           selector: {
  //             type: "POLYGON",
  //             geometry: {
  //               bounds: {
  //                 minX: 0,
  //                 minY: 0,
  //                 maxX: 100000,
  //                 maxY: 100000,
  //               },
  //               points: region.points,
  //             },
  //           },
  //           creator: {
  //             isGuest: true,
  //             id: "uSQjdJQXN_YdPQvHScX8",
  //           },
  //           created: "2025-02-06T07:20:34.195Z",
  //         },
  //       });
  //     });
  //     // anno.forEach((annotation: any) => {
  //     //   annotatorRef.current.setStyle({
  //     //     fill: "#39DA65",
  //     //     fillOpacity: 0.2,
  //     //     stroke: "#39DA65",
  //     //     strokeOpacity: 1,
  //     //     strokeWidth: 2,
  //     //   });
  //     //   annotation.regions[0].map((region: any) => {
  //     //     annotatorRef.current.addAnnotation({
  //     //       id: region.Id,
  //     //       bodies: [],
  //     //       target: {
  //     //         annotation: region.Id,
  //     //         selector: {
  //     //           type: "POLYGON",
  //     //           geometry: {
  //     //             bounds: {
  //     //               minX: 0,
  //     //               minY: 0,
  //     //               maxX: 100000,
  //     //               maxY: 100000,
  //     //             },
  //     //             points: region.points,
  //     //           },
  //     //         },
  //     //         creator: {
  //     //           isGuest: true,
  //     //           id: "uSQjdJQXN_YdPQvHScX8",
  //     //         },
  //     //         created: "2025-02-06T07:20:34.195Z",
  //     //       },
  //     //     });
  //     //   });
  //     // });
  //   };
  //   download();
  // }, [unsavedAnnotations, setUnsavedAnnotations, annotationsUrl]);

  useEffect(() => {
    const trySettingAnnotations = () => {
      if (!annotationsInitialised.current) {
        annotatorRef.current.on("createAnnotation", (annotation: any) => {
          console.log("okokkok");
          console.log({
            customAnnotations: customAnnotationsRef.current,
            annotation,
          });
          onCustomAnnotationsChange([
            ...customAnnotationsRef.current,
            annotation,
          ]);
        });

        annotatorRef.current.on(
          "updateAnnotation",
          (annotation: any, previous: any) => {
            console.log("yayya");
            // onCustomAnnotationsChange([
            //   ...unsavedAnnotations.filter((a) => a.id !== annotation.id),
            //   annotation,
            // ]);
          }
        );

        annotatorRef.current.on("deleteAnnotation", (annotation: any) => {
          // onCustomAnnotationsChange([
          //   ...unsavedAnnotations.filter((a) => a.id !== annotation.id),
          // ]);
        });

        annotatorRef.current.setStyle({
          fill: "#39DA65",
          fillOpacity: 0.2,
          stroke: "#39DA65",
          strokeOpacity: 1,
          strokeWidth: 2,
        });
      }
      annotationsInitialised.current = true;
      annotatorRef.current.clearAnnotations();
      console.log({ customAnnotations, aaaaa: annotation.regions[0] });
      customAnnotations.forEach((annotation: any) => {
        annotatorRef.current?.addAnnotation(annotation);
      });
      annotation.regions[0].map((region: any) => {
        annotatorRef.current?.addAnnotation({
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
    };
    if (!annotatorRef.current) {
      setTimeout(() => {
        console.log({ tryTwo: annotatorRef.current });
        if (annotatorRef.current) trySettingAnnotations();
      }, 1000);
      return;
    } else trySettingAnnotations();
    console.log("step 2");
  }, [annotation, customAnnotations]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Box
        id="svsFrame"
        ref={svsFrameRef}
        sx={{
          flex: "3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Annotorious>
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
                tileSources: tileSourcesUrl as string,
                maxZoomPixelRatio: 2,
              }}
            />
            <OpenSeadragonAnnotationPopup
              popup={(props) => <CommentPopup {...props} />}
            />
          </OpenSeadragonAnnotator>
        </Annotorious>
        <Box
          sx={{
            display: "flex",
            background: "red",
            position: "absolute",
            backgroundColor: "black",
            bottom: theme.spacing(5),
            left: theme.spacing(5),
            padding: theme.spacing(1),
            borderRadius: theme.spacing(1),
          }}
        >
          <Box
            onClick={() => setIsOnlyHNE(true)}
            sx={{
              height: 40,
              background: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isOnlyHNE ? "#0E69FF" : "unset",
              cursor: "pointer",
              borderRadius: theme.spacing(1),
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              marginRight: theme.spacing(1),
            }}
          >
            <Typography
              variant="button"
              sx={{ color: isOnlyHNE ? "white" : "grey", fontWeight: 600 }}
            >
              Only HNE
            </Typography>
          </Box>
          <Box
            onClick={() => setIsOnlyHNE(false)}
            sx={{
              height: 40,
              background: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: !isOnlyHNE ? "#0E69FF" : "unset",
              cursor: "pointer",
              borderRadius: theme.spacing(1),
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            }}
          >
            <Typography
              variant="button"
              sx={{ color: !isOnlyHNE ? "white" : "grey", fontWeight: 600 }}
            >
              With IHC
            </Typography>
          </Box>
        </Box>
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
        <div
          onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
          style={{
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
    </Box>
  );
}

export default SlideView;
