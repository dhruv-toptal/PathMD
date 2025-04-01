"use client";

import { useTranslation } from "@/services/i18n/client";
import "@annotorious/openseadragon/annotorious-openseadragon.css";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";

import {
  ReportsResponse,
  useGetReportsService,
  useUpdateReportsService,
} from "@/services/api/services/report";
import { Report } from "@/services/api/types/report";
import {
  alpha,
  Button,
  Checkbox,
  Divider,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhotoSelectIcon from "@/assets/photo-select.png";
import BookIcon from "@/assets/book.png";
import SeamlessIcon from "@/assets/seamless.png";
import ToggleIcon from "@/assets/toggle.png";
import LookIcon from "@/assets/look.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SlideView from "./SlideView";
import Slides from "./Slide";
import ChatBox from "./ChatBox";
import { extractImageName } from "./chatQuestions";
import { convertXML } from "simple-xml-to-json";
import { downloadFile } from "@/services/helpers/download";

function Patient() {
  const { t: tPatient } = useTranslation("patient");
  const theme = useTheme();
  const fetchReports = useGetReportsService();
  const updateReport = useUpdateReportsService();
  const [selectedSlides, setSelectedSlides] = useState<any>([]);
  const [showSlides, setShowSlides] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [reports, setReports] = useState<Report[] | undefined>();
  const sideViewRef = useRef<HTMLDivElement | null>(null);
  const [sideViewWidth, setSideViewWidth] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [annotation, setAnnotation] = useState<any>();
  const [percentageOfAnnotation, setPercentageOfAnnotation] = useState(0);
  const [customAnnotations, setCustomAnnotations] = useState<any>([]);
  const [annotationsToHide, setAnnotationsToHide] = useState<string[]>([]);

  const aiAnnotations = {
    ...annotation,
    regions: [
      annotation?.regions[0]
        ? annotation?.regions[0].slice(
            0,
            percentageOfAnnotation === 0
              ? 0
              : Math.max(
                  1,
                  Math.floor(
                    annotation?.regions[0].length * percentageOfAnnotation
                  )
                )
          )
        : [],
    ],
  };

  useEffect(() => {
    const downloadReports = async () => {
      const { status, data } = await fetchReports({ page: 0, limit: 100 });
      if (data && status === 200) {
        const reports = (data as ReportsResponse).data;
        setReports(reports);
        if (reports[0].annotations)
          setCustomAnnotations(JSON.parse(reports[0].annotations));
      }
    };
    downloadReports();
  }, []);

  useEffect(() => {
    setSideViewWidth(sideViewRef?.current?.offsetWidth || 0);
  }, [sideViewRef?.current?.offsetWidth]);

  useEffect(() => {
    const downloadAnnotations = async () => {
      if (!selectedSlides[selectedSlideIndex].annotationsUrl) return;
      const response = await fetch(
        selectedSlides[selectedSlideIndex].annotationsUrl as string
      );
      const text = await response.text();
      const jsonDoc = convertXML(text);

      const annotations = jsonDoc.Annotations.children.map((c) => ({
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
      setAnnotation(annotations[0]);
    };
    if (!selectedSlides[selectedSlideIndex]) {
      setAnnotation(undefined);
    } else downloadAnnotations();
  }, [selectedSlides, selectedSlideIndex]);

  console.log({ id: reports?.[0].id });
  return (
    <Box
      sx={{
        flex: "1",
        display: "flex",
        height: "calc(100vh - 64px)",
        overflow: "hidden", // Hide any overflow from the container
      }}
    >
      {showSlides && (
        <Box
          sx={{
            flex: "3",
            overflowY: "auto",
            paddingTop: theme.spacing(2),
            paddingLeft: theme.spacing(4),
          }}
        >
          <SlideView
            onCustomAnnotationsChange={(a) => {
              setCustomAnnotations(a);
              const id = reports?.[0].id;
              console.log({ id });
              if (!id) return;
              updateReport({
                id: id as string,
                annotations: JSON.stringify(a) as string,
              });
            }}
            customAnnotations={customAnnotations.filter(
              (a: any) => !annotationsToHide.includes(a.id)
            )}
            annotation={aiAnnotations}
            tileSourcesUrl={selectedSlides[selectedSlideIndex].tileSourcesUrl}
            isDrawingEnabled={isDrawingEnabled}
          />
        </Box>
      )}

      {!showSlides && (
        <Box
          sx={{
            flex: "3",
            overflowY: "auto", // Enable vertical scrolling
            paddingTop: theme.spacing(2),
            paddingLeft: theme.spacing(4),
          }}
        >
          <Typography variant="h5" fontWeight={800}>
            {tPatient("slides")}
          </Typography>
          <Box>
            {reports?.map((report) => (
              <Box
                key={report.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: theme.spacing(),
                }}
              >
                {report.slides?.map((slide, slideIndex) => (
                  <Box
                    key={`${slide.title}-${slideIndex}`}
                    style={{ marginBottom: theme.spacing(2) }}
                  >
                    <Typography variant="subtitle2" fontWeight={800}>
                      {slide.title}
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {slide.images?.map((image, imageIndex) => (
                        <Box
                          key={`${image.title}${imageIndex}`}
                          onClick={() => {
                            if (
                              selectedSlides.find(
                                (i) => i.id === `${slideIndex}-${imageIndex}`
                              )
                            ) {
                              setSelectedSlides(
                                selectedSlides.filter(
                                  (i) => i.id !== `${slideIndex}-${imageIndex}`
                                )
                              );
                            } else
                              setSelectedSlides([
                                ...selectedSlides,
                                { ...image, id: `${slideIndex}-${imageIndex}` },
                              ]);
                          }}
                          style={{
                            width: 120,
                            height: 225,
                            border: `1px solid rgba(0, 0, 0, 0.12)`,
                            backgroundColor: selectedSlides
                              .map((i) => i.id)
                              .includes(`${slideIndex}-${imageIndex}`)
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
                                color:
                                  selectedSlides
                                    .map((i) => i.id)
                                    .includes(`${slideIndex}-${imageIndex}`) &&
                                  "white",
                              }}
                            >
                              {image.title}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      onClick={() => {
                        downloadFile(
                          "https://pathmd.s3.us-east-2.amazonaws.com/assets/report.docx"
                        );
                      }}
                      style={{
                        display: "inline-flex",
                        border: "1px solid #0E69FF",
                        alignSelf: "flex-start",
                        padding: theme.spacing(),
                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        style={{ color: "#0E69FF" }}
                      >
                        {tPatient("viewReport")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box
        ref={(ref: HTMLDivElement) => {
          sideViewRef.current = ref;
        }}
        sx={{
          border: "solid",
          borderWidth: 0,
          borderLeftWidth: 2,
          borderColor: "rgba(0, 0, 0, 0.12)",
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <Box
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              height: 60,
              minHeight: 60,
              maxHeight: 60,
              display: "flex",
              alignItems: "center",
            }}
          >
            {showSlides && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: theme.spacing(2) }}
                onClick={() => {
                  setShowSlides(false);
                  setSelectedTab(0);
                  setSelectedSlides([]);
                }}
              >
                <Typography variant="subtitle2" fontWeight={800}>
                  {tPatient("back")}
                </Typography>
              </Button>
            )}
          </Box>
          <Divider
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            }}
            variant="fullWidth"
            orientation="horizontal"
            flexItem
          />
          <Tabs
            value={selectedTab}
            onChange={(_, tabIndex) => setSelectedTab(tabIndex)}
            variant="fullWidth"
            sx={{ width: "100%" }}
          >
            <Tab label={tPatient("annotation")} value={0} />
            {showSlides && <Tab label={tPatient("aiAssistant")} value={1} />}
            {showSlides && <Tab label={tPatient("chatBot")} value={2} />}
          </Tabs>
          {selectedTab === 0 && (
            <>
              {showSlides && (
                <Slides
                  selectedSlideIndex={selectedSlideIndex}
                  slides={selectedSlides}
                  onClick={(index) => setSelectedSlideIndex(index)}
                  width={sideViewWidth - 32}
                />
              )}
              <Box
                sx={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  padding: theme.spacing(2),
                  overflowY: "auto",
                }}
              >
                {[
                  {
                    title: "Case Notes",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo sollicitudin pulvinar. Nam pellentesque dignissim mi vitae eleifend. Nullam et mauris volutpat, dignissim arcu in, pellentesque dui. Praesent non laoreet metus, in auctor turpis.",
                  },
                  {
                    title: "Radiology Notes",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo sollicitudin pulvinar. Nam pellentesque dignissim mi vitae eleifend.",
                  },
                  {
                    title: "Current Therapy",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo sollicitudin pulvinar. Nam pellentesque dignissim mi vitae eleifend.",
                  },
                  {
                    title: "Known Medications",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo sollicitudin pulvinar. Nam pellentesque dignissim mi vitae eleifend.",
                  },
                  showSlides
                    ? {
                        title: `Annotations (${customAnnotations?.length || 0})`,
                        showCheckbox: true,
                        description:
                          `${customAnnotations?.map((r) => r.id)}`.replaceAll(
                            ",",
                            "\n"
                          ),
                      }
                    : undefined,
                ]
                  .filter((i) => !!i)
                  .map((item) => (
                    <Accordion style={{ boxShadow: "unset" }} key={item.title}>
                      <AccordionSummary
                        style={{
                          backgroundColor: "#F1F2F5",
                          border: 0,
                          minHeight: 0,
                        }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="case-notes-content"
                        id="case-notes-header"
                      >
                        <Typography variant="body1" fontWeight={800}>
                          {item.title}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        style={{ backgroundColor: "#F1F2F5", border: 0 }}
                      >
                        {!!item.showCheckbox ? (
                          item.description
                            .split("\n")
                            .filter((line) => !!line)
                            .map((line, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: theme.spacing(1),
                                }}
                              >
                                <Checkbox
                                  size="small"
                                  checked={
                                    !annotationsToHide.includes(line) || false
                                  }
                                  onChange={(e) => {
                                    setAnnotationsToHide((prev) => {
                                      if (e.target.checked) {
                                        return prev.filter((l) => l !== line);
                                      } else {
                                        return [...annotationsToHide, line];
                                      }
                                    });
                                  }}
                                />
                                <Typography variant="body2">{line}</Typography>
                              </Box>
                            ))
                        ) : (
                          <Typography variant="body2">
                            {item.description}
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </Box>

              {selectedSlides.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginBottom: theme.spacing(4),
                  }}
                >
                  <Divider
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      marginBottom: theme.spacing(2),
                    }}
                    variant="fullWidth"
                    orientation="horizontal"
                    flexItem
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: theme.spacing(2),
                      paddingRight: theme.spacing(2),
                    }}
                  >
                    {!showSlides && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ marginRight: theme.spacing(2) }}
                          onClick={() => setShowSlides(true)}
                        >
                          <Typography variant="subtitle2" fontWeight={800}>
                            {tPatient("viewSelectedSlides", {
                              count: selectedSlides.length,
                            })}
                          </Typography>
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setSelectedSlides([])}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={800}
                            // style={{ color: "#0E69FF" }}
                          >
                            {tPatient("Unselect All")}
                          </Typography>
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
          {selectedTab === 1 && (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
                marginTop: theme.spacing(2),
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="h5"
                data-testid="home-title"
                gutterBottom
                sx={{ fontWeight: 800 }}
              >
                {tPatient("ai-title")}
              </Typography>
              <Typography
                variant="h6"
                data-testid="home-title"
                gutterBottom
                sx={{ color: "grey" }}
              >
                {tPatient("ai-description")}
              </Typography>
              {[
                {
                  image: PhotoSelectIcon,
                  title: "Highlight areas of interest",
                  backgroundColor: "#9068D033",
                  onClick: () =>
                    percentageOfAnnotation === 1
                      ? setPercentageOfAnnotation(0)
                      : setPercentageOfAnnotation(1),
                },
                {
                  image: ToggleIcon,
                  title:
                    "Select areas with precision annotation confidence of <75%",
                  backgroundColor: "#D84C1033",
                  onClick: () =>
                    percentageOfAnnotation === 0.75
                      ? setPercentageOfAnnotation(0)
                      : setPercentageOfAnnotation(0.75),
                },
                {
                  image: ToggleIcon,
                  title:
                    "Select areas with precision annotation confidence of 75% - 85%",
                  backgroundColor: "#D84C1033",
                  onClick: () =>
                    percentageOfAnnotation === 0.5
                      ? setPercentageOfAnnotation(0)
                      : setPercentageOfAnnotation(0.5),
                },
                {
                  image: ToggleIcon,
                  title:
                    "Select areas with precision annotation confidence of >80%",
                  backgroundColor: "#D84C1033",
                  onClick: () =>
                    percentageOfAnnotation === 0.3
                      ? setPercentageOfAnnotation(0)
                      : setPercentageOfAnnotation(0.3),
                },
                {
                  image: SeamlessIcon,
                  title:
                    "Compare the annotation with or without earlier follow-ups and update the annotations accordingly",
                  backgroundColor: "#0084FF33",
                  onClick: () => {
                    setIsDrawingEnabled(true);
                    setSelectedTab(0);
                  },
                },
                {
                  image: LookIcon,
                  title:
                    "Search for outcomes in patients of similar age, PSA, and diagnosis using ClinicalTrial.gov",
                  backgroundColor: "#FEAB4933",
                },
                {
                  image: BookIcon,
                  title: "Generate report",
                  backgroundColor: "#52BA6933",
                  onClick: () =>
                    downloadFile(
                      "https://pathmd.s3.us-east-2.amazonaws.com/assets/report.docx"
                    ),
                },
              ].map((item) => (
                <Box
                  key={item.title}
                  onClick={item.onClick}
                  sx={{
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      padding: theme.spacing(1),
                      flex: 1,
                      marginLeft: theme.spacing(2),
                      marginRight: theme.spacing(2),
                      marginBottom: theme.spacing(2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#F3F5F7",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          minWidth: 50,
                          minHeight: 50,
                          maxWidth: 50,
                          maxHeight: 50,
                          padding: theme.spacing(1),
                          overflow: "hidden",
                          background: item.backgroundColor,
                          borderRadius: theme.spacing(1),
                          marginRight: theme.spacing(2),
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={32}
                          height={32}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon
                      sx={{
                        color: "#6C727580",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          {selectedTab === 2 && (
            <ChatBox
              slideId={
                extractImageName(selectedSlides[selectedSlideIndex].url) || ""
              }
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Patient;
