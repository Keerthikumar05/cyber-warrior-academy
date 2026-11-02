<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Deployment compatibility
- Keep `@tanstack/react-start` at >=1.169.4 so the resolved `@tanstack/start-server-core` is >=1.169.39 (GHSA-qx66-fv34-fjm8 XSS fix); Vercel rejects older versions at install. In createServerFn chains the API is `.validator(...)` (not `.inputValidator(...)`), and route error components type props as `ErrorComponentProps` from `@tanstack/react-router` where `error` is `unknown`.
- Vercel deploys build with plain `npm run build` (nitro auto-detects Vercel and emits `.vercel/output` Build Output API v3); do not force the Cloudflare preset — the sandbox build target is set by the Lovable config and applies only inside the sandbox.
- Lockfiles: regenerate `package-lock.json` with npm (`npm install --package-lock-only`) after dependency changes and keep `bun.lock` in sync with `bun add`; both must agree with `package.json`.
