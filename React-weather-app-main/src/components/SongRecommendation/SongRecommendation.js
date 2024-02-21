import React from 'react';
import { useState, useEffect } from 'react';
import './SongRecommendation.css';
import { Col, Row } from "react-bootstrap";
const { Buffer } = require('buffer')

function SongRecommendation(props) {
    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/playlists/";
    const ACCESS_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
    const [tracksData, setTracksData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    var accessToken = ''

    var playlistId = '';

    console.log(`props in song rec: ${props.options.weather[0].main}`)
    console.dir(props)

    playlistId = {
        // ids can be changed and replaced, more lists should be added
        Clear: "5wcIMnhe5fa1IuSul2Q349",
        Clouds: "5YsFFa6GnuJ7YIGRyh306s",
        Smoke: "7MWiSLhNiRaOXhRnFLo9wt",
        Rain: "0qu4MskLUM4hThVXJzxzRp",
        Snow: "7iQ4SQo7LG5ezVKXoeG9oZ",
        Haze: "33WT8BMZqtuV8l7yvd2g9r",
        Drizzle: "7wBB5LF1xfreBTOKNLllx8",
        Mist: "37i9dQZF1DXcBWIGoYBM5M",
        Ash: "172h89NMQRG6EDNIa76Gmq",
        Thunderstorm: "37i9dQZF1DX0kbJZpiYdZl"


    }[props.options.weather[0].main] || '066apfzImqPjDEcZ2crViB';


    const handleGetPlaylists = async () => {
        try {
            const response = await fetch(`${PLAYLISTS_ENDPOINT}${playlistId}/tracks?limit=12`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                // console.dir(response)
                throw new Error('Failed to fetch playlists');

            }

            const data = await response.json();
            setTracks(data.items);
        } catch (error) {
            console.error(error);

        }
    };

    function setTracks(items) {
        const tracks = items.map(({ track }) => ({
            song: track.name,
            artist: track.artists[0].name,
            imageUrl: track.album.images[0].url,
            spotifyUrl: track.external_urls.spotify

        }))
        organizeInRows(tracks);

    }
    // right now its 12 songs in total and 4 songs in one row
    function organizeInRows(tracks) {
        const tracksRows = [];
        for (var i = 0; i < tracks.length; i += 4) {
            tracksRows.push(tracks.slice(i, i + 4));
        }
        setTracksData(tracksRows);
        setIsLoaded(true)
    }


    useEffect(() => {
        const getToken = async () => {
            console.log("clientID: ", process.env.REACT_APP_SPOTIFY_CLIENT_ID2)
            const auth = Buffer.from(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID2}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET2}`, 'utf-8').toString('base64');
            const response = await fetch(ACCESS_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${auth}`
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            console.log("data:", data)
            accessToken = data.access_token

            if (accessToken) {
                handleGetPlaylists()
            } else {
                console.log(`AccessToken: ${accessToken}`)
            }

        }
        getToken();
    }, [props, playlistId]);

    //reload button in progress
    const handleReloadSongs = async (accessToken) => {
        setIsLoaded(false);
        try {
            playlistId = "7wBB5LF1xfreBTOKNLllx8"
            console.log("accessToken:!!!", accessToken)
            await handleGetPlaylists();
        } catch (error) {
            console.log(error.message);
        }
        setIsLoaded(true);
    };




    return (
        <div className='recommendedSongs'>
            {/* <h2>Songs based on the forecast</h2> */}
            {/* <button onClick={handleReloadSongs}>Reload Songs</button> */}
            {!isLoaded && <h2>Loading...</h2>}



            {isLoaded && (
                <div className="tracks-container">
                    {
                        tracksData && (tracksData.map((singleRow, i) => (
                            <Row className="tracks-row" key={i}>
                                {
                                    singleRow.map((singleTrack, j) => (
                                        <Col xs={12} sm={6} md={3} lg={3} fluid="true" className="d-flex align-items-center justify-content-center track-card" key={j}>
                                            <div className="card">
                                                <div className="overlayer">

                                                </div>
                                                <a target="_blank" href={singleTrack.spotifyUrl} rel="noreferrer">
                                                    <img className="track-image" src={singleTrack.imageUrl} alt="Cover of the track" />
                                                </a>
                                                <div>
                                                    <h6 className="track-title">{singleTrack.song}</h6>
                                                    <h6 className="track-artist">{singleTrack.artist}</h6>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                            </Row>
                        )))}
                </div>
            )}
        </div>
    )
}

export default SongRecommendation
