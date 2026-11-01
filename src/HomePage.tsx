import { useMemo, useState } from "react";
import type { FolioDoc } from "@uichat-mira/folio";

type Props = { docs: FolioDoc[]; basePath: string };
const groups = ["全部", "日常", "随想", "好物"] as const;

function href(base: string, path: string) {
  const prefix = base.endsWith("/") ? base : base + "/";
  return prefix + path.replace(/^\/+/, "") + (path === "/" ? "" : "/");
}

export function HomePage({ docs, basePath }: Props) {
  const [active, setActive] = useState<string>("全部");
  const articles = useMemo(
    () => docs.filter((doc) => doc.type === "article")
      .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? ""))),
    [docs],
  );
  const visible = active === "全部" ? articles : articles.filter(
    (doc) => doc.group === active || doc.tags.includes(active),
  );

  return (
    <main className="moyu-home">
      <section className="moyu-hero" aria-labelledby="moyu-title">
        <div className="moyu-hero__copy">
          <span className="moyu-kicker"><span className="moyu-live-dot" /> AN UNHURRIED LITTLE CORNER</span>
          <p className="moyu-intro">工作之外，还有生活。</p>
          <h1 id="moyu-title">摸鱼划水<span>记录</span><i>。</i></h1>
          <p className="moyu-hero__lede">
            记一点日常，存几段心情。忙里偷闲不必找借口，生活本来就值得认真记录。
          </p>
          <div className="moyu-hero__actions">
            <a className="moyu-button moyu-button--primary" href="#writing">看看最近写的 <span aria-hidden="true">↘</span></a>
            <a className="moyu-text-link" href={href(basePath, "/about")}>关于这里 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="moyu-hero__art">
          <div className="moyu-art__frame">
            <span className="moyu-art__top">SLOW DAYS / GOOD STORIES</span>
            <img src={href(basePath, "/pond.svg").replace(/\/$/, "")} alt="鱼儿游过水面的简约插画" />
            <div className="moyu-art__bottom"><span>日常收集所</span><span>VOL. 01</span></div>
          </div>
          <span className="moyu-art__stamp" aria-hidden="true">有空常来</span>
        </div>
      </section>

      <section className="moyu-about-strip" aria-label="小站的三个主题">
        <div><span>01 / DAILY</span><strong>日常碎片</strong><p>小事也值得留个纪念。</p></div>
        <div><span>02 / THOUGHTS</span><strong>偶尔想想</strong><p>走走停停，记下念头。</p></div>
        <div><span>03 / FINDS</span><strong>好物与发现</strong><p>喜欢的东西，慢慢分享。</p></div>
      </section>

      <section id="writing" className="moyu-writing" aria-labelledby="writing-heading">
        <div className="moyu-section-head">
          <div>
            <span className="moyu-eyebrow">THE JOURNAL</span>
            <h2 id="writing-heading">最近在写 <span>✳</span></h2>
          </div>
          <p>想到什么，就写什么。<br />让普通的日子，有迹可循。</p>
        </div>

        <div className="moyu-filters" role="group" aria-label="筛选文章">
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              aria-pressed={active === group}
              className={active === group ? "is-selected" : ""}
              onClick={() => setActive(group)}
            >{group}{group === "全部" ? <small>{articles.length}</small> : null}</button>
          ))}
        </div>

        {visible.length ? (
          <div className="moyu-post-grid">
            {visible.map((doc, index) => (
              <a className="moyu-post" key={doc.path} href={href(basePath, doc.path)}>
                <div className="moyu-post__index">{String(index + 1).padStart(2, "0")} <span>↗</span></div>
                <span className="moyu-post__category">{doc.group || "日常"} {doc.date ? <time dateTime={doc.date}>· {doc.date}</time> : null}</span>
                <h3>{doc.title}</h3>
                <p>{doc.description}</p>
                <span className="moyu-post__read">继续阅读 <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        ) : (
          <div className="moyu-empty">
            <span className="moyu-empty__mark" aria-hidden="true">✦</span>
            <div><h3>{active === "全部" ? "故事正在整理中" : "这一栏暂时还没有内容"}</h3>
              <p>旧站的文章与照片还在核对，确认原文和日期后再放上来。这里不会用虚构内容填满页面。</p>
              <a href={href(basePath, "/about")}>先认识这个小站 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        )}
      </section>

      <section className="moyu-ending">
        <span>ONE DAY AT A TIME</span>
        <h2>慢一点，也挺好。</h2>
        <p>此处不赶路，只记录沿途。</p>
        <a href={href(basePath, "/about")}>关于摸鱼划水记录 ↗</a>
      </section>
    </main>
  );
}
