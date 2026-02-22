export type { RepoConfig } from '../../data/opensourceProjects';

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface RegistryStat {
  count: number;
  /** Short label shown below the number, e.g. "RubyGems", "npm / yr" */
  label: string;
}

export interface Project extends GitHubRepo {
  displayName?: string;
  type?: import('../../data/opensourceProjects').ProjectType;
  /** Download / install count from a package registry, if configured. */
  stat: RegistryStat | null;
  /** Fallback: GitHub stars used when no registry is configured. */
  stars: number;
}
