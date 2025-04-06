import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useEffect, useState } from "react";

import Link from "@docusaurus/Link";
import {
  SiArchlinux,
  SiDebian,
  SiGraphql,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="w-full justify-center content-center text-center bg-[url(/img/wave.jpg)] bg-center bg-cover bg-fixed">
      <div className="w-full my-32">
        <Heading as="h1" className="hero__title  text-shadow-lg">
          <span className="text-slate-50 dark:text-slate-200">
            {siteConfig.title}
          </span>
        </Heading>
        <p className="text-2xl text-slate-50 text-shadow-lg">
          {siteConfig.tagline}
          <br />
          猫猫要把所有美好的事物都记录下来
        </p>
        <div className="flex gap-16 mt-16 content-center justify-center">
          <div className="flex-none">
            <Link className="button button--secondary button--lg" to="/docs/">
              文档
            </Link>
          </div>
          <div className="flex-none">
            <Link className="button button--secondary button--lg" to="/blog">
              博客
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const emojis = [
    "～(∠・ω< )⌒★",
    "(*´∀`)~♥",
    "ᕕ ( ᐛ ) ᕗ",
    "_(:3 ⌒ﾞ)_",
    "(σﾟ∀ﾟ)σ..:*☆",
  ];
  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  }, []);

  return (
    <Layout
      // 标题，将会放置于 head 标签中
      // title={siteConfig.title}
      // 描述，将会放置于 head 标签中
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main>
        <div className="flex gap-8 w-[90%] max-w-7xl mx-auto my-[4vw]">
          <div className="w-64 min-w-32 max-w-72 flex-auto">
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
          <div className="flex-auto">
            <div className="card shadow--md">
              <div className="card__body">
                <h2> Ciallo {emoji} </h2>
                <p>什么都会点，喜欢新技术，偶尔写一些小玩具。</p>
                <h3>使用系统</h3>
                <div className="flex gap-8 mb-4">
                  <SiArchlinux
                    className="flex-none"
                    title="ArchLinux"
                    color="#1793D1"
                    size={42}
                  />
                  <SiDebian
                    className="flex-none"
                    title="Debian"
                    color="#A81D33"
                    size={42}
                  />
                </div>
                <h3>前端工具链</h3>
                <div className="flex gap-8 mb-4">
                  <SiTypescript
                    className="flex-none"
                    title="Typescript"
                    color="#3178C6"
                    size={42}
                  />
                  <SiReact
                    className="flex-none"
                    title="React"
                    color="#61DAFB"
                    size={42}
                  />
                  <SiNextdotjs
                    className="flex-none text-current"
                    title="NextJs"
                    size={42}
                  />
                </div>
                <h3>后端语言</h3>
                <div className="flex gap-8 mb-4">
                  <SiNextdotjs
                    className="flex-none text-current"
                    title="NextJs"
                    size={42}
                  />
                  <SiRust
                    className="flex-none text-current"
                    title="Rust"
                    size={42}
                  />
                  <SiPython
                    className="flex-none"
                    title="Python"
                    color="#3776AB"
                    size={42}
                  />
                </div>
                <h3>数据库</h3>
                <div className="flex gap-8 mb-4">
                  <SiGraphql
                    className="flex-none"
                    title="GraphQL"
                    color="#E10098"
                    size={42}
                  />
                  <SiPostgresql
                    className="flex-none"
                    title="Postgresql"
                    color="#4169E1"
                    size={42}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
