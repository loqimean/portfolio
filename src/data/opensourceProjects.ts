export type Registry    = 'rubygems' | 'npm' | null;
export type ProjectType = 'library' | 'project' | 'product' | 'contributed to';

export interface RepoConfig {
  owner: string;
  repo: string;
  /** Override the displayed repo name. */
  displayName?: string;
  /**
   * Package registry to pull download counts from.
   * - 'rubygems' → total all-time downloads from rubygems.org
   * - 'npm'      → yearly downloads from npmjs.com
   * If omitted, GitHub star count is shown instead.
   */
  registry?: Registry;
  /**
   * Package name on the registry, if different from the GitHub repo name.
   * e.g. repo = 'my-gem-repo', packageName = 'my-gem'
   */
  packageName?: string;
  /** Visual badge shown on the project row: 'library' | 'project' | 'product' | 'contributed to' */
  type?: ProjectType;
  /**
   * Static entry (e.g. a product with a private repo): when `url` and
   * `description` are set, nothing is fetched and these values are shown as is.
   */
  url?: string;
  description?: string;
  language?: string;
  /** Not shown on the site yet (unreleased). Preview with PUBLIC_SHOW_HIDDEN=1. */
  hidden?: boolean;
}

/**
 * Your open source projects.
 * Data (description, language) is fetched live from the GitHub API.
 * Download counts are fetched live from the specified registry.
 */
export const OPENSOURCE_PROJECTS: RepoConfig[] = [
  { owner: 'the-rubies-way', repo: 'random-rails', displayName: 'random-rails', registry: 'rubygems', packageName: 'random-rails', type: 'library' },
  { owner: 'the-rubies-way', repo: 'ga4-events',   displayName: 'ga4-events',   registry: 'rubygems', packageName: 'ga4-events', type: 'library' },
  { owner: 'loqimean',       repo: 'fake_picture',  displayName: 'fake_picture', registry: 'rubygems', packageName: 'fake_picture', type: 'library' },
  { owner: 'loqimean',       repo: 'monopay-ruby',  displayName: 'monopay-ruby', registry: 'rubygems', packageName: 'monopay-ruby', type: 'library' },
  { owner: 'loqimean',       repo: 'snowed',         displayName: 'Snowed', registry: null, type: 'product', url: 'https://snowed.app/', language: 'Rust', description: 'Soft snow over your desktop. It piles up on windows and the Dock and slides off when you shake them. Roll snowballs and build snowmen. Native macOS app, Windows next.', hidden: true },
  { owner: 'loqimean',       repo: 'SobriCheck-AI',  displayName: 'SobriCheck AI', registry: null, packageName: 'SobriCheck-AI', type: 'project' },
  { owner: 'sidekiq',        repo: 'sidekiq',        displayName: 'sidekiq',        registry: 'rubygems', packageName: 'sidekiq', type: 'contributed to' },
  { owner: 'faker-ruby',     repo: 'faker',        displayName: 'faker',        registry: 'rubygems', packageName: 'faker', type: 'contributed to' },
  { owner: 'hotwired',       repo: 'turbo',        displayName: 'Hotwired/Turbo',        registry: 'rubygems', packageName: 'turbo', type: 'contributed to' },
  { owner: 'pay-rails',      repo: 'pay',        displayName: 'pay-rails',        registry: 'rubygems', packageName: 'pay', type: 'contributed to' },
  { owner: 'norman',         repo: 'babosa',        displayName: 'babosa',        registry: 'rubygems', packageName: 'babosa', type: 'contributed to' },
  { owner: 'NousResearch',   repo: 'hermes-agent',  displayName: 'Hermes Agent',  registry: null, type: 'contributed to' },
  { owner: 'moonlight-lupin', repo: 'agent-skills',   displayName: 'Hermes Agent Skills', registry: null, type: 'contributed to' },
];
