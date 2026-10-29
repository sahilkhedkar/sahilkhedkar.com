import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../../components/code-block";
import { FolderTree } from "../../components/folder-tree";
import { ShareButton } from "../../components/share-button";
import { posts, type Post } from "../../lib/profile";

const post = posts.find((p: Post) => p.slug === "routing-in-nextjs")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
};

export default function NextJSRoutingGuide() {
  return (
    <article className="essay">
      <div className="back-btn-container">
        <Link href="/blogs" className="back-to-blogs-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="back-icon"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z" />
          </svg>
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Hero Banner with Next.js Grid Graphic */}
      <div className="essay-hero-card" aria-hidden="true">
        <img
          src="/blog/nextjs-hero.svg"
          alt="Next.js App Router"
        />
      </div>

      <h1>{post.title}</h1>
      <p className="lede">{post.description}</p>

      <div className="post-meta">
        <div className="post-meta-date">
          <svg
            className="calendar-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <time dateTime={post.date}>{post.displayDate}</time>
        </div>
        <ShareButton title={post.title} />
      </div>

      <hr className="essay-divider" />

      <h2>Routing in Next.js</h2>
      <p>
        Next.js has a file-system-based routing system. The URLs you can access in your browser
        are determined by how you organize your files and folders within your project.
      </p>

      <h2>
        Understanding the <code>src/app</code> Directory
      </h2>
      <p>
        In Next.js (when using the App Router), the <code>src/app</code> directory serves as the
        foundation for your application&apos;s structure. Key files inside this directory include:
      </p>
      <ul>
        <li>
          <code>layout.tsx</code> - Defines the layout for your application, allowing you to persist UI
          elements across different pages.
        </li>
        <li>
          <code>page.tsx</code> - Represents the content of a particular route.
        </li>
      </ul>

      <h2>Scenario 1: Creating a Homepage</h2>
      <p>Suppose you want to have a homepage accessible at:</p>
      <div className="essay-url">http://localhost:3000/</div>
      <p>
        To achieve this, ensure that a <code>page.tsx</code> file exists inside the{" "}
        <code>src/app</code> directory. By default, this file is created when you initialize a
        Next.js project.
      </p>

      <CodeBlock
        code={`
          // src/app/page.tsx
          export default function HomePage() {
            return <h1>Welcome to the Homepage</h1>;
          }
        `}
      />

      <h2>Scenario 2: Creating Additional Pages</h2>
      <p>Now, let&apos;s say you want to create additional pages with different URLs.</p>

      <h3>Creating an About Page</h3>
      <p>To create a page accessible at:</p>
      <div className="essay-url">http://localhost:3000/about</div>
      <p>Follow the same steps as above:</p>
      <ol>
        <li>
          Inside <code>src/app</code>, create a folder named <code>about</code>.
        </li>
        <li>
          Inside <code>about</code>, create a <code>page.tsx</code> file.
        </li>
        <li>Add the following code:</li>
      </ol>

      <CodeBlock
        code={`
          // src/app/about/page.tsx
          export default function About() {
            return <h1>About Us</h1>;
          }
        `}
      />


      <h2>Folder Structure for the Pages</h2>
      <p>After adding these pages, your <code>src/app</code> directory will look like this:</p>

      <div className="folder-structure-img-card">
        <img
          src="/blog/folder-structure.png"
          alt="Folder Structure for Next.js App Router"
          className="folder-structure-img"
        />
      </div>

      <p>
        Notice the core principle: the name of each folder corresponds directly to the URL segment,
        and the <code>page.tsx</code> file inside makes that path publicly accessible.
      </p>

      <hr className="essay-divider" />

      <h2>Nested Routes</h2>
      <h3>Scenario 3: Creating Blog Pages</h3>
      <p>Suppose you want to handle the following routes:</p>
      <ul className="essay-url-list">
        <li>http://localhost:3000/blog</li>
        <li>http://localhost:3000/blog/first</li>
        <li>http://localhost:3000/blog/second</li>
      </ul>

      <p>
        In Next.js, nested routes are created by nesting folders inside one another.
        To implement these routes:
      </p>
      <ol>
        <li>
          Create a <code>blog</code> folder inside <code>src/app</code>.
        </li>
        <li>
          Inside <code>blog</code>, create a <code>page.tsx</code> file for the main blog index (<code>/blog</code>).
        </li>
        <li>
          Inside <code>blog</code>, create a subfolder named <code>first</code> with its own <code>page.tsx</code> (<code>/blog/first</code>).
        </li>
        <li>
          Inside <code>blog</code>, create another subfolder named <code>second</code> with its own <code>page.tsx</code> (<code>/blog/second</code>).
        </li>
      </ol>

      <FolderTree
        tree={`
          src/app/
            blog/
              page.tsx   - Main Blog List (/blog)
              first/
                page.tsx - First Blog Post (/blog/first)
              second/
                page.tsx - Second Blog Post (/blog/second)
        `}
      />

      <h3>Nested Layouts</h3>
      <p>
        One of the biggest strengths of the App Router is that layouts can be nested. If you add a{" "}
        <code>layout.tsx</code> inside the <code>blog</code> folder, it will automatically wrap the
        blog listing and all nested blog posts without re-mounting when you navigate between them:
      </p>

      <CodeBlock
        code={`
          // src/app/blog/layout.tsx
          export default function BlogLayout({
            children,
          }: {
            children: React.ReactNode;
          }) {
            return (
              <div className="blog-wrapper">
                <nav className="blog-sidebar">
                  <h3>Recent Posts</h3>
                  {/* Shared blog sidebar */}
                </nav>
                <main>{children}</main>
              </div>
            );
          }
        `}
      />

      <hr className="essay-divider" />

      <h2>Dynamic Routing</h2>
      <p>
        What if you have dozens or hundreds of blog posts, or an online shop with thousands of products?
        Creating a physical folder by hand for every single post or product is neither realistic nor maintainable.
      </p>
      <p>
        This is where <strong>Dynamic Routes</strong> come into play. In Next.js, you define a dynamic segment
        by wrapping a folder name in square brackets: <code>[paramName]</code>.
      </p>

      <FolderTree
        tree={`
          src/app/
            blog/
              page.tsx       - Blog list (/blog)
              [slug]/
                page.tsx     - Dynamic blog post (/blog/:slug)
        `}
      />

      <p>
        Any URL matching <code>/blog/anything</code> will be routed to{" "}
        <code>src/app/blog/[slug]/page.tsx</code>, with the dynamic segment passed directly as a
        parameter.
      </p>

      <h3>Accessing Dynamic Parameters</h3>
      <p>
        In Next.js Server Components, page components receive <code>params</code> as an asynchronous promise:
      </p>

      <CodeBlock
        code={`
          // src/app/blog/[slug]/page.tsx
          export default async function BlogPost({
            params,
          }: {
            params: Promise<{ slug: string }>;
          }) {
            const { slug } = await params;

            return (
              <article>
                <h1>Reading Post: {slug}</h1>
                <p>Showing content for article with slug: {slug}</p>
              </article>
            );
          }
        `}
      />

      <p>
        If a visitor opens <code>/blog/learning-nextjs</code>, <code>slug</code> will be{" "}
        <code>"learning-nextjs"</code>. If they open <code>/blog/css-tips</code>, <code>slug</code>{" "}
        will be <code>"css-tips"</code>.
      </p>

      <hr className="essay-divider" />

      <h2>Handling Unknown Nested Routes (Catch-All Segments)</h2>
      <p>
        Dynamic routes like <code>[slug]</code> handle one dynamic level (e.g. <code>/blog/:slug</code>).
        But what if you are building documentation, a file explorer, or an e-commerce catalog where
        the path can have an arbitrary number of sub-levels?
      </p>
      <ul className="essay-url-list">
        <li>http://localhost:3000/docs/getting-started</li>
        <li>http://localhost:3000/docs/components/buttons</li>
        <li>http://localhost:3000/docs/installation/macos/m-series/troubleshooting</li>
      </ul>

      <h3>1. Catch-All Segments: <code>[...slug]</code></h3>
      <p>
        To match all subsequent nested segments, prefix the parameter name inside the brackets with
        three dots: <code>[...slug]</code>.
      </p>

      <FolderTree
        tree={`
          src/app/
            docs/
              [...slug]/
                page.tsx - Catches all nested subpaths
        `}
      />

      <p>
        Next.js passes the captured path segments to your page component as an <strong>array of strings</strong>:
      </p>

      <CodeBlock
        code={`
          // src/app/docs/[...slug]/page.tsx
          export default async function DocsPage({
            params,
          }: {
            params: Promise<{ slug: string[] }>;
          }) {
            const { slug } = await params;

            return (
              <div>
                <h1>Documentation</h1>
                <p>Path segments: {slug.join(" / ")}</p>
              </div>
            );
          }
        `}
      />

      <p>Here is how different URLs map to the <code>slug</code> array:</p>
      <ul>
        <li>
          <code>/docs/intro</code> &rarr; <code>slug = [&quot;intro&quot;]</code>
        </li>
        <li>
          <code>/docs/ui/buttons</code> &rarr; <code>slug = [&quot;ui&quot;, &quot;buttons&quot;]</code>
        </li>
        <li>
          <code>/docs/a/b/c/d</code> &rarr; <code>slug = [&quot;a&quot;, &quot;b&quot;, &quot;c&quot;, &quot;d&quot;]</code>
        </li>
      </ul>

      <h3>2. Optional Catch-All Segments: <code>[[...slug]]</code></h3>
      <p>
        There is one important detail with <code>[...slug]</code>: it requires at least one segment.
        Visiting <code>/docs</code> directly would result in a 404 unless a separate{" "}
        <code>src/app/docs/page.tsx</code> exists.
      </p>
      <p>
        If you want a single file to handle both the base route (<code>/docs</code>) and all nested
        routes (<code>/docs/*</code>), wrap the parameter in double brackets: <code>[[...slug]]</code>.
      </p>

      <FolderTree
        tree={`
          src/app/
            docs/
              [[...slug]]/
                page.tsx - Handles /docs AND /docs/*
        `}
      />

      <p>
        When a user visits <code>/docs</code>, <code>slug</code> will be <code>undefined</code>. When
        they visit <code>/docs/setup</code>, <code>slug</code> will be <code>[&quot;setup&quot;]</code>.
      </p>

      <hr className="essay-divider" />

      <h2>Route Groups &amp; Private Folders</h2>

      <h3>Route Groups: <code>(groupName)</code></h3>
      <p>
        Sometimes you want to group related routes together or give different sections of your app
        different layouts, without modifying the browser URL. Wrapping a folder name in parentheses
        marks it as a <strong>Route Group</strong>:
      </p>

      <FolderTree
        tree={`
          src/app/
            (marketing)/
              layout.tsx - Public marketing layout (header + footer)
              about/
                page.tsx - Accessible at /about (not /marketing/about)
            (auth)/
              layout.tsx - Centered distraction-free layout
              login/
                page.tsx - Accessible at /login
              signup/
                page.tsx - Accessible at /signup
        `}
      />

      <p>
        The parentheses instruct Next.js: <em>use this folder to organize code and scope layouts, but omit this segment from the public URL.</em>
      </p>

      <h3>Private Folders: <code>_folderName</code></h3>
      <p>
        By prefixing a folder name with an underscore, you mark it as a private implementation detail.
        Next.js will completely ignore the folder and all its subfolders from the routing system:
      </p>
      <ul>
        <li>
          <code>src/app/_components/button.tsx</code> - Safe to store components, not accessible via browser.
        </li>
        <li>
          <code>src/app/_lib/db.ts</code> - Private database helper, never routable.
        </li>
      </ul>

      <hr className="essay-divider" />

      <h2>Special Route Files</h2>
      <p>
        The App Router reserves specific file conventions that transform ordinary React components
        into powerful architectural boundaries:
      </p>

      <ul className="special-files-list">
        <li>
          <code>page.tsx</code> — Makes the route publicly accessible and defines its unique UI.
        </li>
        <li>
          <code>layout.tsx</code> — Wraps child pages, preserves state across transitions, and avoids re-renders.
        </li>
        <li>
          <code>loading.tsx</code> — Automatically wraps the route segment in a React Suspense boundary with a fallback skeleton.
        </li>
        <li>
          <code>error.tsx</code> — A client error boundary that catches runtime errors without crashing the entire app.
        </li>
        <li>
          <code>not-found.tsx</code> — Custom 404 UI rendered when a route does not exist or when <code>notFound()</code> is invoked.
        </li>
        <li>
          <code>route.ts</code> — Creates a backend HTTP API endpoint handling <code>GET</code>, <code>POST</code>, etc.
        </li>
      </ul>

      <h2>Summary</h2>
      <p>
        Next.js file-system routing eliminates the need for complex route configuration files.
        By combining folder nesting, layouts that persist state, dynamic segments (<code>[slug]</code>),
        and catch-all routes (<code>[...slug]</code>), you can structure virtually any web application
        intuitively and maintainably.
      </p>
    </article>
  );
}
