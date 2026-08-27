export interface Project {
  projectName: string;
  projectDescription: {
    html: string;
  };
  techStacks: string[];
  githubLink: string;
  liveSite: string;
  projectImage: {
    url: string;
  };
}

export interface ProjectList {
  kicker: string;
  displayHeading: string;
  serifDeck: {
    html: string;
  };
  projects: Project[];
}
