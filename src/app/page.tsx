import OpenExternalLink from "@/components/external-link";
import { getRecording } from "./actions";
export default async function HomePage() {
  const url =
    "https://audio.typhon-sirius.ts.net/api/video/2024_07_04-230439000_WHSHPR_2024-05-18%20-%20Grandma%20telling%20me%20and%20dathi%20about%20the%20past.m4a/download/";
  const response = await fetch(url);
  console.log(response);
  return (
    <main>
      <div>
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the{" "}
          <OpenExternalLink href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">
            README
          </OpenExternalLink>{" "}
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
        <audio controls="controls" autoplay="autoplay">
          <source
            src="https://audio.typhon-sirius.ts.net/api/video/2024_07_04-230439000_WHSHPR_2024-05-18%20-%20Grandma%20telling%20me%20and%20dathi%20about%20the%20past.m4a"
            type="audio/mp4"
          />
        </audio>
      </div>
    </main>
  );
}
