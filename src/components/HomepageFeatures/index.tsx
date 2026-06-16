import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'React 19',
    Svg: require('@site/static/img/react-logo.svg').default,
    description: (
      <>
        Biblioteca para construir interfaces de usuário com componentes
        reutilizáveis, estado reativo e ecossistema robusto.
      </>
    ),
  },
  {
    title: 'TypeScript',
    Svg: require('@site/static/img/typescript-logo.svg').default,
    description: (
      <>
        Superset do JavaScript que adiciona tipagem estática, facilitando a
        manutenção e escalabilidade do código.
      </>
    ),
  },
  {
    title: 'Vite',
    Svg: require('@site/static/img/vite-logo.svg').default,
    description: (
      <>
        Build tool ultrarrápida para projetos web modernos com hot reload
        instantâneo e suporte nativo a TypeScript.
      </>
    ),
  },
  {
    title: 'Tailwind CSS',
    Svg: require('@site/static/img/tailwind-logo.svg').default,
    description: (
      <>
        Framework CSS utilitário que acelera a estilização com classes
        atômicas e total flexibilidade de design.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className={styles.featureContent}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
