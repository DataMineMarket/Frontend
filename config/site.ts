// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
interface SiteConfig {
  name: string
  title: string
  emoji: string
  description: string
  localeDefault: string
  links: {
    docs: string
    discord: string
    twitter: string
    github: string
  }
}

export const SITE_CANONICAL = "https://datanexusverse.vercel.app/"

export const siteConfig: SiteConfig = {
  name: "Data Nexus",
  title: "Decentralised Data Hub",
  emoji: "🌌",
  description:
    "Democratising Data Acquisition and Ownership.",
  localeDefault: "en",
  links: {
    docs: "https://github.com/DataMineMarket/DataNexusContracts/",
    discord: "https://discord.gg/U4jy7Xfh76",
    twitter: "https://twitter.com/district_labs",
    github: "https://github.com/DataMineMarket/Frontend",
  },
}

export const DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fturbo-eth%2Ftemplate-web3-app&project-name=TurboETH&repository-name=turbo-eth&demo-title=TurboETH&env=NEXTAUTH_SECRET,DATABASE_URL&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fturbo-eth%2Ftemplate-web3-app%2Fblob%2Fintegrations%2F.env.example"
