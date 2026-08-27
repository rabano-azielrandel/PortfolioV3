import { GraphQLClient } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_TOKEN;

if (!endpoint) {
  throw new Error("Missing HYGRAPH_ENDPOINT environment variable");
}

export const hygraphClient = new GraphQLClient(endpoint, {
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  next: { revalidate: 86400 },
});
