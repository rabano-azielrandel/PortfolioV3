import { gql } from "graphql-request";
import { hygraphClient } from "@/lib/hygraph/client";
import { ProjectList } from "@/types/ProjectTypes";

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

interface GetProjectsResponse {
  projectList: ProjectList | null;
}

export async function getProjects(slug: string) {
  const data = await hygraphClient.request<GetProjectsResponse>(
    GET_PROJECTS_QUERY,
    { slug }
  );

  return data.projectList;
}
