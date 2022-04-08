import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteSavedEpisode } from "../store/savedEpisodes";
import { motion } from "framer-motion";
import { pageTransition } from "..";
import toast, { Toaster } from "react-hot-toast";
import { getPodLinkClass } from "./utils/utils";

class SavedEpisodes extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
    };
  }

  render() {
    const { userId, savedEpisodes, deleteSavedEpisode } = this.props;
    const notify = () =>
      toast("Successfully removed from favorites!", {
        position: "top-right",
      });
    return (
      <>
        <motion.div
          initial="out"
          exit="out"
          animate="in"
          variants={pageTransition}
        />
        <h1>Favorite Episodes:</h1>

        <div className="row p-5 m-2 ">
          {savedEpisodes?.map((saved) => {
            return (
              <div className="col" key={saved.episode.id}>
                <div
                  className="card"
                  style={{ width: "17rem" }}
                  onClick={() => this.setState({ id: saved.episode.id })}
                >
                  <img
                    src={saved.episode.images[1].url}
                    alt="podcastimg"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5
                      className="card-title pod-link-title"
                      style={{ textAlign: "center" }}
                    >
                      <Link
                        to={`/episode/${saved.episode.id}`}
                        className={getPodLinkClass(saved.episode.name, 262)}
                      >
                        <span
                          id="savedName"
                          style={{ fontWeight: "bold", color: "white" }}
                        >
                          {saved.episode.name}
                        </span>
                      </Link>
                    </h5>
                    <div
                      className="card-text"
                      style={{ padding: "none", margin: "none" }}
                    >
                      <button
                        id="deleteButton"
                        style={{
                          background: "none",
                          border: "none",
                          padding: "none",
                          color: "white",
                        }}
                        onClick={() => {
                          deleteSavedEpisode({
                            id: saved.episode.id,
                            userId: userId,
                          });
                          {
                            notify();
                          }
                        }}
                      >
                        <span style={{ color: "white" }}>
                          <i
                            className="bi bi-trash3"
                            style={{ fontSize: "25px", padding: "none" }}
                          ></i>
                        </span>
                      </button>
                      <Toaster />
                      <button
                        id="epiClick"
                        style={{
                          background: "none",
                          border: "none",
                          padding: "none",
                        }}
                      >
                        {" "}
                        <span style={{ color: "white" }}>
                          {" "}
                          <i
                            className="bi bi-arrow-bar-right fa-5x"
                            id="savedIcon"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </span>{" "}
                        {/* </Link> */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    savedEpisodes: state.savedEpisodes,
    userId: state.auth.id,
  };
};

const mapDispatchToProps = { deleteSavedEpisode };

export default connect(mapStateToProps, mapDispatchToProps)(SavedEpisodes);
