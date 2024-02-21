import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useSpotifyContext } from "../store/SpotifyContext";
import { Modal } from "react-bootstrap";
import SongRecommendation from "./SongRecommendation/SongRecommendation";
import { useWeatherContext } from "../store/WeatherContext";
import "./AirQuality/AirQuality.css";

export default function MusicPlayer() {
  const {
    token,
    player,
    scope,
    logout,
    is_paused,
    AUTH_ENDPOINT,
    CLIENT_ID,
    REDIRECT_URI,
    RESPONSE_TYPE,
    img,
  } = useSpotifyContext();

  const { results } = useWeatherContext();
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Grid
      xs={3}
      position={"relative"}
      paddingRight={"28px"}
      paddingTop={"10px"}
    >
      {!token ? (
        <div className="tooltip2" style={{ paddingTop: "15px" }}>
          <Button onClick={() => setShowModal(true)}>
            {
              <img
                height={"27px"}
                src={process.env.PUBLIC_URL + "./pngegg.png"}
              />
            }
          </Button>
          <span className="tooltiptext">Song Recommendations</span>
        </div>
      ) : (
        <Grid xs={12} container direction={"row"}>
          <Grid xs={6} container direction={"row"} paddingTop={"15px"}>
            <Grid xs={6}>
              {" "}
              {!is_paused ? (
                <Button width={"30px"}>
                  <PauseIcon
                    onClick={() => player.pause()}
                    sx={{ color: "rgb(191,178,232)" }}
                  ></PauseIcon>
                </Button>
              ) : (
                <Button width={"30px"}>
                  <PlayArrowIcon
                    onClick={() => player.resume()}
                    sx={{ color: "rgb(191,178,232)" }}
                  ></PlayArrowIcon>
                </Button>
              )}
            </Grid>
            <Grid xs={6}>
              <Button
                minwidth={"30px"}
                maxwidth={"30px"}
                onClick={() => {
                  player.nextTrack();
                }}
              >
                <SkipNextIcon
                  sx={{
                    color: "rgb(191,178,232)",
                  }}
                ></SkipNextIcon>
              </Button>
            </Grid>
          </Grid>
          <Grid className="tooltip2" xs={6}>
            <Button onClick={() => setShowModal(true)}>
              {img !== "" ? (
                <img height={"58px"} src={img} />
              ) : (
                <img
                  height={"27px"}
                  src={process.env.PUBLIC_URL + "./pngegg.png"}
                />
              )}
            </Button>
            <span className="tooltiptext-2">Songs</span>
          </Grid>
        </Grid>
      )}
      <Grid xs={0}>
        <div className="songRec">
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            className="my-modal modal-two"
            style={{ width: "90vw" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Songs based on the Forecast</Modal.Title>
              <div style={{ paddingLeft: "20px" }}></div>
              {!token ? (
                <a
                  href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`}
                >
                  <Button
                    variant={"contained"}
                    size={"small"}
                    color={"secondary"}
                  >
                    Login to premium
                  </Button>
                </a>
              ) : (
                <Button
                  variant={"contained"}
                  size={"small"}
                  color={"secondary"}
                  onClick={logout}
                >
                  Logout
                </Button>
              )}
            </Modal.Header>
            <Modal.Body>
              {results && <SongRecommendation options={results} />}
            </Modal.Body>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
}
