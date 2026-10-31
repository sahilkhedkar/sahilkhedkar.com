import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../../components/code-block";
import { ShareButton } from "../../components/share-button";
import { posts, type Post } from "../../lib/profile";

const post = posts.find((item: Post) => item.slug === "youtube-music-now-playing")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
};

export default function YouTubeMusicNowPlayingPost() {
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

      <div className="essay-hero-card">
        <img
          src="/blog/yt-music-banner.svg"
          alt="YouTube Music logo with red sound waves"
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

      <p>
        This started as a small portfolio idea: I wanted the site to show what I was listening to
        while I worked. The card itself was easy. The question that took me longer was where the
        track data could come from.
      </p>
      <p>
        With Spotify, there is a documented “currently playing” endpoint. You authorize the account
        and request its active track. YouTube Music has a public Data API too, but its published
        resources cover things like videos and playlists; I could not find a documented endpoint
        for the current session inside an open YouTube Music tab. That is a narrower claim than
        “YouTube has no API”: the missing piece is a supported way for my portfolio server to ask
        what this browser is playing. I compared Spotify&apos;s{" "}
        <a href="https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track" target="_blank" rel="noopener noreferrer">current-track endpoint</a>{" "}
        with Google&apos;s{" "}
        <a href="https://developers.google.com/youtube/data/reference/rest" target="_blank" rel="noopener noreferrer">YouTube Data API reference</a>.
      </p>
      <p>
        That changed the shape of the project. The browser already had the answer; my server did
        not. So I made the browser the source of truth and used a Chrome extension to carry a small
        amount of track metadata to the site. It never captures audio. It sends the title, artist,
        artwork, playback state, and timing information that the player exposes.
      </p>

      <figure className="music-flow-sketch">
        <img
          src="/blog/pasted-image.png"
          alt="The pasted sketch showing YouTube Music sending track details through the extension and API to the portfolio"
        />
      </figure>
      <ul className="music-flow-points">
        <li>
          The extension reads track details in the browser and sends metadata to the portfolio API;
          it does not capture or upload audio.
        </li>
        <li>
          The API stores the latest state in Redis so production instances can share it, then the
          portfolio refreshes through server events and polling.
        </li>
      </ul>

      <h2>1. I started with the browser, not the server</h2>
      <p>
        My first source was the browser&apos;s Media Session metadata. When a site sets it, the browser
        can expose a track title, artist, album, artwork, and playback state. It is the cleanest
        place to start, and it is a standard browser feature. YouTube Music does not always populate
        every field consistently, though, so I treated it as the best source rather than the only
        source. The{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/metadata" target="_blank" rel="noopener noreferrer">Media Session API reference</a>{" "}
        describes the metadata surface.
      </p>
      <p>
        The extension tries sources in order: Media Session first, then YouTube Music&apos;s player
        data and player-bar DOM, with the video element and page title as fallbacks. That ordering
        matters. The internal player object and DOM selectors are private implementation details;
        they can change when YouTube Music ships an update. I keep them behind the standard
        Media Session path so a selector change does not define the whole feature.
      </p>
      <p>
        YouTube Music is a single-page app, so changing a track does not reload the tab. I watch
        player-bar mutations and video play/pause/end events, then do a light periodic check for
        changes the events miss. I also reject values such as “Home” or “Library”—otherwise a
        navigation label can briefly masquerade as a song title.
      </p>

      <h2>2. I crossed Chrome&apos;s two JavaScript worlds</h2>
      <p>
        A Chrome content script has an isolated JavaScript world. That is good for security, but it
        means it cannot directly read page-owned objects on YouTube Music. I split the work:
        <code>bridge.ts</code> runs in the page&apos;s <code>MAIN</code> world and reads player data;
        <code>content.ts</code> runs in the extension world, checks the result, and can use Chrome
        extension APIs.
      </p>
      <p>
        The bridge passes a small message through <code>window.postMessage</code>. This is a
        handoff, not authentication: page messages can be observed or imitated. The content script
        validates the payload, and only the extension&apos;s service worker sends the authenticated
        request to my API.
      </p>
      <CodeBlock
        code={`
          // Page MAIN world: publish the player snapshot
          window.postMessage({
            source: "YTM_NOW_PLAYING_BRIDGE",
            payload: track,
          }, "*");

          // Extension content world: accept only our bridge message
          window.addEventListener("message", (event) => {
            if (event.data?.source !== "YTM_NOW_PLAYING_BRIDGE") return;
            latestBridgeTrack = event.data.payload;
            checkAndUpdate();
          });
        `}
      />

      <h2>3. I kept network access in the extension worker</h2>
      <p>
        The content script sends a typed message to the Manifest V3 service worker. The worker
        loads the saved endpoint and secret from <code>chrome.storage.sync</code>, adds a Bearer
        token, and posts JSON to <code>/api/now-playing</code>. Keeping the request here gives the
        browser extension one clear place for connection status and local-versus-live
        routing.
      </p>
      <CodeBlock
        code={`
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(track),
          });
        `}
      />
      <p>
        I do not send a request on every metadata check. A new song or play/pause change is sent
        right away; while a track is playing, the extension refreshes its state every four seconds.
        That refresh doubles as a liveness signal. If the browser closes before it can say “stopped,”
        the server can still tell that the last update is old.
      </p>
      <h2>4. I made one small API the meeting point</h2>
      <p>
        The site&apos;s <code>POST /api/now-playing</code> route checks the token, validates the
        payload, normalizes the track fields, saves the latest state, and notifies visitors. The
        visitor page fetches the current state on load, listens for server-sent events, and polls
        periodically as a fallback. It is a simple shape: one current track, many readers.
      </p>
      <CodeBlock
        code={`
          const saved = await saveNowPlayingState(newState);
          broadcastNowPlaying(saved);

          return NextResponse.json({ success: true, data: saved });
        `}
      />
      <p>
        There is one extra metadata repair path worth calling out. If the browser sends an unusable
        title but includes a video ID, the API first tries YouTube&apos;s oEmbed response for that
        video. If that still cannot resolve a title, the current implementation tries to read a
        title from YouTube search-result HTML. That second fallback is deliberately not the source
        of live playback state—and it is the least stable part of the pipeline, because page HTML
        is not a supported API contract. The live state still comes from the open player in the
        browser.
      </p>
      <CodeBlock
        code={`
          // Repair incomplete metadata from a known video ID
          const url =
            "https://www.youtube.com/oembed?url=" +
            encodeURIComponent("https://www.youtube.com/watch?v=" + videoId) +
            "&format=json";

          const response = await fetch(url);
          if (response.ok) {
            const video = await response.json();
            title = cleanSongTitle(video.title, artist);
          }
        `}
      />
      <p>
        These calls solve a different problem from playback detection. oEmbed can describe a known
        video; it cannot tell my server what is playing in my browser right now. The search-page
        fallback is even more fragile: it depends on YouTube&apos;s HTML shape and can stop matching
        after a site change. Because the API waits for these lookups before saving an invalid
        update, a slow response can also delay that repair request. I keep this path as
        best-effort metadata cleanup; it is not the source of the live track.
      </p>

      <h2>A map of the files</h2>
      <p>
        I kept the extension and website as separate pieces. The extension gathers and sends the
        update; the Next.js app accepts it, stores it, and renders it. Here are the files I touched
        most often:
      </p>
      <figure className="file-tree">
        <pre>
          <code>{`apps/
├── extension/
│   ├── manifest.json
│   └── src/
│       ├── bridge.ts
│       ├── content.ts
│       ├── background.ts
│       ├── popup.ts
│       └── types.ts
└── web/app/
    ├── page.tsx
    ├── components/now-playing.tsx
    ├── api/now-playing/route.ts
    ├── api/now-playing/stream/route.ts
    └── lib/now-playing/
        ├── storage.ts
        ├── broadcaster.ts
        └── types.ts
`}</code>
        </pre>
      </figure>
      <p>
        <code>manifest.json</code> is what wires the browser side together: Chrome loads the
        compiled <code>bridge.js</code> in the page&apos;s main world and <code>content.js</code> as
        the isolated content script. The build turns the TypeScript files in <code>src</code> into
        those JavaScript files in <code>dist</code>. The small <code>types.ts</code> module is
        imported by the extension scripts so the track shape and message names stay consistent.
      </p>
      <p>
        On the website, <code>app/page.tsx</code> imports the storage function and the player
        component. It reads the first state on the server, then passes it into the client component
        so the page has something to render before the live connection starts:
      </p>
      <CodeBlock
        code={`
          import { NowPlaying } from "./components/now-playing";
          import { getNowPlayingState } from "./lib/now-playing/storage";

          const initialData = await getNowPlayingState();

          // In the page JSX:
          <NowPlaying initialData={initialData} />
        `}
      />
      <p>
        After that, <code>now-playing.tsx</code> fetches updates from the API and listens to{" "}
        <code>/api/now-playing/stream</code>. The route imports <code>storage.ts</code> to read or
        save the track and <code>broadcaster.ts</code> to notify connected visitors. That separation
        made it much easier to trace a bug: I could check whether it started in the browser,
        during the POST, in shared storage, or in the page that displays the result.
      </p>
      <CodeBlock
        code={`
          // apps/web/app/api/now-playing/route.ts
          import {
            getNowPlayingState,
            saveNowPlayingState,
          } from "../../lib/now-playing/storage";
          import { broadcastNowPlaying } from "../../lib/now-playing/broadcaster";
        `}
      />

      <h2>5. Production changed the storage and delivery assumptions</h2>
      <p>
        Locally, it is easy to mistake a process variable or a file for a database: one development
        server handles the requests, so everything appears to share state. In production, requests
        can land on different serverless instances. An update written into one instance&apos;s memory
        may not exist in the instance serving a visitor&apos;s next request. I configured Redis as the
        shared store so every instance reads the same latest track.
      </p>
      <p>
        Real-time delivery has a similar wrinkle. The server-sent event broadcaster is in-process,
        so it can immediately reach visitors connected to that same instance; it is not a shared
        event bus across all serverless instances. The page therefore also polls the API every 2.5
        seconds. Redis provides the shared truth; polling lets a visitor pick it up even when the
        update and the visitor are connected to different instances.
      </p>
      <p>
        I also had to treat “playing” as temporary state. The extension refreshes while music plays,
        and the API marks a track as no longer live if it has not been updated for five minutes.
        That covers the cases where a laptop sleeps, a tab crashes, or the browser disappears
        before a stop message gets through. The last song can stay visible as recently played
        without claiming it is still playing.
      </p>

      <h2>6. I used the same extension for local work and the live site</h2>
      <p>
        The endpoint changes between environments; the data flow does not. For local development,
        I run the Next.js app on port <code>1234</code>, build the extension, load{" "}
        <code>apps/extension/dist</code> from <code>chrome://extensions</code>, and choose the Local
        preset in the popup. The API and popup must use the same update token:
      </p>
      <CodeBlock
        code={`
          # apps/web/.env.local
          NOW_PLAYING_UPDATE_TOKEN=your-local-secret

          # Terminal 1
          cd apps/web && bun run dev

          # Terminal 2
          cd apps/extension && bun run build
        `}
      />
      <p>
        For the deployed site, I set <code>NOW_PLAYING_UPDATE_TOKEN</code> in the Vercel
        environment and redeploy, then select the Production preset pointing to{" "}
        <code>https://sahilkhedkar.com/api/now-playing</code>. The local <code>.env.local</code>{" "}
        file is only for my machine; it does not set the production secret. If the extension gets
        a 401, I check that both sides have the same token. If the request cannot connect, I use
        Test Connection to check the chosen URL before investigating playback detection.
      </p>
      <p>
        The production app also needs the shared-store credentials configured: this code reads{" "}
        <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> (or a{" "}
        <code>REDIS_URL</code>). Without a reachable Redis store, the development fallbacks can
        keep a track in local memory or a file, but those fallbacks cannot share state across
        production instances. The token lets the extension update the API; Redis lets every API
        instance and visitor read the same track. They solve different problems.
      </p>
      <p>
        Dual Sync is useful while I am developing: the worker can post to production and localhost
        in parallel. Each endpoint is reported separately in the popup, and one successful target
        is enough for sync to count as successful. That lets the live site keep updating while the
        local app is stopped or being rebuilt.
      </p>

      <h2>The small card hides a useful lesson</h2>
      <p>
        The part I enjoyed most was tracing one song all the way through the system: from a player
        running in my browser, across Chrome&apos;s extension boundary, into an authenticated API, and
        back out to everyone visiting the site. The finished card is tiny; getting each handoff
        clear and dependable was the real project.
      </p>
      <p>
        It is still a browser-side integration, not a connection to a YouTube account in the cloud.
        The extension has to be running where the music plays, and YouTube can change the private
        player details the fallbacks rely on. If I revisit this, I would first remove the
        search-page HTML fallback and keep metadata repair on supported interfaces. For now, the
        standard browser metadata is the first choice, the fragile paths are contained, and stale
        tracks stop pretending to be live.
      </p>
    </article>
  );
}
