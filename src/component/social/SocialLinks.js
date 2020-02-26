import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {
  faGithubSquare,
  faTwitterSquare
} from "@fortawesome/free-brands-svg-icons";

import "./Social.css";

export default function SocialLinks({website, github, twitter}) {
    let githubURL = `https://www.github.com/${github}`;
    let twitterURL = `https://www.twitter.com/${twitter}`;
  return (
    <div className="social-wrapper">
      <a href={website}>
        <FontAwesomeIcon className="social-icon" icon={faHome} />
      </a>
      <a href={githubURL}>
        <FontAwesomeIcon className="social-icon" icon={faGithubSquare} />
      </a>
      <a href={twitterURL}>
        <FontAwesomeIcon className="social-icon" icon={faTwitterSquare} />
      </a>
    </div>
  );
}
