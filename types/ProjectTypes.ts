// Raw Hygraph response shapes (mirrors the GraphQL query)
export interface RawProject {
  projectName: string;
  projectDescription: {
    html: string;
  };
  techStacks: string[];
  githubLink: string;
  liveSite: string;
  projectImage: {
    url: string;
  } | null;
}

export interface RawProjectList {
  kicker: string;
  displayHeading: string;
  serifDeck: {
    html: string;
  };
  projects: RawProject[];
}

export interface GetProjectsResponse {
  projectList: RawProjectList | null;
}

// Processed shapes used by components
export interface ProcessedProject {
  projectName: string;
  projectDescription: string;
  techStacks: string[];
  githubLink: string;
  liveSite: string;
  projectImage: string;
}

export interface ProcessedProjectList {
  kicker: string;
  displayHeading: string;
  serifDeck: string;
  projects: ProcessedProject[];
}
