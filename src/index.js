import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Resumable from "resumablejs";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Paper from "@material-ui/core/Paper";

// 文件切片
// 按序上传
// 计算进度条
// 出错暂停 可重传
// 手动暂停重传
// 并发上传多个切片
function App() {
  const [progress, setProgress] = React.useState(10);

  const [files, setFiles] = React.useState([]);
  const uploadBtn = useRef();
  const uploadSquare = useRef();
  const resumableClient = useRef();
  React.useEffect(() => {
    resumableClient.current = new Resumable({
      target: "/api/photo/redeem-upload-token",
      query: { upload_token: "my_token" }
    });
    uploadBtn && resumableClient.current.assignBrowse(uploadBtn.current);
    uploadSquare && resumableClient.current.assignDrop(uploadSquare.current);

    resumableClient.current.on("fileAdded", function (file, event) {
      console.log(file);
      setFiles((pre) => [...pre, file]);
    });
    resumableClient.current.on("fileSuccess", function (file, message) {
      console.log("fileSuccess");
    });
    resumableClient.current.on("fileError", function (file, message) {
      console.log("fileError");
    });
    resumableClient.current.on("progress", function (file, message) {
      console.log("progress");
    });
    resumableClient.current.on("uploadStart", function (file, message) {
      console.log("uploadStart");
    });
  }, [uploadBtn]);
  React.useEffect(() => {
    // const timer = setInterval(() => {
    //   setProgress((prevProgress) =>
    //     prevProgress >= 100 ? 0 : prevProgress + 10
    //   );
    // }, 800);
    // return () => {
    //   clearInterval(timer);
    // };
  }, []);
  const handleStartUpload = (file) => {
    file.retry();
  };
  const handlePause = () => {};
  return (
    <div>
      <Button ref={uploadBtn} variant="contained" color="primary">
        文件 + 1
      </Button>
      <Paper
        ref={uploadSquare}
        variant="outlined"
        square
        style={{ width: 50, height: 50, margin: 20 }}
      >
        拖拽上传
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          resumableClient.current.upload();
        }}
      >
        resumableClient
      </Button>
      {files.map((file) => {
        const {
          fileName,
          uniqueIdentifier,
          chunks,
          isPaused,
          isUploading,
          progress,
          abort,
          isComplete,
          size
        } = file;
        return (
          <div key={uniqueIdentifier}>
            {fileName}

            {resumableClient.current.progress()}
            <span>大小：{size}</span>
            <PauseCircleOutlineIcon onClick={() => handlePause(file)} />
            <PlayCircleOutlineIcon onClick={() => handleStartUpload(file)} />
            {isUploading() && <LinearProgressWithLabel value={progress} />}
            {isComplete() && "上传成功"}
            {isPaused() && "已暂停"}
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));
