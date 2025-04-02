import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

import WinIcon from "@site/src/icons/Windows11.svg";
import ArchIcon from "@site/src/icons/ArchLinux.svg";
import DebianIcon from "@site/src/icons/Debian.svg";
import TsIcon from "@site/src/icons/Typescript.svg";
import PostgreIcon from "@site/src/icons/PostgreSQL.svg";
import ReactIcon from "@site/src/icons/React.svg";
import NextjsIcon from "@site/src/icons/Nextjs.svg";
import GraphqlIcon from "@site/src/icons/Graphql.svg";
import RustIcon from "@site/src/icons/Rust.svg";
import PythonIcon from "@site/src/icons/Python.svg";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={`hero hero--primary ${styles.heroBanner}`}>
      <div className="container">
        <Heading
          as="h1"
          className={`hero__title text--bold ${styles.heroTitle}`}
        >
          <span className={styles.titleCursor}>{siteConfig.title}</span>
        </Heading>
        <p className={`hero__subtitle ${styles.heroTitle}`}>
          {siteConfig.tagline}
          <br />
          猫猫要把所有美好的事物都记录下来
        </p>
        <div className={styles.entrance}>
          <div className={styles.entranceItem}>
            <Link className="button button--secondary button--lg" to="/docs/">
              文档
            </Link>
          </div>
          <div className={styles.entranceItem}>
            <Link className="button button--secondary button--lg" to="/blog">
              博客
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const emojis = [
  "(∠・ω<)⌒★",
  "(*´∀`)~♥",
  "ᕕ ( ᐛ ) ᕗ",
  "_(:3 ⌒ﾞ)_",
  "(σﾟ∀ﾟ)σ..:*☆",
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      // 标题，将会放置于 head 标签中
      // title={siteConfig.title}
      // 描述，将会放置于 head 标签中
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main>
        <div className={styles.mainContainer}>
          <div className={`${styles.authorCard}`}>
            <div className="card shadow--md">
              <div className="card__image margin--lg">
                <img
                  src="/img/avatar.svg"
                  alt="Image alt text"
                  title="Logo Title Text 1"
                />
              </div>
              <div className="card__body">
                <h2>猫猫</h2>
                <p>会写小工具的猫。</p>
              </div>
            </div>
          </div>
          <div className={`${styles.introCard}`}>
            <div className="card shadow--md">
              <div className="card__body">
                <h2>
                  Hello! {emojis[Math.floor(Math.random() * emojis.length)]}
                </h2>
                <p>这里是猫猫。</p>
                <p>
                  常用系统：
                  <WinIcon className={styles.inlineIcon} />
                  <ArchIcon className={styles.inlineIcon} />
                  <DebianIcon className={styles.inlineIcon} />
                </p>
                <p>
                  前端喜欢用这些：
                  <TsIcon className={styles.inlineIcon} />
                  <ReactIcon className={styles.inlineIcon} />
                  <NextjsIcon className={styles.inlineIcon} />
                </p>
                <p>
                  后端用这些：
                  <NextjsIcon className={styles.inlineIcon} />
                  <RustIcon className={styles.inlineIcon} />
                  <PythonIcon className={styles.inlineIcon} />
                </p>
                <p>
                  数据库用这些：
                  <GraphqlIcon className={styles.inlineIcon} />
                  <PostgreIcon className={styles.inlineIcon} />
                </p>
                <p>喜欢新技术，偶尔写一些小玩具。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
