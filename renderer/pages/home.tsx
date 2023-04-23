import React from "react";
import Head from "next/head";
import { ipcRenderer } from "electron";

function Home() {
  const [appVersion, setAppVersion] = React.useState("0.0.1");
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [donwloadAvailable, setDownloadAvailable] = React.useState(false);

  React.useEffect(() => {
    ipcRenderer.on("app_version", (event, arg) => {
      setAppVersion(arg.version);
    });

    ipcRenderer.on("update_available", () => {
      setUpdateAvailable(true);
    });

    ipcRenderer.on("update_downloaded", () => {
      setDownloadAvailable(true);
    });

    return () => {
      ipcRenderer.removeAllListeners("app-version");
      ipcRenderer.removeAllListeners("update-available");
      ipcRenderer.removeAllListeners("update-downloaded");
    };
  }, []);

  function closeNotification() {
    setUpdateAvailable(false);
    setDownloadAvailable(false);
  }

  function restartApp() {
    setDownloadAvailable(false);
    ipcRenderer.send("restart-app");
  }

  return (
    <React.Fragment>
      <Head>
        <title>Auto Updater Test</title>
      </Head>

      <div className="flex flex-col justify-center items-center h-screen w-full gap-4">
        <div>Version: {appVersion}</div>

        <div
          className={updateAvailable || donwloadAvailable ? "block" : "hidden"}
        >
          <button
            className={!updateAvailable && "hidden"}
            onClick={closeNotification}
          >
            Close
          </button>

          <button
            className={!donwloadAvailable && "hidden"}
            onClick={restartApp}
          >
            Restart
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
