export const downloadFile = (fileURL: string) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = fileURL;
  downloadLink.download = "example.txt";
  downloadLink.target = "_blank";
  document.body.appendChild(downloadLink);
  downloadLink.click();
};
