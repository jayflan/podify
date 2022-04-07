import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { addSavedEpisode } from "../store/savedEpisodes";

const SinglePodcast = () => {
  const auth = useSelector((state) => state.auth) || {};

  // const topChartNames = useSelector((state) => state.topCharts) || {};
  // console.log(topChartNames, "------->>");

  const { id } = useParams();
  // console.log(auth.access_token);
  // console.log(id);
  // console.log(match)

  const [episodes, setEpisodes] = useState([]);
  const [podcast, setPodcast] = useState({});
  const [podcastImage, setPodcastImage] = useState("");

  useEffect(() => {
    const fetchEpisodes = async () => {
      const episodes = (
        await axios.get(`https://api.spotify.com/v1/shows/${id}/episodes`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${auth.access_token}`,
          },
        })
      ).data;

      const findPodcast = (
        await axios.get(`https://api.spotify.com/v1/shows/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${auth.access_token}`,
          },
        })
      ).data;

      console.log(findPodcast.name, "-------->");

      setEpisodes(episodes.items);
      setPodcast(findPodcast);
      // setPodcastImage(findPodcast.images[0].url)
      // console.log(findPodcast);
      // console.log(episodes)
    };
    fetchEpisodes();
    // setEpisodes(episodes.items)
  }, []);

  // console.log(podcastImage)
  // console.log('podcastIMAGE', podcast.images)

  const dispatch = useDispatch();

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontWeight: 400 }}> {podcast.name}</h1>
        <h4 className="ms-3 mt-4">About</h4>
        <div className="ms-3">{podcast.description}</div>
        <div className=" row p-5 m-2">
          {episodes.map((episode, idx) => (
            <div className="col-lg-2" id="mainCard" key={idx}>
              <div className="card">
                <button
                  className="x-icon"
                  onClick={() =>
                    dispatch(addSavedEpisode({
                      id: episode.id,
                      userId: auth.id,
                    }))
                  }
                >
                  +
                </button>
                <img
                  src={episode.images[0].url}
                  alt="podcastimg"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ textAlign: "center" }}>
                    <Link
                      to={`/episode/${episode.id}`}
                      className="stretched-link"
                    >
                      <span
                        style={{
                          color: "white",
                          fontWeight: 400,
                        }}
                      >
                        {episode.name}
                      </span>
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SinglePodcast;
