"use client";

import Box from "@mui/material/Box";
import "react-chat-elements/dist/main.css";
import "./chatbot.css";
import { Divider, TextField, Typography, useTheme } from "@mui/material";
import { MessageBox } from "react-chat-elements";
import { ChatQuestions, getAnswer } from "./chatQuestions";
import { useEffect, useRef, useState } from "react";

function ChatBox({ slideId }: { slideId: string }) {
  const theme = useTheme();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [filteredChatOptions, setFilteredChatOptions] = useState(ChatQuestions);
  const [chatResponses, setChatResponses] = useState([
    {
      id: "1",
      position: "left",
      type: "text",
      title: "Chat Bot",
      text: "Hi there! Please let me know if you have any questions.",
      date: new Date(),
    },
  ]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 100;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatResponses]);

  return (
    <Box
      sx={{
        height: "calc(100% - 109px)",
        width: "100%",
      }}
    >
      <Box
        ref={chatContainerRef}
        sx={{ height: "calc(65% - 58px)", overflow: "auto" }}
      >
        {chatResponses.map((response) => (
          <MessageBox
            id={response.id}
            key={response.id}
            focus={false}
            titleColor="#0E69FF"
            forwarded={false}
            removeButton={false}
            status={"read"}
            notch={true}
            retracted={false}
            position={response.position}
            title={response.title}
            type="text"
            text={response.text}
            date={response.date}
            replyButton={false}
          />
        ))}
      </Box>
      <Divider
        style={{
          width: "100%",
          height: 2,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.45)",
        }}
        variant="fullWidth"
        orientation="horizontal"
        flexItem
      />

      <Box
        sx={{
          maxHeight: "35%",
          height: "35%",
          overflow: "auto",
          backgroundColor: "#FFF",
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        }}
      >
        {filteredChatOptions.map((question, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Box
              onClick={() => {
                setChatResponses([
                  ...chatResponses,
                  {
                    id: `${chatResponses.length + 1}`,
                    position: "right",
                    type: "text",
                    title: "You",
                    text: question,
                    date: new Date(),
                  },
                ]);
                setTimeout(() => {
                  setChatResponses([
                    ...chatResponses,
                    {
                      id: `${chatResponses.length + 1}`,
                      position: "right",
                      type: "text",
                      title: "You",
                      text: question,
                      date: new Date(),
                    },
                    {
                      id: `${chatResponses.length + 2}`,
                      position: "left",
                      type: "text",
                      title: "Chat Bot",
                      text:
                        getAnswer({ question, imageId: slideId }) ||
                        "Sorry, I do not have an answer for this question.",
                      date: new Date(),
                    },
                  ]);
                }, 1000);
              }}
              sx={{
                border: 1,
                backgroundColor: theme.palette.background.paper,
                padding: theme.spacing(1),
                margin: theme.spacing(0.5),
                borderRadius: 6,
                width: "100%",
                borderColor: "#0E69FF",
                cursor: "pointer",
                maxWidth: "60%",
                alignSelf: "flex-end",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {question}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <TextField
        name="details"
        sx={{
          width: "100%",
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
          alignSelf: "flex-end",
        }}
        multiline={true}
        placeholder="Type your question here..."
        onChange={(event) => {
          const value = event.target.value.toLowerCase();
          setFilteredChatOptions(
            ChatQuestions.filter((question) =>
              question.toLowerCase().includes(value)
            )
          );
        }}
        type="text"
      />
    </Box>
  );
}

export default ChatBox;
