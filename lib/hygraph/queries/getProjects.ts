import { gql } from "graphql-request";
import { hygraphClient } from "@/lib/hygraph/client";
import { GetProjectsResponse, ProcessedProjectList } from "@/types/ProjectTypes";

const GET_PROJECTS_QUERY = gql`
  query GetProjects($slug: String!) {
    projectList(where: { slug: $slug }) {
      kicker
      displayHeading
      serifDeck {
        html
      }
      projects {
        projectName
        projectDescription {
          html
        }
        techStacks
        githubLink
        liveSite
        projectImage {
          url
        }
      }
    }
  }
`;

interface GetProjectsVariables {
  slug: string;
}

const NO_IMAGE_FALLBACK = "/images/no-image.png";

export async function getProjects(
  slug: string,
): Promise<ProcessedProjectList | null> {
  try {
    const data = await hygraphClient.request<
      GetProjectsResponse,
      GetProjectsVariables
    >(GET_PROJECTS_QUERY, { slug });

    const projectList = data.projectList;
    if (!projectList) return null;

    const processedData: ProcessedProjectList = {
      kicker: projectList.kicker ?? "",
      displayHeading: projectList.displayHeading ?? "",
      serifDeck: projectList.serifDeck?.html ?? "",
      projects: projectList.projects.map((project) => ({
        projectName: project.projectName,
        projectDescription: project.projectDescription?.html ?? "",
        techStacks: project.techStacks ?? [],
        githubLink: project.githubLink,
        liveSite: project.liveSite,
        projectImage: project.projectImage?.url ?? NO_IMAGE_FALLBACK,
      })),
    };

    return processedData;
  } catch (error) {
    console.error("Hygraph Fetch Error:", error);
    throw new Error(`Failed to fetch data: ${error}`);
  }
}
