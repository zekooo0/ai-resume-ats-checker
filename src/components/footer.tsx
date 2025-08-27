import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © 2024 ATS AI Checker. Built with
          {" "}
          <a
            href="https://www.npmjs.com/package/multisync"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            multisync
          </a>
          .
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zekooo0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.npmjs.com/package/multisync"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="multisync on npm"
            className="inline-flex items-center"
            title="multisync on npm"
          >
            {/* Simple npm badge icon */}
            <span
              className="inline-flex select-none items-center justify-center h-5 px-2 rounded-sm font-bold text-[10px] leading-none"
              style={{ backgroundColor: "#CB3837", color: "#ffffff" }}
            >
              npm
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
