import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContainer}>
        <div className={styles.heroLogos}>
          <img src="/img/react-logo.svg" alt="React" className={styles.heroLogo} />
          <span className={styles.heroPlus}>+</span>
          <img src="/img/typescript-logo.svg" alt="TypeScript" className={styles.heroLogo} />
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={styles.primaryButton} to="/docs/intro">
            Começar o Guia
          </Link>
          <Link className={styles.secondaryButton} to="/blog">
            Blog
          </Link>
        </div>
        <div className={styles.techBadges}>
          <span className={styles.badge}>React 19</span>
          <span className={styles.badge}>TypeScript</span>
          <span className={styles.badge}>Vite</span>
          <span className={styles.badge}>Tailwind CSS</span>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Guia prático de aprendizado sobre React, TypeScript e ecossistema front-end.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
