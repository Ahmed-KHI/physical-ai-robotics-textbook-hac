import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroPattern}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            GIAIC Hackathon 2025 • AI-Native Textbook
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Master Physical AI & <span className={styles.gradient}>Humanoid Robotics</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            Transform your skills with ROS 2, NVIDIA Isaac, and Vision-Language-Action models through an intelligent RAG-powered learning platform
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryBtn} to="/docs/intro">
              <span>Start Learning</span>
            </Link>
            <Link className={styles.secondaryBtn} to="/docs/hardware">
              View Requirements
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: '💬',
      title: 'RAG-Powered Chatbot',
      description: 'OpenAI + Qdrant vector database provides intelligent, context-aware answers from course content.',
    },
    {
      icon: '🎯',
      title: 'Adaptive Personalization',
      description: 'Content intelligently adapts to beginner, intermediate, or advanced levels using GPT-3.5-turbo.',
    },
    {
      icon: '🌐',
      title: 'Urdu Translation',
      description: 'Complete Urdu translation with RTL support, preserving technical terms for Pakistani learners.',
    },
    {
      icon: '🧠',
      title: 'Text Selection Queries',
      description: 'Highlight any text and ask questions - AI understands your selected context for precise answers.',
    },
    {
      icon: '⚡',
      title: 'Production Ready',
      description: 'FastAPI backend, React frontend, complete authentication, and Docker-ready deployment architecture.',
    },
    {
      icon: '💰',
      title: 'Cost Optimized',
      description: 'Smart use of GPT-3.5-turbo reduces API costs by 95% while maintaining excellent response quality.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          Why This <span className={styles.gradient}>Platform Stands Out</span>
        </h2>
        <p className={styles.sectionDesc}>Professional AI-native learning designed for maximum productivity</p>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModulesSection() {
  const modules = [
    {
      number: '01',
      weeks: 'Weeks 1-5',
      title: 'ROS 2 Fundamentals',
      description: 'Learn middleware for robot control, nodes, topics, services, parameters, and launch files.',
    },
    {
      number: '02',
      weeks: 'Weeks 6-7',
      title: 'Gazebo & Unity Simulation',
      description: 'Master physics simulation, URDF modeling, sensor simulation, and virtual testing environments.',
    },
    {
      number: '03',
      weeks: 'Weeks 8-10',
      title: 'NVIDIA Isaac Platform',
      description: 'Advanced perception, reinforcement learning, synthetic data generation, and hardware deployment.',
    },
    {
      number: '04',
      weeks: 'Weeks 11-13',
      title: 'Vision-Language-Action Models',
      description: 'Integrate LLMs, voice control, vision models, and build intelligent autonomous humanoid systems.',
    },
  ];

  return (
    <section className={styles.modules}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          Master in <span className={styles.gradient}>13 Weeks</span>
        </h2>
        <p className={styles.sectionDesc}>Progressive training from ROS 2 fundamentals to autonomous humanoid systems</p>
        <div className={styles.modulesGrid}>
          {modules.map((module, idx) => (
            <div key={idx} className={styles.moduleItem}>
              <div className={styles.moduleNumber}>{module.number}</div>
              <div className={styles.moduleWeeks}>{module.weeks}</div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <Link to={`/docs/module-${idx + 1}/intro`}>Learn more</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Learn Physical AI & Humanoid Robotics - Master embodied intelligence with ROS 2, Gazebo, and NVIDIA Isaac">
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <ModulesSection />
      </main>
    </Layout>
  );
}
